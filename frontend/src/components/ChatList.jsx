// src/components/ChatList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com',
  withCredentials: true,
});

const ChatList = ({ onSelectChat, initialPartnerId }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(initialPartnerId || null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations');
        const data = res.data || [];
        setConversations(data);

        // If we came from Alumni → Message and this partner exists, preselect it
        if (initialPartnerId && data.length) {
          const existing = data.find(c => c.partnerId === initialPartnerId);
          if (existing) {
            setSelectedId(existing.partnerId);
            onSelectChat(existing);
          } else {
            // No previous conversation, still allow ChatPage to open ChatRoom via partnerId
            onSelectChat({ partnerId: initialPartnerId });
          }
        }
      } catch (err) {
        console.error('fetchConversations error', err);
      }
    };
    fetchConversations();
  }, [initialPartnerId, onSelectChat]);

  const handleClick = (conv) => {
    setSelectedId(conv.partnerId);
    onSelectChat(conv);
  };

  return (
    <aside className="flex flex-col bg-white border-r w-80 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Conversations
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {conversations.length} active chat{conversations.length !== 1 && 's'}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <button
            key={conv.partnerId}
            onClick={() => handleClick(conv)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-100 dark:border-slate-800 transition-colors ${
              selectedId === conv.partnerId
                ? 'bg-slate-100 dark:bg-slate-800'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/70'
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-sky-500">
              {(conv.partnerName || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">
                {conv.partnerName || 'User'}
              </p>
              <p className="text-xs truncate text-slate-500 dark:text-slate-400">
                {conv.lastMessage}
              </p>
            </div>
            {conv.unreadCount > 0 && (
              <div className="ml-2 px-2 py-1 rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                {conv.unreadCount}
              </div>
            )}
          </button>
        ))}
        {conversations.length === 0 && (
          <p className="p-4 text-xs text-slate-500 dark:text-slate-400">
            No conversations yet. Start by messaging someone from the Alumni Directory.
          </p>
        )}
      </div>
    </aside>
  );
};

export default ChatList;
