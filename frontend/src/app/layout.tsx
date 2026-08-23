import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { Navigation } from '@/components/layout/Navigation';
import { Disclaimer } from '@/components/layout/Disclaimer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OSPAT — Policy-Integrated Admission & Treatment',
  description:
    'Policy-aware intelligence for hospital admission and care navigation.',
  keywords: ['healthcare', 'insurance', 'hospital', 'policy', 'India'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`antialiased ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-slate-50 font-sans">
        <QueryProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Disclaimer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
