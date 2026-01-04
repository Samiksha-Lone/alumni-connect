import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ChatList from '../components/ChatList';
import ChatRoom from '../components/ChatRoom';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const location = useLocation();
  const initialPartnerId = location.state?.partnerId || null;

  useEffect(() => {
    if (initialPartnerId) {
      setSelectedChat({ partnerId: initialPartnerId });
    }
  }, [initialPartnerId]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex" style={{background:'var(--bg)', color:'var(--text)'}}>
      <ChatList onSelectChat={setSelectedChat} initialPartnerId={initialPartnerId} />
      <main className="flex-1 flex items-center justify-center p-6">
        {selectedChat ? (
          <div className="w-full max-w-5xl">
            <ChatRoom partnerId={selectedChat.partnerId} />
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Messages</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Select a conversation from the left or start one from the Alumni Directory.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
