import { useState, useEffect, useRef } from 'react';
import { PageTemplate } from '../components/templates';
import { Card } from '../components/atoms';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { Chat } from '../types';
import { useToast } from '../context/ToastContext';
import { useConversations, useMarkAsRead } from '../hooks/useConversations';
import { useMessages, useSendMessage } from '../hooks/useMessages';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/atoms';
import { EmptyState } from '../components/organisms';
import useUserStore from '../store/useUserStore';

export default function MessagesPage() {
  const toast = useToast();
  const { conversationId: conversationIdParam } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Obtener conversaciones
  const { data: conversations = [], isLoading: loadingConversations } = useConversations();
  
  // Estado para conversación seleccionada
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener mensajes de la conversación seleccionada
  const conversationId = selectedChat ? parseInt(selectedChat.id, 10) : null;
  const { data: messages = [], isLoading: loadingMessages } = useMessages(conversationId);
  
  // Mutations
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

  // Efecto para seleccionar conversación desde URL params
  useEffect(() => {
    if (conversationIdParam && conversations.length > 0) {
      const chat = conversations.find(c => c.id === conversationIdParam);
      if (chat && (!selectedChat || selectedChat.id !== chat.id)) {
        setSelectedChat(chat);
        // Scroll al final cuando se selecciona una conversación
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        }, 300);
      }
    } else if (!conversationIdParam) {
      // Si no hay conversación en URL, deseleccionar
      setSelectedChat(null);
    }
  }, [conversationIdParam, conversations]);

  // Marcar como leída cuando se selecciona una conversación
  useEffect(() => {
    if (selectedChat && selectedChat.unreadCount > 0) {
      const convId = parseInt(selectedChat.id, 10);
      markAsRead.mutate(convId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat?.id]); // Solo depender del ID, no de markAsRead

  const filteredChats = conversations.filter((chat) =>
    chat.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && conversationId) {
      try {
        await sendMessage.mutateAsync({
          conversationId,
          messageText: messageText.trim(),
        });
        setMessageText('');
        // Scroll al final solo después de enviar exitosamente
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      } catch (err) {
        console.error('Error al enviar mensaje:', err);
        toast.error(err instanceof Error ? err.message : 'Error al enviar el mensaje');
      }
    }
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
      <Card padding="none" className="h-[calc(100vh-200px)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Lista de chats */}
          <div className={`border-r border-gray-200 dark:border-gray-700 flex flex-col ${
            selectedChat ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Mensajes
              </h2>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar conversaciones..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[calc(100vh-300px)]">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => navigate(`/messages/${chat.id}`)}
                  className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 ${
                    selectedChat?.id === chat.id
                      ? 'bg-teal-50 dark:bg-teal-900/20'
                      : ''
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
          <div className={`md:col-span-2 flex flex-col ${
            selectedChat ? 'flex' : 'hidden md:flex'
          }`}>
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate('/messages')}
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

                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar max-h-[calc(100vh-380px)]">
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
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === user?.id || message.senderId === user?.user_id
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === user?.id || message.senderId === user?.user_id
                              ? 'bg-teal-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === user?.id || message.senderId === user?.user_id
                                ? 'text-teal-100'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                      disabled={sendMessage.isPending}
                    />
                    <button
                      type="submit"
                      disabled={sendMessage.isPending || !messageText.trim()}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                        messageText.trim() && !sendMessage.isPending
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
