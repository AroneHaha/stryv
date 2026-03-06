"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign, 
  Wallet, 
  Menu, 
  X, 
  LogOut,
  ChevronDown,
  ChevronRight
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard/dashboard", icon: LayoutDashboard },
  { name: "User Management", icon: Users, hasSubmenu: true },
  { name: "Attendance", href: "/dashboard/attendance", icon: Calendar },
  { name: "Revenue", href: "/dashboard/revenue", icon: DollarSign },
  { name: "Payroll", href: "/dashboard/payroll", icon: Wallet },
];

const userManagementLinks = [
  { name: "Members", href: "/dashboard/members" },
  { name: "Employees", href: "/dashboard/employees" },
];

const gymLogo = (
  <div className="flex items-center gap-2.5">
    <div className="h-8 w-8 bg-red-600 rounded flex items-center justify-center font-black text-white text-xs shadow-[0_0_15px_rgba(220,38,38,0.5)]">
      S
    </div>
    <span className="text-xl font-black tracking-tight text-white">
      STRYV<span className="text-red-600"> Fitness</span>
    </span>
  </div>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || 'Dashboard';
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      
      {/* Mobile Overlay - Fixed to be solid black */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-950/95 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 border-b border-zinc-800">
          <Link href="/dashboard/dashboard">
            {gymLogo}
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-400 hover:text-white">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <nav className="px-3 sm:px-4 py-4 sm:py-6 space-y-2 overflow-y-auto h-[calc(100vh-8rem)] scrollbar-hide">
          {navigation.map((item) => {
            if (item.hasSubmenu) {
              const isActive = pathname === "/dashboard/members" || pathname === "/dashboard/employees";
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`w-full group flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive ? "bg-red-600/10 text-red-500 border border-red-600/20" : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className={`mr-3 h-4 w-4 sm:h-5 sm:w-5 ${isActive ? "text-red-500" : "text-zinc-500 group-hover:text-white transition-colors"}`} />
                      {item.name}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Items */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${userMenuOpen ? 'max-h-40 mt-2' : 'max-h-0'}`}>
                    <div className="pl-10 sm:pl-12 pr-2 pb-2 pt-1 space-y-1">
                      {userManagementLinks.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center justify-between px-3 sm:px-4 py-2 text-sm rounded-lg transition-colors ${
                            pathname === subItem.href
                              ? "text-red-500 bg-red-600/10 font-medium"
                              : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                          }`}
                        >
                          {subItem.name}
                          {pathname === subItem.href && <ChevronRight className="h-3 w-3" />}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href as string} 
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-red-600/10 text-red-500 border border-red-600/20"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
                }`}
              >
                <item.icon className={`mr-3 h-4 w-4 sm:h-5 sm:w-5 ${isActive ? "text-red-500" : "text-zinc-500 group-hover:text-white transition-colors"}`} />
                {item.name}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900">
          <Link 
            href="/" 
            className="flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-zinc-400 hover:text-red-500 hover:bg-zinc-800/50 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="mr-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-300" />
            Sign Out
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-950">
        
        <header className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-zinc-400 hover:text-white">
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight hidden sm:block">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white">Admin User</p>
                <p className="text-xs text-zinc-500">Owner</p>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                 <div className="h-full w-full bg-red-600/20 flex items-center justify-center text-red-500 font-bold text-base sm:text-lg">A</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 relative">
           <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
                style={{
                  backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }}>
           </div>
           
           <div className="relative z-10 w-full h-full">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
}