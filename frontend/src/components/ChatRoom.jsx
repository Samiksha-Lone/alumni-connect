// src/components/ChatRoom.jsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000',
  withCredentials: true,
});

const ChatRoom = ({ partnerId }) => {
  const socket = useSocket();
  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const endRef = useRef(null);

  // load partner
  useEffect(() => {
    const loadPartner = async () => {
      try {
        const res = await api.get(`/users/${partnerId}`);
        setPartner(res.data);
      } catch (e) {
        console.error('loadPartner error', e);
      }
    };
    if (partnerId) loadPartner();
  }, [partnerId]);

  // load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await api.get(`/api/chat/messages/${partnerId}`);
        setMessages(res.data || []);
      } catch (e) {
        console.error('loadMessages error', e);
      }
    };
    if (partnerId) loadMessages();
  }, [partnerId]);

  // realtime listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (
        msg.senderId === partnerId ||
        msg.receiverId === partnerId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, partnerId]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await api.post('/api/chat/message', {
        receiverId: partnerId,
        content: text.trim(),
      });
      setText('');
    } catch (e) {
      console.error('sendMessage error', e);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-sky-500 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
            {(partner?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {partner?.name || 'User'}
            </p>
            <p className="text-xs text-blue-100">Alumni Connect chat</p>
          </div>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        {messages.map((m) => {
          const isMe = m.senderId !== partnerId;
          return (
            <div
              key={m._id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100 rounded-bl-sm'
                }`}
              >
                <p>{m.content}</p>
                <p className="mt-1 text-[10px] opacity-70 text-right">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* input */}
      <div className="px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm font-medium text-white shadow-lg shadow-blue-500/30"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
