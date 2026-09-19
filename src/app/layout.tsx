import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Netropolis — Visualizing Computer Network Traffic as an Intelligent City',
  description:
    'An interactive educational computer networks simulation mapping packets to vehicles, routers to intersections, links to roads, congestion to traffic jams, and routing algorithms to city navigation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[#F8F9FC]">
        {children}
      </body>
    </html>
  );
}
