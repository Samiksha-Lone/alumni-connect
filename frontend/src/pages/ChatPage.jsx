import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import ChatList from '../components/ChatList';
import ChatRoom from '../components/ChatRoom';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const location = useLocation();

  const initialPartnerId = location.state?.partnerId || null;
  const initialPartnerName = location.state?.partnerName || 'Alumni';
  const initialMessage = location.state?.initialMessage || null;

  useEffect(() => {
    if (initialPartnerId) {
      setSelectedChat({ 
        partnerId: initialPartnerId, 
        name: initialPartnerName,
        initialMessage: initialMessage 
      });
    }
  }, [initialPartnerId, initialPartnerName, initialMessage]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 mb-8">
      <div className="h-[calc(100vh-130px)] flex overflow-hidden bg-card border border-border rounded-2xl shadow-sm animate-fade-in">

        {/* Sidebar */}
        <aside
          className={`w-full md:w-72 lg:w-80 border-r border-border shrink-0 flex flex-col bg-gray-50/40 dark:bg-gray-900/10 ${
            selectedChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          <ChatList
            onSelectChat={setSelectedChat}
            activeChatId={selectedChat?.partnerId}
            initialPartnerId={initialPartnerId}
          />
        </aside>

        {/* Main Chat Area */}
        <main
          className={`flex-1 flex flex-col relative min-w-0 ${
            !selectedChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {selectedChat ? (
            <div className="flex flex-col w-full h-full">
              {/* Mobile back button */}
              <button
                onClick={() => setSelectedChat(null)}
                className="absolute z-20 top-3.5 left-4 p-1.5 rounded-lg md:hidden text-text-secondary hover:text-primary hover:bg-primary-soft transition-colors"
                title="Back"
              >
                <ArrowLeft size={18} />
              </button>
              <ChatRoom 
                partnerId={selectedChat.partnerId} 
                partnerName={selectedChat.name} 
                initialMessage={selectedChat.initialMessage}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10 animate-slide-up">
              <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center border border-primary/10 mb-4">
                <MessageSquare size={26} />
              </div>
              <h2 className="text-base font-bold mb-1.5">Your Messages</h2>
              <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
                Select a conversation or start a new one from the Alumni Directory.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;