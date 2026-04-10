// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { io, Socket } from 'socket.io-client';

// interface ChatMessage {
//   sender: string;
//   text: string;
//   timestamp: string;
// }

// interface Participant {
//   socketId: string;
//   name: string;
// }

// // 🔥 NEW: Interface for our tasks
// interface Todo {
//   id: string;
//   text: string;
//   completed: boolean;
// }

// export default function StudyRoomPage() {
//   const params = useParams();
//   const router = useRouter();
//   const roomId = params.id as string;

//   const [isLoading, setIsLoading] = useState(true);
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [userName, setUserName] = useState<string>('');
  
//   const [participants, setParticipants] = useState<Participant[]>([]);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [newMessage, setNewMessage] = useState('');
  
//   const [timerEndTime, setTimerEndTime] = useState<number | null>(null);
//   const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  
//   // 🔥 NEW: To-Do States
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [newTodo, setNewTodo] = useState('');

//   const chatEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const storedName = localStorage.getItem('userName') || 'Guest';
//     setUserName(storedName);

//     if (!token) {
//       router.push('/login');
//       return;
//     }

//     let activeSocket: Socket | null = null;

//     const verifyRoomAndConnect = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
        
//         if (res.ok) {
//           setIsLoading(false);
//           activeSocket = io('http://localhost:5000');
//           setSocket(activeSocket);

//           activeSocket.emit('join-room', { roomId, userName: storedName });

//           activeSocket.on('update-participants', (users: Participant[]) => {
//             setParticipants(users);
//           });

//           activeSocket.on('receive-message', (data: ChatMessage) => {
//             setMessages((prev) => [...prev, data]);
//           });

//           activeSocket.on('timer-sync', (endTime: number | null) => {
//             setTimerEndTime(endTime);
//             if (!endTime) setTimeLeft(25 * 60);
//           });

//           // 🔥 NEW: Listen for the synchronized task list
//           activeSocket.on('todo-sync', (updatedTodos: Todo[]) => {
//             setTodos(updatedTodos);
//           });

//         } else {
//           router.push('/dashboard');
//         }
//       } catch (error) {
//         router.push('/dashboard');
//       }
//     };

//     verifyRoomAndConnect();

//     return () => {
//       if (activeSocket) {
//         activeSocket.off('receive-message');
//         activeSocket.off('update-participants');
//         activeSocket.off('timer-sync');
//         activeSocket.off('todo-sync'); // Cleanup listener
//         activeSocket.disconnect();
//       }
//     };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [roomId, router]);

//   useEffect(() => {
//     if (!timerEndTime) return;
//     const interval = setInterval(() => {
//       const now = Date.now();
//       const difference = Math.floor((timerEndTime - now) / 1000);
//       if (difference <= 0) {
//         setTimeLeft(0);
//         clearInterval(interval);
//       } else {
//         setTimeLeft(difference);
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [timerEndTime]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !socket) return;
//     const messageData: ChatMessage = {
//       sender: userName, 
//       text: newMessage,
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };
//     setMessages((prev) => [...prev, messageData]);
//     socket.emit('send-message', { roomId, ...messageData });
//     setNewMessage('');
//   };

//   const handleTimerAction = (action: 'start' | 'stop') => {
//     if (!socket) return;
//     socket.emit('timer-action', { roomId, action, durationMinutes: 25 });
//   };

//   // 🔥 NEW: Handlers to emit To-Do actions to the server
//   const handleAddTodo = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newTodo.trim() || !socket) return;
//     socket.emit('todo-action', { roomId, action: 'add', payload: newTodo });
//     setNewTodo('');
//   };

//   const handleToggleTodo = (id: string) => {
//     if (!socket) return;
//     socket.emit('todo-action', { roomId, action: 'toggle', payload: id });
//   };

//   const handleDeleteTodo = (id: string) => {
//     if (!socket) return;
//     socket.emit('todo-action', { roomId, action: 'delete', payload: id });
//   };

//   const formatTime = (seconds: number) => {
//     const m = Math.floor(seconds / 60).toString().padStart(2, '0');
//     const s = (seconds % 60).toString().padStart(2, '0');
//     return `${m}:${s}`;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-black">
//         <div className="w-8 h-8 border-4 border-zinc-800 border-t-white rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   const isTimeRunningOut = timerEndTime !== null && timeLeft > 0 && timeLeft <= 300;

//   return (
//     <main className="flex flex-col min-h-screen lg:h-screen bg-black text-white p-4 md:p-6 lg:overflow-hidden">
      
