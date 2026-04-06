import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { SendHorizontal, User, ShieldCheck, Clock } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import Button from './ui/Button';

const api = axios.create({
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com',
  withCredentials: true,
});

const ChatRoom = ({ partnerId }) => {
  const socket = useSocket();
  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    const loadPartner = async () => {
      try {
        const res = await api.get(`/users/${partnerId}`);
        if (res.data && typeof res.data === 'object') {
          setPartner(res.data);
        }
      } catch (e) {
        console.error('loadPartner error', e);
      }
    };
    if (partnerId) loadPartner();
  }, [partnerId]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await api.get(`/chat/messages/${partnerId}`);
        let data = res.data;
        if (!Array.isArray(data)) {
          data = data.messages || [];
        }
        setMessages(data);
      } catch (e) {
        console.error('loadMessages error', e);
      }
    };
    if (partnerId) loadMessages();
  }, [partnerId]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg) => {
      if (msg.senderId === partnerId || msg.receiverId === partnerId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket, partnerId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await api.post('/chat/message', {
        receiverId: partnerId,
        content: text.trim(),
      });
      setText('');
    } catch (e) {
      console.error('sendMessage error', e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900/40">
      {/* Header */}
      <div className="px-8 py-5 border-b border-border bg-white/50 dark:bg-gray-800/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20">
            {(partner?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary leading-tight">
              {partner?.name || 'User'}
            </h3>
            <p className="text-[10px] text-text-secondary flex items-center gap-1 mt-0.5">
               {partner?.role === 'admin' ? <ShieldCheck size={10} className="text-primary" /> : <User size={10} />}
               {partner?.role ? partner.role.charAt(0).toUpperCase() + partner.role.slice(1) : 'Member'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
        {messages.length > 0 ? (
          messages.map((m) => {
            const isMe = m.senderId !== partnerId;
            return (
              <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[75%] space-y-1.5`}>
                  <div className={`px-5 py-3.5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-primary text-white rounded-tr-sm' 
                      : 'bg-gray-100 dark:bg-gray-800 text-text-primary border border-border/50 rounded-tl-sm'
                  }`}>
                    {m.content}
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] text-text-secondary opacity-60 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <Clock size={10} />
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
             <div className="w-12 h-12 rounded-full border-2 border-dashed border-text-secondary mb-4" />
             <p className="text-xs font-medium">No messages yet. Send a greeting!</p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white dark:bg-gray-800/50 border-t border-border">
        <div className="flex gap-3 items-center max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Write a message..."
              className="form-input h-12 pl-6 pr-12 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border-border"
            />
          </div>
          <Button 
            onClick={sendMessage} 
            disabled={!text.trim()}
            className="w-12 h-12 p-0 flex items-center justify-center rounded-2xl shadow-xl shadow-primary/20"
          >
            <SendHorizontal size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
