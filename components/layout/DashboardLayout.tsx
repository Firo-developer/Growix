'use client';

import {SidebarProvider, useSidebar} from '@/components/layout/SidebarContext';
import {Sidebar} from '@/components/layout/Sidebar';
import {TopBar} from '@/components/layout/TopBar';
import {cn} from '@/lib/utils';

function DashboardContent({children}: {children: React.ReactNode}) {
  const {collapsed} = useSidebar();

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div
        className={cn(
          'relative flex min-h-screen flex-col transition-[margin] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          collapsed ? 'lg:ml-[58px]' : 'lg:ml-[260px]',
        )}>
        <TopBar />
        <main className="relative flex-1 px-4 py-5 sm:px-5 sm:py-6">{children}</main>
      </div>
    </div>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({children}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
