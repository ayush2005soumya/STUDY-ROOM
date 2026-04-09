// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function DashboardPage() {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isJoining, setIsJoining] = useState(false);
//   const [joinCode, setJoinCode] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/login');
//     } else {
//       setIsAuthenticated(true);
//     }
//   }, [router]);

//   const handleCreateRoom = async () => {
//     setIsLoading(true);
//     const token = localStorage.getItem('token');
    
//     try {
//       const res = await fetch('http://localhost:5000/api/rooms', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` 
//         },
//       });

//       const data = await res.json();
//       if (res.ok) {
//         // Instantly route them to their newly created dynamic URL
//         router.push(`/room/${data.roomId}`);
//       } else {
//         alert(data.error);
//         setIsLoading(false);
//       }
//     } catch (err) {
//       alert('Failed to connect to server.');
//       setIsLoading(false);
//     }
//   };

//   const handleJoinRoom = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!joinCode) return;
    
//     setIsLoading(true);
//     const token = localStorage.getItem('token');

//     try {
//       const res = await fetch(`http://localhost:5000/api/rooms/${joinCode.toUpperCase()}`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });

//       if (res.ok) {
//         router.push(`/room/${joinCode.toUpperCase()}`);
//       } else {
//         alert('Invalid Room Code!');
//         setIsLoading(false);
//       }
//     } catch (err) {
//       alert('Failed to connect to server.');
//       setIsLoading(false);
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-black">
//         <div className="w-8 h-8 border-4 border-zinc-800 border-t-white rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black">
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-zinc-500 via-zinc-400 to-zinc-600 blur-[150px] opacity-20 rounded-full pointer-events-none" />

//       <div className="relative z-10 w-full max-w-3xl p-8 mx-4 border border-zinc-800 bg-zinc-950/60 backdrop-blur-2xl rounded-2xl shadow-2xl">
        
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
//             <p className="text-sm text-zinc-400">Welcome back. Choose an action below to get started.</p>
//           </div>
//           <button 
//             onClick={() => {
//               localStorage.removeItem('token');
//               router.push('/login');
//             }}
//             className="text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors focus:outline-none"
//           >
//             Log Out
//           </button>
//         </div>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
//           {/* Create Room Card */}
//           <div className="flex flex-col p-6 border border-zinc-800 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/40 transition-colors group">
//             <div className="w-10 h-10 mb-4 rounded-full bg-white/10 flex items-center justify-center text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-white mb-2">Create Room</h3>
//             <p className="text-sm text-zinc-400 mb-6 flex-grow">Start a new study session and generate a link to invite others.</p>
//             <button 
//               onClick={handleCreateRoom}
//               disabled={isLoading}
//               className="w-full py-2.5 text-sm font-semibold text-black transition-all bg-white rounded-lg hover:bg-zinc-200 active:scale-95 disabled:opacity-50"
//             >
//               {isLoading ? 'Creating...' : 'Create New Room'}
//             </button>
//           </div>

//           {/* Join Room Card */}
//           <div className="flex flex-col p-6 border border-zinc-800 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/40 transition-colors group">
//             <div className="w-10 h-10 mb-4 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-white mb-2">Join Room</h3>
//             <p className="text-sm text-zinc-400 mb-6 flex-grow">Have a room ID? Join an existing session instantly.</p>
            
//             {isJoining ? (
//               <form onSubmit={handleJoinRoom} className="flex gap-2">
//                 <input 
//                   type="text" 
//                   placeholder="CODE" 
//                   value={joinCode}
//                   onChange={(e) => setJoinCode(e.target.value)}
//                   className="w-full px-3 py-2 text-sm text-center text-white uppercase transition-all bg-zinc-950 border border-zinc-700 rounded-lg outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
//                   maxLength={6}
//                   autoFocus
//                 />
//                 <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-semibold text-black bg-white rounded-lg hover:bg-zinc-200">
//                   Go
//                 </button>
//               </form>
//             ) : (
//               <button 
//                 onClick={() => setIsJoining(true)}
//                 className="w-full py-2.5 text-sm font-medium text-white transition-all border rounded-lg border-zinc-700 bg-zinc-900 hover:bg-zinc-800 active:scale-95"
//               >
//                 Enter Code
//               </button>
//             )}
//           </div>

//         </div>
//       </div>
//     </main>
//   );
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/room/${data.roomId}`);
      } else {
        alert(data.error);
        setIsLoading(false);
      }
    } catch (err) {
      alert('Failed to connect to server.');
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) return;
    
    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${joinCode.toUpperCase()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        router.push(`/room/${joinCode.toUpperCase()}`);
      } else {
        alert('Invalid Room Code!');
        setIsLoading(false);
      }
    } catch (err) {
      alert('Failed to connect to server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4">
      <div className="w-full max-w-3xl p-8 border border-zinc-800 bg-zinc-950/80 backdrop-blur-md rounded-2xl shadow-2xl">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-sm text-zinc-400">Choose an action below to get started.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Create Room Card */}
          <div className="flex flex-col p-6 border border-zinc-800 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/40 transition-colors group">
            <div className="w-10 h-10 mb-4 rounded-full bg-white/10 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Create Room</h3>
            <p className="text-sm text-zinc-400 mb-6 flex-grow">Start a new study session and generate a link to invite others.</p>
            <button 
              onClick={handleCreateRoom}
              disabled={isLoading}
              className="w-full py-2.5 text-sm font-semibold text-black transition-all bg-white rounded-lg hover:bg-zinc-200 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create New Room'}
            </button>
          </div>

          {/* Join Room Card */}
          <div className="flex flex-col p-6 border border-zinc-800 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/40 transition-colors group">
            <div className="w-10 h-10 mb-4 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Join Room</h3>
            <p className="text-sm text-zinc-400 mb-6 flex-grow">Have a room ID? Join an existing session instantly.</p>
            
            {isJoining ? (
              <form onSubmit={handleJoinRoom} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="CODE" 
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-center text-white uppercase transition-all bg-zinc-950 border border-zinc-700 rounded-lg outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
                  maxLength={6}
                  autoFocus
                />
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-semibold text-black bg-white rounded-lg hover:bg-zinc-200">
                  Go
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsJoining(true)}
                className="w-full py-2.5 text-sm font-medium text-white transition-all border rounded-lg border-zinc-700 bg-zinc-900 hover:bg-zinc-800 active:scale-95"
              >
                Enter Code
              </button>
            )}
          </div>
        </div>

        {/* Logout moved to sidebar, so we can remove it from here! */}
      </div>
    </div>
  );
}