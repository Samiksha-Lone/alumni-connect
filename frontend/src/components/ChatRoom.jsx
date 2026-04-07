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

const ChatRoom = ({ partnerId }) => {
  const socket = useSocket();
  const { success, error: showError } = useToast();
  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
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
      // Ensure we are comparing string IDs
      const sId = msg.senderId?._id || msg.senderId;
      const rId = msg.receiverId?._id || msg.receiverId;
      const pId = partnerId.toString();

      if (sId.toString() === pId || rId.toString() === pId) {
        setMessages((prev) => {
          // Prevent duplicates
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
        
        await api.post('/chat/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setFile(null);
        setUploading(false);
      } else {
        await api.post('/chat/message', {
          receiverId: partnerId,
          content: text.trim(),
        });
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
      if (selectedFile.size > 10 * 1024 * 1024) {
        showError('File is too large (max 10MB)');
        return;
      }
      setFile(selectedFile);
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
            const senderId = m.senderId?._id || m.senderId;
            const isMe = senderId.toString() !== partnerId.toString();
            return (
              <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[75%] space-y-1.5`}>
                  <div className={`px-5 py-3.5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-primary text-white rounded-tr-sm' 
                      : 'bg-gray-100 dark:bg-gray-800 text-text-primary border border-border/50 rounded-tl-sm'
                  }`}>
                    {m.fileUrl ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isMe ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                            <FileText size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate text-[13px]">{m.fileName}</p>
                            <p className={`text-[10px] opacity-70`}>{(m.fileType || 'Document').split('/')[1]?.toUpperCase()}</p>
                          </div>
                          <a 
                            href={`${FILE_BASE}${m.fileUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-2 rounded-lg transition-colors ${isMe ? 'hover:bg-white/10' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            title="Download"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                        {m.content && m.content !== `Sent a file: ${m.fileName}` && (
                          <p className="mt-1 opacity-90 border-t border-white/10 pt-2">{m.content}</p>
                        )}
                      </div>
                    ) : (
                      m.content
                    )}
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
        {file && (
          <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-primary-soft/30 border border-primary/20 max-w-4xl mx-auto animate-slide-up">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs truncate text-text-primary">{file.name}</p>
              <p className="text-[10px] text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="p-2 text-text-secondary hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="flex gap-3 items-center max-w-4xl mx-auto">
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            className="w-12 h-12 flex items-center justify-center rounded-2xl border border-border bg-gray-50/50 dark:bg-gray-900/50 text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            title="Attach a file"
          >
            <Paperclip size={20} />
          </button>
          <div className="flex-1 relative">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Write a message..."
              className="form-input h-12 pl-6 pr-12 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border-border"
              disabled={uploading}
            />
          </div>
          <Button 
            onClick={sendMessage} 
            disabled={(!text.trim() && !file) || uploading}
            className="w-12 h-12 p-0 flex items-center justify-center rounded-2xl shadow-xl shadow-primary/20"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <SendHorizontal size={20} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
