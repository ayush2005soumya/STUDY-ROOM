// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable in dev so it doesn't aggressively cache your hot-reloads
});

const nextConfig: NextConfig = {
  /* Any existing Next.js config options you had go here */
};

export default withPWA(nextConfig);