//       <nav className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-zinc-800 mb-6 gap-4 shrink-0">
//         <div className="text-center sm:text-left">
//           <h1 className="text-2xl font-bold">Study Session</h1>
//           <p className="text-zinc-400 text-sm mt-1">
//             Room Code: <span className="text-white font-mono bg-zinc-900 px-2 py-1 rounded border border-zinc-800">{roomId}</span>
//           </p>
//         </div>

//         <div className="flex items-center gap-4 sm:gap-6">
//           <div className="flex items-center gap-2 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800 shadow-lg">
//             {!timerEndTime ? (
//               <button 
//                 onClick={() => handleTimerAction('start')}
//                 className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
//                 title="Start Pomodoro"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
//               </button>
//             ) : (
//               <button 
//                 onClick={() => handleTimerAction('stop')}
//                 className="p-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
//                 title="Stop Timer"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></svg>
//               </button>
//             )}
//             <div className={`px-4 py-1.5 rounded-lg font-mono text-xl font-bold min-w-[85px] text-center transition-all duration-500 ${isTimeRunningOut ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-black text-white'}`}>
//               {formatTime(timeLeft)}
//             </div>
//           </div>
//           <div className="w-px h-8 bg-zinc-800 hidden sm:block"></div>
//           <button 
//             onClick={() => router.push('/dashboard')}
//             className="px-4 py-2.5 text-sm font-medium text-white transition-all border rounded-lg border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
//           >
//             Leave Room
//           </button>
//         </div>
//       </nav>

//       <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
//         <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
          
//           {/* Participants Area */}
//           <div className="flex-1 border border-zinc-800 bg-zinc-950/50 rounded-2xl p-4 flex flex-col min-h-0">
//             <div className="flex justify-between items-center mb-4 shrink-0">
//               <h2 className="font-semibold">Participants</h2>
//               <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs font-medium">{participants.length}</span>
//             </div>
//             <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[140px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
//               {participants.map((p) => (
//                 <div key={p.socketId} className="relative bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden group">
//                   <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-2xl font-bold text-zinc-400 group-hover:scale-110 transition-transform">
//                     {p.name.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium border border-zinc-800/50">
//                     {p.name} {p.name === userName && '(You)'}
//                   </div>
//                   <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full">
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-red-400"><path d="M14.228 15.289a6.012 6.012 0 01-1.478.471v2.49h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.49a6.002 6.002 0 01-1.478-.471.75.75 0 01.39-1.448 4.5 4.5 0 005.176 0 .75.75 0 01.39 1.448z" /><path d="M12.75 6.75a.75.75 0 00-1.5 0v3.315a2.25 2.25 0 001.5 0V6.75z" /><path fillRule="evenodd" d="M1.371 2.812a.75.75 0 011.06 0l18.75 18.75a.75.75 0 01-1.06 1.06l-2.006-2.006a8.251 8.251 0 01-4.865 1.545.75.75 0 01-.197-1.488 6.756 6.756 0 003.353-1.042l-4.656-4.656V12.75a3 3 0 01-2.92-3l-2.836-2.836a4.5 4.5 0 00-2.394 6.766.75.75 0 01-1.096 1.02A6.002 6.002 0 014.5 6.471L2.431 4.402a.75.75 0 010-1.06V2.812z" clipRule="evenodd" /></svg>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* 🔥 NEW: Functional Shared To-Do List (Expanded slightly to h-56 so it feels balanced) */}
//           <div className="h-56 shrink-0 border border-zinc-800 bg-zinc-950/50 rounded-2xl flex flex-col overflow-hidden">
            
//             {/* Header */}
//             <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center shrink-0">
//               <h2 className="font-semibold text-sm">Shared Tasks</h2>
//               <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs font-medium text-zinc-300">
//                 {todos.filter(t => !t.completed).length} pending
//               </span>
//             </div>

