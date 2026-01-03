import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



// frontend/src/main.jsx
// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App.jsx';
// import { SocketProvider } from './context/SocketContext.jsx'; // create this file

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <SocketProvider>
//         <App />
//       </SocketProvider>
//     </BrowserRouter>
//   </StrictMode>
// );
