// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Dashboard',
// };

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return <>{children}</>;
// }

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

// Next.js needs this default function to know how to render the layout!
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}