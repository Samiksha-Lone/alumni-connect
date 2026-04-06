import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, User } from 'lucide-react';

const api = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com',
  withCredentials: true,
});

const ChatList = ({ onSelectChat, activeChatId, initialPartnerId }) => {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations');
        let data = res.data;
        if (!Array.isArray(data)) {
          data = data.conversations || [];
        }
        setConversations(data);

        if (initialPartnerId && data.length) {
          const existing = data.find(c => String(c.partnerId) === String(initialPartnerId));
          if (existing) onSelectChat(existing);
          else onSelectChat({ partnerId: initialPartnerId });
        }
      } catch (err) {
        console.error('fetchConversations error', err);
      }
    };
    fetchConversations();
  }, [initialPartnerId, onSelectChat]);

  const filtered = conversations.filter(c => 
    (c.partnerName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/10">
      <div className="p-6 border-b border-border">
        <h2 className="heading-sm mb-4">Messages</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9 h-9 text-xs"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length > 0 ? (
          filtered.map((conv) => (
            <button
              key={conv.partnerId}
              onClick={() => onSelectChat(conv)}
              className={`w-full flex items-center gap-4 px-6 py-4 text-left border-b border-border/50 transition-all ${
                activeChatId === conv.partnerId
                  ? 'bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-primary'
                  : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-2xl bg-primary-soft text-primary flex items-center justify-center font-bold text-sm border border-primary/10">
                  {(conv.partnerName || 'U').charAt(0).toUpperCase()}
                </div>
                {/* Status indicator could go here */}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <p className={`text-sm tracking-tight truncate ${activeChatId === conv.partnerId ? 'font-bold text-primary' : 'font-semibold text-text-primary'}`}>
                    {conv.partnerName || 'User'}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs truncate text-text-secondary">
                  {conv.lastMessage || 'No messages yet'}
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="p-8 text-center">
             <User size={32} className="mx-auto text-text-secondary mb-3 opacity-20" />
             <p className="text-xs text-text-secondary">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
