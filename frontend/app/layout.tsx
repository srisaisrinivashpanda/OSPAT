import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import TopNavBar from '@/components/layout/TopNavBar';
import EditorialFooter from '@/components/layout/EditorialFooter';
import AmbientShaderBackground from '@/components/layout/AmbientShaderBackground';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OSPAT — Policy-Integrated Admission & Treatment Intelligence',
  description:
    'Clinical decision-support and health insurance policy intelligence system mapping room caps, network hospital compatibility, and inpatient care journeys.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google Material Symbols Outlined font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-on-surface antialiased selection:bg-primary selection:text-on-primary font-sans relative">
        <AmbientShaderBackground />
        <TopNavBar />
        <div className="flex-1 w-full pt-20">
          {children}
        </div>
        <EditorialFooter />
      </body>
    </html>
  );
}