//             {/* List */}
//             <div className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
//               {todos.length === 0 ? (
//                 <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
//                   No tasks yet. Add a study goal below!
//                 </div>
//               ) : (
//                 <ul className="flex flex-col gap-1">
//                   {todos.map(todo => (
//                     <li key={todo.id} className="flex items-center gap-3 p-2 hover:bg-zinc-800/40 rounded-lg group transition-colors">
//                       {/* Custom Checkbox */}
//                       <input 
//                         type="checkbox" 
//                         checked={todo.completed}
//                         onChange={() => handleToggleTodo(todo.id)}
//                         className="w-4 h-4 rounded border-zinc-600 bg-zinc-900 checked:bg-white checked:border-white focus:ring-0 cursor-pointer accent-white transition-colors"
//                       />
//                       <span className={`flex-1 text-sm truncate transition-all ${todo.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
//                         {todo.text}
//                       </span>
//                       {/* Delete Button (Appears on hover) */}
//                       <button 
//                         onClick={() => handleDeleteTodo(todo.id)}
//                         className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
//                         title="Delete task"
//                       >
//                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {/* Input Form */}
//             <form onSubmit={handleAddTodo} className="p-2 border-t border-zinc-800 bg-zinc-900/30 shrink-0 flex gap-2">
//               <input 
//                 type="text"
//                 value={newTodo}
//                 onChange={(e) => setNewTodo(e.target.value)}
//                 placeholder="Add a new task..."
//                 className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-500 transition-colors"
//               />
//               <button 
//                 type="submit"
//                 disabled={!newTodo.trim()}
//                 className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors"
//               >
//                 Add
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Right Column (Live Chat) */}
//         <div className="flex flex-col h-[500px] lg:h-full border border-zinc-800 bg-zinc-950/50 rounded-2xl overflow-hidden min-h-0">
//           <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
//             <h2 className="font-semibold">Live Chat</h2>
//           </div>
//           <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
//             {messages.length === 0 ? (
//               <p className="text-zinc-500 text-sm text-center mt-4">No messages yet. Say hi!</p>
//             ) : (
//               messages.map((msg, index) => {
//                 const isMe = msg.sender === userName;
//                 return (
//                   <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
//                     <span className="text-xs text-zinc-500 mb-1">{isMe ? 'Me' : msg.sender} • {msg.timestamp}</span>
//                     <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${isMe ? 'bg-white text-black rounded-tr-sm' : 'bg-zinc-800 text-white rounded-tl-sm'}`}>
//                       {msg.text}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//             <div ref={chatEndRef} />
//           </div>
//           <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800 bg-zinc-900/30 flex gap-2 shrink-0">
//             <input 
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type a message..."
//               className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-zinc-500 transition-colors"
//             />
//             <button 
//               type="submit"
//               disabled={!newMessage.trim()}
//               className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors"
//             >
//               Send
//             </button>
//           </form>
//         </div>
//       </div>
//     </main>
//   );
// }

'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

interface ChatMessage { sender: string; text: string; timestamp: string; }
interface Participant { socketId: string; name: string; }
interface Todo { id: string; text: string; completed: boolean; }

