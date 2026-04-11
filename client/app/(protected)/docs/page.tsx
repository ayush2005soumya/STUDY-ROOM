'use client';

export default function DocsPage() {
  return (
    <div className="min-h-full p-6 md:p-10 lg:p-16 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        
        {/* Header */}
        <div className="space-y-4 border-b border-zinc-800 pb-8 shrink-0">
          <h1 className="text-4xl font-bold tracking-tight text-white">Documentation</h1>
          <p className="text-lg text-zinc-400">
            Welcome to the official StudyRooms guide. Learn how to maximize your focus, collaborate with peers, and navigate the platform's features.
          </p>
        </div>

        {/* Section 1: Getting Started */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Getting Started
          </h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white">Creating a Room</h3>
              <p className="text-zinc-400 mt-1 text-sm leading-relaxed">
                From the Dashboard, click <strong>"Configure New Room"</strong>. You will be prompted to set the default Pomodoro timer duration and toggle whether chat or video features are disabled for participants. Once created, you become the Room Admin.
              </p>
            </div>
            <div className="h-px w-full bg-zinc-800/50" />
            <div>
              <h3 className="text-lg font-medium text-white">Joining a Room</h3>
              <p className="text-zinc-400 mt-1 text-sm leading-relaxed">
                If you have a 6-character room code or a direct URL, you can enter it in the <strong>"Join Room"</strong> section on the Dashboard. 
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: The Pre-Join Lobby */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            The Pre-Join Lobby
          </h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <p className="text-zinc-400 text-sm leading-relaxed">
              Before entering a live study session, you are placed in a staging area. Here you can:
            </p>
            <ul className="list-disc list-inside text-sm text-zinc-300 space-y-2 ml-2">
              <li>Toggle your camera and microphone on or off.</li>
              <li>View how many participants are currently active in the room.</li>
              <li>Copy the direct URL or the 6-digit Room Code to share with peers.</li>
              <li>Generate and share a <strong>QR Code</strong> for instant mobile access.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Live Session Features */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            Live Session Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sync Timer */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-2">Synchronized Timer</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                The Pomodoro timer is synchronized server-side. When the Admin starts or stops the timer, it instantly updates for all participants in the room, ensuring everyone takes breaks at the exact same time.
              </p>
            </div>

            {/* Shared To-Do List */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-2">Shared Task List</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Add, complete, or delete tasks in real-time. The shared to-do list allows study groups to track collaborative goals or outline the syllabus for the current session.
              </p>
            </div>

            {/* Live Chat */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-2">Live Chat</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                A zero-latency WebSocket chat allows you to communicate with room members without disrupting the audio environment. 
              </p>
            </div>

            {/* Participant Grid */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-white mb-2">Live Roster</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                The participant grid dynamically updates as users join and leave the room, indicating who is currently active and displaying their current microphone status.
              </p>
            </div>

          </div>
        </section>

        {/* Section 4: Desktop & Mobile Installation */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
            Install as an App
          </h2>
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              StudyRooms is a Progressive Web App (PWA), meaning you can install it directly to your device for a native, distraction-free experience.
            </p>
            <div className="space-y-4">
              <div>
                <strong className="text-white text-sm">Desktop (Chrome/Edge):</strong>
                <p className="text-zinc-500 text-sm">Look for the installation icon (a monitor with a down arrow) on the far right side of your URL address bar.</p>
              </div>
              <div>
                <strong className="text-white text-sm">iOS (Safari):</strong>
                <p className="text-zinc-500 text-sm">Tap the "Share" icon at the bottom of the screen, then scroll down and select "Add to Home Screen".</p>
              </div>
              <div>
                <strong className="text-white text-sm">Android (Chrome):</strong>
                <p className="text-zinc-500 text-sm">A prompt should appear at the bottom of your screen asking to "Add to Home Screen." If not, tap the three-dot menu and select "Install App".</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}