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
import ChatList from '../components/ChatList';
import ChatRoom from '../components/ChatRoom';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const location = useLocation();
  
  // Extract partner data passed from AlumniPage
  const initialPartnerId = location.state?.partnerId || null;
  const initialPartnerName = location.state?.partnerName || 'Alumni';

  useEffect(() => {
    if (initialPartnerId) {
      // Set the active chat window immediately
      setSelectedChat({ 
        partnerId: initialPartnerId, 
        name: initialPartnerName 
      });
    }
  }, [initialPartnerId, initialPartnerName]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] bg-white dark:bg-slate-950 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
      
      {/* Sidebar: List of conversations */}
      <aside className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 ${selectedChat ? 'hidden md:block' : 'block'}`}>
        <ChatList 
          onSelectChat={setSelectedChat} 
          activeChatId={selectedChat?.partnerId} 
          initialPartnerId={initialPartnerId} 
        />
      </aside>

      {/* Main: Message Window */}
      <main className={`flex-1 flex flex-col relative bg-slate-50 dark:bg-slate-900/30 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <div className="flex flex-col w-full h-full">
            {/* Mobile Back Button */}
            <button 
              onClick={() => setSelectedChat(null)}
              className="absolute z-10 p-2 bg-white rounded-full shadow-sm md:hidden top-4 left-4 dark:bg-slate-800"
            >
              ⬅️
            </button>
            
            <ChatRoom 
              partnerId={selectedChat.partnerId} 
              partnerName={selectedChat.name}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 m-auto text-center">
            <div className="flex items-center justify-center w-20 h-20 mb-6 text-4xl bg-blue-100 rounded-full dark:bg-blue-900/30">
              💬
            </div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Your Messages</h1>
            <p className="max-w-sm text-slate-500 dark:text-slate-400">
              Select an alumni from the directory to start a conversation or pick a recent chat from the list.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;