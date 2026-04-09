// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await fetch('http://localhost:5000/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       // Save token and redirect to protected dashboard
//       localStorage.setItem('token', data.token);
//       router.push('/dashboard');
//     } else {
//       alert(data.error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-96">
//         <h2 className="mb-4 text-2xl font-bold">Login</h2>
//         <input 
//           type="email" 
//           placeholder="Email" 
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 mb-4 border rounded" 
//           required 
//         />
//         <input 
//           type="password" 
//           placeholder="Password" 
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 mb-4 border rounded" 
//           required 
//         />
//         <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded">
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // New state to track password visibility
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    // if (res.ok) {
    //   // Save token and redirect to protected dashboard
    //   localStorage.setItem('token', data.token);
    //   router.push('/dashboard');
    // } else {
    //   alert(data.error);
    // }
    if (res.ok) {
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // 🔥 NEW: Save the user's name. If they didn't provide one, use the first part of their email.
      const displayName = data.user.name || data.user.email.split('@')[0];
      localStorage.setItem('userName', displayName);

      // 🔥 NEW: Save the email for the profile popup
      localStorage.setItem('userEmail', data.user.email);
      
      router.push('/home');
    } else {
        alert(data.error);
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black">
      
      {/* Background Grid & Glow (Matches Home Page) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-zinc-500 via-zinc-400 to-zinc-600 blur-[120px] opacity-20 rounded-full pointer-events-none" />

      {/* Glassmorphism Form Container */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4 border border-zinc-800 bg-zinc-950/50 backdrop-blur-xl rounded-2xl shadow-2xl">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-sm text-zinc-400">Enter your credentials to access your study room.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="email">
              Email
            </label>
            <input 
              id="email"
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-white transition-all bg-zinc-900 border border-zinc-800 rounded-lg outline-none placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500" 
              required 
            />
          </div>

          {/* Password Input
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="password">
              Password
            </label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-white transition-all bg-zinc-900 border border-zinc-800 rounded-lg outline-none placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500" 
              required 
            />
          </div> */}
          {/* Password Input with Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input 
                id="password"
                // Type switches dynamically based on state
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // Added pr-12 so the text doesn't type underneath the eye icon
                className="w-full pl-4 pr-12 py-3 text-white transition-all bg-zinc-900 border border-zinc-800 rounded-lg outline-none placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500" 
                required 
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
              >
                {/* SVG Eye Icon (Open/Closed depending on state) */}
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-3 mt-4 text-sm font-semibold text-black transition-all bg-white rounded-lg hover:bg-zinc-200 hover:scale-[1.02] active:scale-95"
          >
            Sign In
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-400">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-white hover:underline transition-colors">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}