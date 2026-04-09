'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// --- ICONS ---
const ChevronIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-4 h-4 transition-transform duration-300 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
);
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
);
const SidebarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
);

// Menu Icons
const BellIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
const DotsIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>;
const SettingsIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const FeedbackIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>;
const ThemeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>;
const HelpIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>;
const DocsIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const LogoutIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>;

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  // User States
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  // Popup States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Auth & Data Fetching
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setUserName(localStorage.getItem('userName') || 'User');
      setUserEmail(localStorage.getItem('userEmail') || 'user@example.com');
      setIsAuthChecking(false);
      if (pathname === '/') router.push('/home');
    }
  }, [router, pathname]);

  // Click outside to close popups
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const navItems = [
    { name: 'Home', path: '/home', icon: HomeIcon },
    { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon }
  ];

  const activeIndex = navItems.findIndex(item => pathname.startsWith(item.path));

  if (isAuthChecking) return <div className="h-screen bg-black" />;

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden selection:bg-white selection:text-black relative">
      
      {/* Sidebar */}
      <aside 
        className={`relative flex flex-col border-r border-zinc-800 bg-zinc-950/50 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-20 shrink-0 ${isCollapsed ? 'w-[72px]' : 'w-64'}`}
      >
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="absolute -right-4 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all z-50 shadow-[0_0_10px_rgba(0,0,0,0.5)] outline-none"
        >
          <ChevronIcon className={isCollapsed ? 'rotate-180' : ''} />
        </button>

        {/* Sidebar Header */}
        <div className="flex items-center h-20 px-6 border-b border-zinc-800/50 shrink-0 overflow-hidden whitespace-nowrap">
          {isCollapsed ? (
            <div className="flex w-full items-center justify-center -ml-2">
               <SidebarIcon />
            </div>
          ) : (
            <span className="text-lg font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              StudyRooms
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 relative [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-800 overflow-x-hidden">
          <nav className="relative flex flex-col gap-2">
            <div
              className={`absolute left-0 w-full h-10 bg-zinc-800/80 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${activeIndex === -1 ? 'opacity-0' : 'opacity-100'}`}
              style={{ transform: `translateY(${activeIndex * 48}px)` }} 
            />
            {navItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <Link 
                  key={item.path} 
                  href={item.path} 
                  className={`relative z-10 flex items-center h-10 px-3 rounded-lg transition-colors duration-200 ${isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  <item.icon />
                  <span className={`ml-3 text-sm font-medium whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 translate-x-4 w-0 hidden' : 'opacity-100 translate-x-0'}`}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* 🔥 NEW: User Profile Section */}
        <div ref={popupRef} className="relative border-t border-zinc-800/50 p-4 shrink-0">
          
          {/* PROFILE POPUP */}
          {isProfileOpen && (
            <div className="absolute bottom-[calc(100%+0.5rem)] -left-2 w-[272px] h-[80vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-2 flex flex-col z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between p-3">
                <div className="overflow-hidden pr-2">
                  <h3 className="font-bold text-white truncate">{userName}</h3>
                  <p className="text-zinc-400 text-xs truncate">{userEmail}</p>
                </div>
                <button className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0">
                  <SettingsIcon />
                </button>
              </div>
              
              <div className="h-px bg-zinc-800/50 w-full my-2" />
              
              {/* Menu Items */}
              <div className="flex flex-col gap-1 overflow-y-auto">
                <button className="flex items-center justify-start gap-3 w-full p-2.5 rounded-lg hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-colors text-sm font-medium">
                  <UserIcon /> Profile
                </button>
                <button className="flex items-center justify-start gap-3 w-full p-2.5 rounded-lg hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-colors text-sm font-medium">
                  <FeedbackIcon /> Feedback
                </button>
                <button className="flex items-center justify-start gap-3 w-full p-2.5 rounded-lg hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-colors text-sm font-medium">
                  <ThemeIcon /> Change Theme
                </button>
                <button className="flex items-center justify-start gap-3 w-full p-2.5 rounded-lg hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-colors text-sm font-medium">
                  <HelpIcon /> Help
                </button>
                <button className="flex items-center justify-start gap-3 w-full p-2.5 rounded-lg hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-colors text-sm font-medium">
                  <DocsIcon /> Docs
                </button>
                
                <div className="h-px bg-zinc-800/50 w-full my-1" />
                
                {/* Functional Logout */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-start gap-3 w-full p-2.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                >
                  <LogoutIcon /> Log Out
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATION POPUP */}
          {isNotifOpen && (
            <div className="absolute bottom-[calc(100%+0.5rem)] -left-2 w-[272px] h-[80vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 overflow-hidden">
              <div className="flex border-b border-zinc-800">
                <button className="flex-1 py-4 text-sm font-semibold border-b-2 border-white text-white">Inbox</button>
                <button className="flex-1 py-4 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors">Archive</button>
              </div>
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm p-6 text-center">
                You're all caught up! No new notifications.
              </div>
            </div>
          )}

          {/* Bottom Bar UI */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            
            {/* Avatar & Name */}
            <div 
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
              className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${isCollapsed ? 'justify-center w-full' : ''}`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 shadow-inner">
                {userName.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <span className="text-sm font-medium truncate max-w-[100px]">{userName}</span>
              )}
            </div>

            {/* Icons (Hidden when collapsed) */}
            {!isCollapsed && (
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                  className={`p-2 rounded-full transition-colors ${isNotifOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`}
                >
                  <BellIcon />
                </button>
                <button 
                  onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                  className={`p-2 rounded-full transition-colors ${isProfileOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'}`}
                >
                  <DotsIcon />
                </button>
              </div>
            )}
          </div>
        </div>

      </aside>

      {/* Main Page Content */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto bg-black relative z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none fixed" />
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>

    </div>
  );
}