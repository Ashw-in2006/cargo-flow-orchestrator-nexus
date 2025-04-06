
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
            <SidebarTrigger className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-secondary transition-colors" />
            <h1 className="text-xl font-semibold text-center flex-1">Cargo Flow Orchestrator</h1>
            <div className="w-10 h-10"></div>
          </div>
          <main className="p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
