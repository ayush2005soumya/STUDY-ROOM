import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ongoing Room',
};

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}