export default function StudyRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  // --- Auth & Room States ---
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  
  // 🔥 NEW: Lobby States
  const [hasJoined, setHasJoined] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [roomLink, setRoomLink] = useState('');

  // --- Socket States ---
  const [socket, setSocket] = useState<Socket | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Initial Verify (Does NOT connect socket yet!)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName') || 'Guest';
    setUserName(storedName);
    
    // Generate the shareable link based on current browser URL
    if (typeof window !== 'undefined') {
      setRoomLink(`${window.location.origin}/room/${roomId}`);
    }

    if (!token) {
      router.push('/login');
      return;
    }

    const verifyRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setIsLoading(false);
        else router.push('/dashboard');
      } catch (error) {
        router.push('/dashboard');
      }
    };
    verifyRoom();
  }, [roomId, router]);

  // 2. Connect Socket ONLY after clicking "Join"
  useEffect(() => {
    if (!hasJoined) return;

    let activeSocket: Socket | null = null;
    activeSocket = io('http://localhost:5000');
    setSocket(activeSocket);

    activeSocket.emit('join-room', { roomId, userName });

    activeSocket.on('update-participants', (users: Participant[]) => setParticipants(users));
    activeSocket.on('receive-message', (data: ChatMessage) => setMessages((prev) => [...prev, data]));
    activeSocket.on('timer-sync', (endTime: number | null) => {
      setTimerEndTime(endTime);
      if (!endTime) setTimeLeft(25 * 60);
    });
    activeSocket.on('todo-sync', (updatedTodos: Todo[]) => setTodos(updatedTodos));

    return () => {
      if (activeSocket) {
        activeSocket.off('receive-message');
        activeSocket.off('update-participants');
        activeSocket.off('timer-sync');
        activeSocket.off('todo-sync');
        activeSocket.disconnect();
      }
    };
  }, [hasJoined, roomId, userName]);

  // ... (Keep existing Timer, Auto-scroll, and Todo useEffects/handlers here)
  useEffect(() => {
    if (!timerEndTime) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const difference = Math.floor((timerEndTime - now) / 1000);
      if (difference <= 0) { setTimeLeft(0); clearInterval(interval); } 
      else setTimeLeft(difference);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerEndTime]);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
    const msg: ChatMessage = { sender: userName, text: newMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, msg]);
    socket.emit('send-message', { roomId, ...msg });
    setNewMessage('');
  };

  const handleTimerAction = (action: 'start' | 'stop') => socket?.emit('timer-action', { roomId, action, durationMinutes: 25 });
  const handleAddTodo = (e: React.FormEvent) => { e.preventDefault(); if (!newTodo.trim() || !socket) return; socket.emit('todo-action', { roomId, action: 'add', payload: newTodo }); setNewTodo(''); };
  const handleToggleTodo = (id: string) => socket?.emit('todo-action', { roomId, action: 'toggle', payload: id });
  const handleDeleteTodo = (id: string) => socket?.emit('todo-action', { roomId, action: 'delete', payload: id });
  const formatTime = (seconds: number) => { const m = Math.floor(seconds / 60).toString().padStart(2, '0'); const s = (seconds % 60).toString().padStart(2, '0'); return `${m}:${s}`; };
  const isTimeRunningOut = timerEndTime !== null && timeLeft > 0 && timeLeft <= 300;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-black"><div className="w-8 h-8 border-4 border-zinc-800 border-t-white rounded-full animate-spin"></div></div>;
  }

  // ==========================================
  // 🔥 PRE-JOIN LOBBY UI
  // ==========================================
  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Video Preview */}
          <div className="relative aspect-video bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-2xl">
            {isVideoOn ? (
               <p className="text-zinc-500">[Camera Feed Active]</p>
            ) : (
               <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-4xl text-zinc-500 font-bold">
                  {userName.charAt(0).toUpperCase()}
               </div>
            )}
            
            {/* Camera & Mic Controls */}
            <div className="absolute bottom-6 flex items-center gap-4">
              <button onClick={() => setIsMicOn(!isMicOn)} className={`p-4 rounded-full transition-colors ${isMicOn ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                {isMicOn ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 14a3 3 0 003-3V6a3 3 0 00-6 0v5a3 3 0 003 3z" /><path d="M19 11v1a7 7 0 01-14 0v-1H3v1a9 9 0 008 8.94V24h2v-3.06A9 9 0 0021 12v-1h-2z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M19 11v1a7 7 0 01-14 0v-1H3v1a9 9 0 008 8.94V24h2v-3.06A9 9 0 0021 12v-1h-2z" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                )}
              </button>
              <button onClick={() => setIsVideoOn(!isVideoOn)} className={`p-4 rounded-full transition-colors ${isVideoOn ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                {isVideoOn ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Join Info & Room Links */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to join?</h1>
            
            <p className="text-zinc-400">
              <span className="text-white font-medium">Unknown</span> and <span className="text-white font-medium">0+ others</span> are already in the room.
            </p>

            <button 
              onClick={() => setHasJoined(true)}
              className="px-10 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] text-lg"
            >
              Join Room
            </button>

            <div className="w-full max-w-md mt-6 space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-500 uppercase">Room Link</label>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                  <input type="text" readOnly value={roomLink} className="flex-1 bg-transparent px-3 text-sm text-zinc-300 outline-none" />
                  <button onClick={() => copyToClipboard(roomLink)} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-500 uppercase">Room Code</label>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                  <input type="text" readOnly value={roomId} className="flex-1 bg-transparent px-3 text-sm font-mono text-zinc-300 outline-none" />
                  <button onClick={() => copyToClipboard(roomId)} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button>
                </div>
              </div>

              {/* QR Code Toggle */}
              <div className="pt-2">
                <button 
                  onClick={() => setShowQR(!showQR)}
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" /></svg>
                  {showQR ? 'Hide QR Code' : 'Create QR and Share'}
                </button>
                
                {/* Free API to instantly generate a QR code from the URL! */}
                {showQR && (
                  <div className="mt-4 p-4 bg-white rounded-xl inline-block shadow-lg">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(roomLink)}`} 
                      alt="Room QR Code"
                      className="w-32 h-32"
                    />
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 🔥 ACTIVE ROOM UI (UNCHANGED)
  // ==========================================
  return (
    <main className="flex flex-col min-h-screen lg:h-screen bg-black text-white p-4 md:p-6 lg:overflow-hidden">
      
      <nav className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-zinc-800 mb-6 gap-4 shrink-0">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">Study Session</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Room Code: <span className="text-white font-mono bg-zinc-900 px-2 py-1 rounded border border-zinc-800">{roomId}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800 shadow-lg">
            {!timerEndTime ? (
              <button 
                onClick={() => handleTimerAction('start')}
                className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
                title="Start Pomodoro"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
              </button>
            ) : (
              <button 
                onClick={() => handleTimerAction('stop')}
                className="p-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                title="Stop Timer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></svg>
              </button>
            )}
            <div className={`px-4 py-1.5 rounded-lg font-mono text-xl font-bold min-w-[85px] text-center transition-all duration-500 ${isTimeRunningOut ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-black text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="w-px h-8 bg-zinc-800 hidden sm:block"></div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2.5 text-sm font-medium text-white transition-all border rounded-lg border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
          >
            Leave Room
          </button>
        </div>
      </nav>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
          
          {/* Participants Area */}
          <div className="flex-1 border border-zinc-800 bg-zinc-950/50 rounded-2xl p-4 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="font-semibold">Participants</h2>
              <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs font-medium">{participants.length}</span>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[140px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
              {participants.map((p) => (
                <div key={p.socketId} className="relative bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden group">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-2xl font-bold text-zinc-400 group-hover:scale-110 transition-transform">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium border border-zinc-800/50">
                    {p.name} {p.name === userName && '(You)'}
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full">
                    {/* Placeholder for real mic state in future phases */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-red-400"><path d="M14.228 15.289a6.012 6.012 0 01-1.478.471v2.49h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.49a6.002 6.002 0 01-1.478-.471.75.75 0 01.39-1.448 4.5 4.5 0 005.176 0 .75.75 0 01.39 1.448z" /><path d="M12.75 6.75a.75.75 0 00-1.5 0v3.315a2.25 2.25 0 001.5 0V6.75z" /><path fillRule="evenodd" d="M1.371 2.812a.75.75 0 011.06 0l18.75 18.75a.75.75 0 01-1.06 1.06l-2.006-2.006a8.251 8.251 0 01-4.865 1.545.75.75 0 01-.197-1.488 6.756 6.756 0 003.353-1.042l-4.656-4.656V12.75a3 3 0 01-2.92-3l-2.836-2.836a4.5 4.5 0 00-2.394 6.766.75.75 0 01-1.096 1.02A6.002 6.002 0 014.5 6.471L2.431 4.402a.75.75 0 010-1.06V2.812z" clipRule="evenodd" /></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shared To-Do List */}
          <div className="h-56 shrink-0 border border-zinc-800 bg-zinc-950/50 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center shrink-0">
              <h2 className="font-semibold text-sm">Shared Tasks</h2>
              <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs font-medium text-zinc-300">
                {todos.filter(t => !t.completed).length} pending
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
              {todos.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-500 text-sm">No tasks yet. Add a study goal below!</div>
              ) : (
                <ul className="flex flex-col gap-1">
                  {todos.map(todo => (
                    <li key={todo.id} className="flex items-center gap-3 p-2 hover:bg-zinc-800/40 rounded-lg group transition-colors">
                      <input type="checkbox" checked={todo.completed} onChange={() => handleToggleTodo(todo.id)} className="w-4 h-4 rounded border-zinc-600 bg-zinc-900 checked:bg-white checked:border-white focus:ring-0 cursor-pointer accent-white transition-colors" />
                      <span className={`flex-1 text-sm truncate transition-all ${todo.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>{todo.text}</span>
                      <button onClick={() => handleDeleteTodo(todo.id)} className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1" title="Delete task">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <form onSubmit={handleAddTodo} className="p-2 border-t border-zinc-800 bg-zinc-900/30 shrink-0 flex gap-2">
              <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a new task..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-500 transition-colors" />
              <button type="submit" disabled={!newTodo.trim()} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors">Add</button>
            </form>
          </div>
        </div>

        {/* Live Chat */}
        <div className="flex flex-col h-[500px] lg:h-full border border-zinc-800 bg-zinc-950/50 rounded-2xl overflow-hidden min-h-0">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
            <h2 className="font-semibold">Live Chat</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
            {messages.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center mt-4">No messages yet. Say hi!</p>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender === userName;
                return (
                  <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs text-zinc-500 mb-1">{isMe ? 'Me' : msg.sender} • {msg.timestamp}</span>
                    <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${isMe ? 'bg-white text-black rounded-tr-sm' : 'bg-zinc-800 text-white rounded-tl-sm'}`}>{msg.text}</div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800 bg-zinc-900/30 flex gap-2 shrink-0">
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:border-zinc-500 transition-colors" />
            <button type="submit" disabled={!newMessage.trim()} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors">Send</button>
          </form>
        </div>
      </div>
    </main>
  );
}