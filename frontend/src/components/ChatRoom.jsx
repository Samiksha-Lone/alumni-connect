import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { SendHorizontal, User, ShieldCheck, Clock, Paperclip, FileText, Download, X } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/useToast';
import Button from './ui/Button';

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com') + '/api',
  withCredentials: true,
});

const FILE_BASE = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE || 'https://alumni-connect-backend-hrsc.onrender.com');

const ChatRoom = ({ partnerId, initialMessage }) => {
  const socket = useSocket();
  const { error: showError } = useToast();
  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const endRef = useRef(null);
  
  useEffect(() => {
    if (initialMessage) {
      setText(initialMessage);
    }
  }, [partnerId, initialMessage]);

  useEffect(() => {
    const loadPartner = async () => {
      try {
        const res = await api.get(`/users/${partnerId}`);
        if (res.data && typeof res.data === 'object') setPartner(res.data);
      } catch (e) { console.error('loadPartner error', e); }
    };
    if (partnerId) loadPartner();
  }, [partnerId]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await api.get(`/chat/messages/${partnerId}`);
        let data = res.data;
        if (!Array.isArray(data)) data = data.messages || [];
        setMessages(data);
      } catch (e) { console.error('loadMessages error', e); }
    };
    if (partnerId) loadMessages();
  }, [partnerId]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg) => {
      const sId = msg.senderId?._id || msg.senderId;
      const rId = msg.receiverId?._id || msg.receiverId;
      const pId = partnerId.toString();
      if (sId.toString() === pId || rId.toString() === pId) {
        setMessages((prev) => {
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };
    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket, partnerId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() && !file) return;
    try {
      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append('receiverId', partnerId);
        formData.append('file', file);
        await api.post('/chat/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setFile(null);
        setUploading(false);
      } else {
        await api.post('/chat/message', { receiverId: partnerId, content: text.trim() });
      }
      setText('');
    } catch (e) {
      console.error('sendMessage error', e);
      showError('Failed to send message');
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { showError('File too large (max 10MB)'); return; }
      setFile(selectedFile);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900/20">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-border bg-card flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
          {(partner?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary leading-tight">
            {partner?.name || 'User'}
          </h3>
          <p className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
            {partner?.role === 'admin' ? <ShieldCheck size={10} className="text-primary" /> : <User size={10} />}
            {partner?.role ? partner.role.charAt(0).toUpperCase() + partner.role.slice(1) : 'Member'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.length > 0 ? (
          messages.map((m) => {
            const senderId = m.senderId?._id || m.senderId;
            const isMe = senderId.toString() !== partnerId.toString();
            return (
              <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[78%] space-y-1">
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-primary text-white rounded-tr-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-text-primary border border-border/50 rounded-tl-sm'
                  }`}>
                    {m.fileUrl ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isMe ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                            <FileText size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate text-xs">{m.fileName}</p>
                            <p className="text-[10px] opacity-70">{(m.fileType || 'Document').split('/')[1]?.toUpperCase()}</p>
                          </div>
                          <a
                            href={`${FILE_BASE}${m.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1.5 rounded-lg transition-colors ${isMe ? 'hover:bg-white/10' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                          >
                            <Download size={15} />
                          </a>
                        </div>
                        {m.content && m.content !== `Sent a file: ${m.fileName}` && (
                          <p className="text-xs opacity-90 border-t border-white/10 pt-1.5">{m.content}</p>
                        )}
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] text-text-secondary/60 ${isMe ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
                    <Clock size={9} />
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-border mb-3" />
            <p className="text-sm text-text-secondary">No messages yet</p>
            <p className="text-xs text-text-secondary/60 mt-1">Send a message to start the conversation</p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 bg-card border-t border-border">
        {file && (
          <div className="flex items-center gap-2 mb-2 p-2.5 rounded-xl bg-primary-soft/30 border border-primary/20 animate-slide-up">
            <FileText size={16} className="text-primary shrink-0" />
            <p className="text-xs font-semibold text-text-primary flex-1 truncate">{file.name}</p>
            <button onClick={() => setFile(null)} className="p-1 text-text-secondary hover:text-red-500 transition-colors">
              <X size={14} />
            </button>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-gray-50 dark:bg-gray-800 text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
          >
            <Paperclip size={16} />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Write a message..."
            className="form-input flex-1 h-10 text-sm rounded-xl"
            disabled={uploading}
          />
          <Button
            onClick={sendMessage}
            disabled={(!text.trim() && !file) || uploading}
            className="w-10 h-10 p-0 flex items-center justify-center rounded-xl shrink-0"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <SendHorizontal size={17} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
