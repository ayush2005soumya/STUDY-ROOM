import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation',
};

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}