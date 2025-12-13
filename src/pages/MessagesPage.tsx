import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { PageTemplate } from '../components/templates';
import { Card } from '../components/atoms';
import { MessageCircle, Send, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { Chat, Message } from '../types';
import { useToast } from '../context/ToastContext';
import { useConversations, useMarkAsRead } from '../hooks/useConversations';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/atoms';
import { EmptyState } from '../components/organisms';
import useUserStore from '../store/useUserStore';
import { useSocketIO, MessageData } from '../hooks/useSocketIO';
import { chatService } from '../services/chatService';
import useGlobalStore from '../store/useGlobalStore';
import { getUserId } from '../utils/userUtils';

export default function MessagesPage() {
  const toast = useToast();
  const { conversationId: conversationIdParam } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;

  // Refs para scroll y estado previo
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const previousConversationRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);

  // Socket.IO para tiempo real
  const {
    isConnected,
    joinConversation,
    leaveConversation,
    markAsRead: socketMarkAsRead,
    onNewMessage,
    onNewNotification,
    onConversationRead,
  } = useSocketIO();

  // Obtener conversaciones
  const {
    data: conversations = [],
    isLoading: loadingConversations,
    refetch: refetchConversations,
  } = useConversations();

  // Estado para conversación seleccionada y mensajes
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mutation para marcar como leído (fallback REST)
  const markAsReadMutation = useMarkAsRead();

  // Función para scroll al final — intenta desplazar el contenedor de mensajes
  // en lugar de hacer scroll de toda la página.
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (container) {
      // preferimos scrollTo con comportamiento suave
      try {
        container.scrollTo({ top: container.scrollHeight, behavior });
        return;
      } catch (e) {
        // fallback a scrollTop si scrollTo no soporta behavior
        container.scrollTop = container.scrollHeight;
        return;
      }
    }

    // fallback global
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Scroll automático cuando cambian los mensajes
  useLayoutEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Cargar mensajes cuando cambia conversationIdParam
  useEffect(() => {
    const loadConversation = async () => {
      // Prevenir ejecuciones duplicadas
      if (isLoadingRef.current) return;

      if (!conversationIdParam || !userId) {
        // Limpiar si no hay conversación seleccionada
        if (previousConversationRef.current) {
          leaveConversation(parseInt(previousConversationRef.current, 10));
          previousConversationRef.current = null;
        }
        setSelectedChat(null);
        setMessages([]);
        return;
      }

      // Evitar recargar la misma conversación
      if (previousConversationRef.current === conversationIdParam) {
        return;
      }

      // Salir de la conversación anterior
      if (previousConversationRef.current) {
        leaveConversation(parseInt(previousConversationRef.current, 10));
      }

      const conversationId = parseInt(conversationIdParam, 10);
      previousConversationRef.current = conversationIdParam;
      isLoadingRef.current = true;

      // Buscar chat en la lista de conversaciones (si está disponible)
      const chatFromList = conversations.find((c) => c.id === conversationIdParam);
      if (chatFromList) {
        setSelectedChat(chatFromList);
      } else {
        // Crear un chat temporal mientras carga
        setSelectedChat({
          id: conversationIdParam,
          participantId: '',
          participantName: 'Cargando...',
          lastMessage: '',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
        });
      }

      // Cargar mensajes
      setLoadingMessages(true);
      setMessages([]);

      try {
        const data = await chatService.getMessages(apiUrl, String(userId), conversationId);

        const transformedMessages: Message[] = data.map((msg) => ({
          id: msg.message_id.toString(),
          senderId: msg.sender_id,
          senderName: msg.sender_id === userId ? 'Tú' : 'Usuario',
          content: msg.message_text,
          timestamp: msg.created_at,
          read: msg.is_read === 1,
        }));

        setMessages(transformedMessages);

        // Unirse a la conversación via Socket.IO
        joinConversation(conversationId);

        // Marcar como leída si hay mensajes no leídos del otro usuario
        const hasUnread = transformedMessages.some(
          (msg) => !msg.read && msg.senderId !== String(userId)
        );
        if (hasUnread) {
          socketMarkAsRead(conversationId);
          // Usar REST API como fallback (sin agregar a dependencias)
          markAsReadMutation.mutate(conversationId);
        }
      } catch (err) {
        console.error('Error cargando mensajes:', err);
        toast.error('Error al cargar los mensajes');
      } finally {
        setLoadingMessages(false);
        isLoadingRef.current = false;
      }
    };

    loadConversation();
    // Solo dependencias estables - excluimos markAsReadMutation, conversations y toast
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationIdParam, userId, apiUrl, joinConversation, leaveConversation, socketMarkAsRead]);

  // Actualizar selectedChat cuando se carguen las conversaciones
  useEffect(() => {
    if (conversationIdParam && conversations.length > 0 && selectedChat) {
      const chatFromList = conversations.find((c) => c.id === conversationIdParam);
      if (chatFromList && chatFromList.participantName !== selectedChat.participantName) {
        setSelectedChat(chatFromList);
      }
    }
  }, [conversations, conversationIdParam, selectedChat]);

  // Listener de Socket.IO para nuevos mensajes (cuando estás en el room de la conversación)
  useEffect(() => {
    const cleanup = onNewMessage((messageData: MessageData) => {
      console.log('📨 Nuevo mensaje Socket.IO:', messageData);

      const messageConversationId = messageData.conversation_id.toString();
      const currentConversationId = previousConversationRef.current;

      // Si es de la conversación actual
      if (currentConversationId && messageConversationId === currentConversationId) {
        // Verificar que no sea un duplicado (mensaje optimista ya agregado)
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (msg) =>
              msg.id === messageData.message_id.toString() ||
              (msg.id.startsWith('temp-') &&
                msg.content === messageData.message_text &&
                msg.senderId === String(messageData.sender_id))
          );

          if (isDuplicate) {
            // Actualizar el mensaje temporal con el ID real
            return prev.map((msg) =>
              msg.id.startsWith('temp-') &&
              msg.content === messageData.message_text &&
              msg.senderId === String(messageData.sender_id)
                ? {
                    ...msg,
                    id: messageData.message_id.toString(),
                    timestamp: messageData.created_at,
                  }
                : msg
            );
          }

          // Agregar nuevo mensaje
          const newMessage: Message = {
            id: messageData.message_id.toString(),
            senderId: String(messageData.sender_id),
            senderName: String(messageData.sender_id) === String(userId) ? 'Tú' : 'Usuario',
            content: messageData.message_text,
            timestamp: messageData.created_at,
            read: false,
          };

          return [...prev, newMessage];
        });

        // Marcar como leído si el mensaje es del otro usuario
        if (String(messageData.sender_id) !== String(userId)) {
          const convId = parseInt(currentConversationId, 10);
          socketMarkAsRead(convId);
        }
      }

      // Actualizar lista de conversaciones para reflejar el nuevo mensaje
      refetchConversations();
    });

    return cleanup;
  }, [userId, onNewMessage, socketMarkAsRead, refetchConversations]);

  // Listener de notificaciones (para mensajes en OTRAS conversaciones)
  useEffect(() => {
    const cleanup = onNewNotification((notification) => {
      // Si es una notificación de mensaje de chat, actualizar la lista de conversaciones
      if (notification.type === 'chat_message') {
        console.log('🔔 Notificación de nuevo mensaje:', notification);
        refetchConversations();
      }
    });

    return cleanup;
  }, [onNewNotification, refetchConversations]);

  // Listener para cuando el otro usuario marca la conversación como leída
  useEffect(() => {
    const cleanup = onConversationRead((data) => {
      const readConversationId = data.conversation_id.toString();
      const currentConversationId = previousConversationRef.current;

      // Si es la conversación actual, marcar todos MIS mensajes como leídos
      if (currentConversationId && readConversationId === currentConversationId) {
        console.log('✓✓ Mensajes marcados como leídos por el otro usuario');
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === String(userId) ? { ...msg, read: true } : msg
          )
        );
      }

      // Actualizar la lista de conversaciones
      refetchConversations();
    });

    return cleanup;
  }, [onConversationRead, userId, refetchConversations]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (previousConversationRef.current) {
        leaveConversation(parseInt(previousConversationRef.current, 10));
      }
    };
  }, [leaveConversation]);

  const filteredChats = conversations.filter((chat) =>
    chat.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const conversationId = selectedChat ? parseInt(selectedChat.id, 10) : null;

    if (messageText.trim() && conversationId && userId) {
      if (messageText.trim().length > 2000) {
        toast.error('El mensaje es demasiado largo. Máximo 2000 caracteres.');
        return;
      }

      const messageContent = messageText.trim();
      setSendingMessage(true);

      // Agregar mensaje optimista
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: String(userId),
        senderName: 'Tú',
        content: messageContent,
        timestamp: new Date().toISOString(),
        read: false,
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setMessageText('');

      try {
        const result = await chatService.sendMessage(apiUrl, String(userId), conversationId, {
          message_text: messageContent,
        });

        // El mensaje real llegará via Socket.IO, pero actualizamos el ID por si acaso
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === optimisticMessage.id
              ? {
                  ...msg,
                  id: result.message_id.toString(),
                  timestamp: result.created_at,
                }
              : msg
          )
        );
        
        // Mantener foco en el input para seguir escribiendo
        setTimeout(() => {
          messageInputRef.current?.focus();
        }, 0);
      } catch (err) {
        console.error('Error al enviar mensaje:', err);
        toast.error(err instanceof Error ? err.message : 'Error al enviar el mensaje');
        // Remover mensaje optimista
        setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
      } finally {
        setSendingMessage(false);
      }
    }
  };

  const handleSelectChat = (chatId: string) => {
    navigate(`/messages/${chatId}`);
  };

  const handleBackToList = () => {
    navigate('/messages');
  };

  if (loadingConversations) {
    return (
      <PageTemplate>
        <LoadingSpinner message="Cargando conversaciones..." />
      </PageTemplate>
    );
  }

  if (conversations.length === 0) {
    return (
      <PageTemplate>
        <Card>
          <EmptyState
            title="No tienes conversaciones"
            description="Inicia una conversación contactando al dueño de una publicación"
          />
        </Card>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <Card padding="none" className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-180px)] md:h-[calc(100vh-160px)]">
          {/* Lista de chats */}
          <div
            className={`border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden ${
              selectedChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mensajes</h2>
                {isConnected && (
                  <span className="w-2 h-2 bg-green-500 rounded-full" title="Conectado" />
                )}
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar conversaciones..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 ${
                    selectedChat?.id === chat.id ? 'bg-teal-50 dark:bg-teal-900/20' : ''
                  }`}
                >
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {chat.reportTitle || 'Conversación'}
                      </h4>
                      {chat.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-1 bg-teal-600 text-white text-xs rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {chat.participantName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {chat.lastMessage}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(chat.lastMessageTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Panel de conversación */}
          <div
            className={`md:col-span-2 flex flex-col overflow-hidden ${selectedChat ? 'flex' : 'hidden md:flex'}`}
          >
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleBackToList}
                      className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {selectedChat.reportTitle || 'Conversación'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedChat.participantName}
                      </p>
                    </div>
                  </div>
                </div>

                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <LoadingSpinner message="Cargando mensajes..." />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-gray-500 dark:text-gray-400">
                        No hay mensajes. Inicia la conversación
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => {
                        const isOwnMessage =
                          message.senderId === user?.id ||
                          message.senderId === user?.user_id ||
                          message.senderId === String(userId);

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isOwnMessage
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                              }`}
                            >
                              <p className="text-sm break-words whitespace-pre-wrap">
                                {message.content}
                              </p>
                              <div
                                className={`flex items-center justify-end gap-1 mt-1 ${
                                  isOwnMessage ? 'text-teal-100' : 'text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                <span className="text-xs">
                                  {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {/* Mostrar indicador de leído solo en mensajes propios */}
                                {isOwnMessage && (
                                  <span title={message.read ? 'Leído' : 'Entregado'}>
                                    {message.read ? (
                                      <CheckCheck className="w-3.5 h-3.5" />
                                    ) : (
                                      <Check className="w-3.5 h-3.5" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {/* Elemento invisible para scroll automático */}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0"
                >
                  <div className="relative">
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                      disabled={sendingMessage}
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !messageText.trim()}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                        messageText.trim() && !sendingMessage
                          ? 'bg-teal-600 hover:bg-teal-700 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Selecciona una conversación
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Elige un chat de la lista para comenzar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </PageTemplate>
  );
}
