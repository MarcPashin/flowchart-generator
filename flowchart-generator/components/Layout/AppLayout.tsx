'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const showSidebar = pathname !== '/' && pathname !== '/login';

  return (
    <div className="flex h-screen bg-light dark:bg-dark">
      {showSidebar && <Sidebar currentPath={pathname} />}
      
      <main className={`flex-1 overflow-auto ${showSidebar ? 'ml-64' : ''} ${pathname === '/' ? 'p-0' : 'p-8'}`}>
        {children}
      </main>
    </div>
  );
}