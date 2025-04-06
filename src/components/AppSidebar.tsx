
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  PackageSearch, 
  Boxes, 
  LayoutGrid, 
  Trash2, 
  Clock, 
  LineChart, 
  Settings,
  Menu
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppSidebar() {
  const isMobile = useIsMobile();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: LayoutGrid, label: 'Placement', path: '/placement' },
    { icon: PackageSearch, label: 'Search & Retrieve', path: '/search' },
    { icon: Boxes, label: 'Containers', path: '/containers' },
    { icon: Trash2, label: 'Waste Management', path: '/waste' },
    { icon: Clock, label: 'Time Simulation', path: '/simulation' },
    { icon: LineChart, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Boxes className="w-6 h-6 text-blue-500" />
          <span className="font-bold text-lg">CargoFlow</span>
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground w-full flex items-center gap-3 px-4 py-2 rounded-md" : 
                              "hover:bg-sidebar-accent/50 w-full flex items-center gap-3 px-4 py-2 rounded-md"
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-slate-400 text-center">
          <p>Cargo Flow Orchestrator</p>
          <p>v1.0.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
