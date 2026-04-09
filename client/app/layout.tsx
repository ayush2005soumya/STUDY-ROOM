// import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Or whatever font you are using
// import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

// // --- UPDATE THIS OBJECT ---
// export const metadata: Metadata = {
//   title: {
//     template: '%s - Study Rooms',
//     default: 'Real-Time Study Rooms', // This shows on the home page
//   },
//   description: 'Sync and study with zero distractions.',
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   );
// }

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 🔥 NEW: Locks zooming on mobile so it feels like a native app
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 🔥 UPDATED: Added the manifest link
export const metadata: Metadata = {
  title: {
    template: '%s - Study Rooms',
    default: 'Real-Time Study Rooms',
  },
  description: 'Sync and study with zero distractions.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}