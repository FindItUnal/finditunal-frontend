import { useState } from 'react';
import { PageTemplate } from '../components/templates';
import { Card, Button } from '../components/atoms';
import { MessageCircle, Send } from 'lucide-react';
import { Chat, Message } from '../types';
import { mockChats as sharedMockChats, mockMessages as sharedMockMessages } from '../data/chats';

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(sharedMockChats[0]);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = sharedMockChats.filter((chat) =>
    chat.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      alert(`Mensaje enviado: ${messageText}`);
      setMessageText('');
    }
  };

  return (
    <PageTemplate>
      <Card padding="none" className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Lista de chats */}
          <div className="border-r border-gray-200 dark:border-gray-700 flex flex-col">
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

            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
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
                        {chat.participantName}
                      </h4>
                      {chat.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-1 bg-teal-600 text-white text-xs rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
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
          <div className="md:col-span-2 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {selectedChat.participantName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Activo ahora
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {sharedMockMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === '1' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === '1'
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === '1'
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
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <Button type="submit" variant="primary" icon={Send}>
                      Enviar
                    </Button>
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
