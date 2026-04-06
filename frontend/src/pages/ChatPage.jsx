// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import ChatList from '../components/ChatList';
// import ChatRoom from '../components/ChatRoom';

// const ChatPage = () => {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const location = useLocation();
//   const initialPartnerId = location.state?.partnerId || null;

//   useEffect(() => {
//     if (initialPartnerId) {
//       setSelectedChat({ partnerId: initialPartnerId });
//     }
//   }, [initialPartnerId]);

//   return (
//     <div className="min-h-[calc(100vh-64px)] flex" style={{background:'var(--bg)', color:'var(--text)'}}>
//       <ChatList onSelectChat={setSelectedChat} initialPartnerId={initialPartnerId} />
//       <main className="flex items-center justify-center flex-1 p-6">
//         {selectedChat ? (
//           <div className="w-full max-w-5xl">
//             <ChatRoom partnerId={selectedChat.partnerId} />
//           </div>
//         ) : (
//           <div className="text-center">
//             <h1 className="mb-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Messages</h1>
//             <p className="text-lg text-slate-500 dark:text-slate-400">
//               Select a conversation from the left or start one from the Alumni Directory.
//             </p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ChatPage;





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

  useEffect(() => {
    if (initialPartnerId) {
      setSelectedChat({ 
        partnerId: initialPartnerId, 
        name: initialPartnerName 
      });
    }
  }, [initialPartnerId, initialPartnerName]);

  return (
    <div className="section-container !p-0 h-[calc(100vh-120px)] flex overflow-hidden bg-card border border-border rounded-3xl shadow-sm animate-fade-in mb-8">
      
      {/* Sidebar */}
      <aside className={`w-full md:w-80 lg:w-96 border-r border-border bg-gray-50/50 dark:bg-gray-900/10 ${selectedChat ? 'hidden md:block' : 'block'}`}>
        <ChatList 
          onSelectChat={setSelectedChat} 
          activeChatId={selectedChat?.partnerId} 
          initialPartnerId={initialPartnerId} 
        />
      </aside>

      {/* Main Chat Area */}
      <main className={`flex-1 flex flex-col relative bg-white dark:bg-slate-900/20 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <div className="flex flex-col w-full h-full relative">
            {/* Mobile Back Button */}
            <button 
              onClick={() => setSelectedChat(null)}
              className="absolute z-50 p-2 text-text-secondary hover:text-primary md:hidden top-4 left-4"
              title="Back to conversations"
            >
              <ArrowLeft size={24} />
            </button>
            
            <ChatRoom 
              partnerId={selectedChat.partnerId} 
              partnerName={selectedChat.name}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 m-auto text-center animate-slide-up">
            <div className="w-20 h-20 bg-primary-soft rounded-3xl flex items-center justify-center mb-6 text-primary border border-primary/10">
              <MessageSquare size={40} />
            </div>
            <h1 className="heading-md mb-2">Direct Messages</h1>
            <p className="max-w-xs text-text-secondary text-sm">
              Select a conversation from the sidebar or start a new one from the Alumni Directory.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;