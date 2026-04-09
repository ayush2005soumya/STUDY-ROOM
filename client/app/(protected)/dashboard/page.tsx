// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function DashboardPage() {
//   const router = useRouter();
//   const [isJoining, setIsJoining] = useState(false);
//   const [joinCode, setJoinCode] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

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

//   return (
//     <div className="flex flex-col items-center justify-center min-h-full p-4">
//       <div className="w-full max-w-3xl p-8 border border-zinc-800 bg-zinc-950/80 backdrop-blur-md rounded-2xl shadow-2xl">

//         <div className="mb-10">
//           <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
//           <p className="text-sm text-zinc-400">Choose an action below to get started.</p>
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

//         {/* Logout moved to sidebar, so we can remove it from here! */}
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  // Existing States
  const [isJoining, setIsJoining] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 NEW: Modal & Room Configuration States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  // Form Values
  // 🔥 UPDATED: Start completely empty
  const [pomodoroTime, setPomodoroTime] = useState<number | ''>('');
  const [chatDisabled, setChatDisabled] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);
  const [coAdmin, setCoAdmin] = useState('');

  // Grab the user's details for the auto-filled Admin section
  useEffect(() => {
    setAdminName(localStorage.getItem('userName') || 'User');
    setAdminEmail(localStorage.getItem('userEmail') || 'user@example.com');
  }, []);

  // We will wire this up to your new page in the next step!
  const handleConfirmCreate = () => {
    // For now, we will just log the settings and wait for your next prompt
    console.log("Room Settings:", { pomodoroTime, chatDisabled, videoDisabled, coAdmin });
    alert("Settings captured! Waiting for your redirect instructions.");
    setIsCreateModalOpen(false);
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
    <div className="flex flex-col items-center justify-center min-h-full p-4 relative">

      {/* --- DASHBOARD MAIN CONTENT --- */}
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
            <p className="text-sm text-zinc-400 mb-6 flex-grow">Start a new study session and configure your room settings.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full py-2.5 text-sm font-semibold text-black transition-all bg-white rounded-lg hover:bg-zinc-200 active:scale-95"
            >
              Configure New Room
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
      </div>

      {/* --- 🔥 NEW: CREATE ROOM MODAL --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">

            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
              <h2 className="text-xl font-bold text-white">Room Settings</h2>
              <p className="text-sm text-zinc-400 mt-1">Configure your study session before launching.</p>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">

              {/* 1. Pomodoro Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Pomodoro Duration (Minutes)</label>
                <input
                  type="number"
                  value={pomodoroTime}
                  onChange={(e) => {
                    const val = e.target.value;
                    // If they backspace everything, let it be completely empty
                    if (val === '') {
                      setPomodoroTime('');
                      return;
                    }
                    // Otherwise, parse the integer and enforce the minimum of 1
                    const parsed = parseInt(val, 10);
                    if (!isNaN(parsed)) {
                      setPomodoroTime(Math.max(1, parsed));
                    }
                  }}
                  onKeyDown={(e) => {
                    // Prevent typing decimals, negative signs, and scientific notation
                    if (e.key === '.' || e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
                      e.preventDefault();
                    }
                  }}
                  placeholder="e.g. 25"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-zinc-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="h-px bg-zinc-800/50 w-full" />

              {/* 2 & 3. Slider Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-300">Disable Chat</h4>
                    <p className="text-xs text-zinc-500">Prevent participants from sending messages.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChatDisabled(!chatDisabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${chatDisabled ? 'bg-white' : 'bg-zinc-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${chatDisabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-300">Disable Video</h4>
                    <p className="text-xs text-zinc-500">Turn off cameras for all participants.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVideoDisabled(!videoDisabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${videoDisabled ? 'bg-white' : 'bg-zinc-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${videoDisabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="h-px bg-zinc-800/50 w-full" />

              {/* 4. Admin Details (Visually Disabled) */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  Admin Details
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-500"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={adminName}
                    readOnly
                    className="w-full bg-zinc-900/50 border border-zinc-800/50 text-zinc-500 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed select-none"
                  />
                  <input
                    type="text"
                    value={adminEmail}
                    readOnly
                    className="w-full bg-zinc-900/50 border border-zinc-800/50 text-zinc-500 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed select-none"
                  />
                </div>
              </div>

              {/* 5. Co-Admin Details */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">Co-Admin Email (Optional)</label>
                <input
                  type="email"
                  value={coAdmin}
                  onChange={(e) => setCoAdmin(e.target.value)}
                  placeholder="partner@example.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-zinc-500 transition-colors text-sm"
                />
              </div>

            </div>

            {/* 6 & 7. Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 shrink-0 flex items-center justify-between">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white border border-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmCreate}
                className="px-8 py-2.5 rounded-lg text-sm font-bold bg-white text-black hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
              >
                OK
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}