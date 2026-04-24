import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, MessageSquare } from 'lucide-react';

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com') + '/api',
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
        if (!Array.isArray(data)) data = data.conversations || [];
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
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="px-4 py-4 border-b border-border">
        <h2 className="text-base font-bold mb-3">Messages</h2>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length > 0 ? (
          filtered.map((conv) => {
            const isActive = activeChatId === conv.partnerId;
            return (
              <button
                key={conv.partnerId}
                onClick={() => onSelectChat(conv)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-border/40 transition-all ${
                  isActive
                    ? 'bg-primary-soft border-l-2 border-l-primary'
                    : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/30'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center font-bold text-sm border border-primary/10 shrink-0">
                  {(conv.partnerName || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className={`text-sm truncate ${isActive ? 'font-bold text-primary' : 'font-semibold text-text-primary'}`}>
                      {conv.partnerName || 'User'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate text-text-secondary">
                    {conv.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="py-12 text-center px-4">
            <MessageSquare size={28} className="mx-auto text-text-secondary mb-2 opacity-20" />
            <p className="text-xs text-text-secondary">No conversations yet</p>
            <p className="text-[11px] text-text-secondary/60 mt-1">Start a chat from the Alumni Directory</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
