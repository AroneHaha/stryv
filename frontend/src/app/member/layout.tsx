"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Calendar, 
  User, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const MEMBERS_STORAGE_KEY = 'gym_members';

// Helper function to get initial data from localStorage
function getInitialData(key: string): any[] {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get member data for display
  const members = typeof window !== 'undefined' ? getInitialData(MEMBERS_STORAGE_KEY) : [];
  const member = members.find((m: any) => m.name?.toLowerCase().includes('test')) || members[0];

  const navItems = [
    { 
      name: 'Attendance', 
      href: '/member', 
      icon: Calendar,
      active: pathname === '/member'
    },
    { 
      name: 'Profile', 
      href: '/member/profile', 
      icon: User,
      active: pathname === '/member/profile'
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-zinc-900 border-r border-zinc-800 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:sticky lg:top-0 lg:z-auto lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-screen">
          {/* Logo */}
          <div className="p-4 border-b border-zinc-800">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 bg-red-600 rounded flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)] group-hover:rotate-3 transition-transform">
                S
              </div>
              <span className="text-lg font-black text-white">
                STRYV<span className="text-red-600"> Fitness</span>
              </span>
            </Link>
          </div>

          {/* Member Info */}
          {member && (
            <div className="p-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-sm font-black text-white">
                  {member.name?.charAt(0) || 'M'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{member.name || 'Member'}</p>
                  <p className="text-[10px] text-zinc-500">{member.plan || 'Member'} Plan</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="p-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-3 py-2">
              Menu
            </p>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${item.active 
                    ? 'bg-red-600/10 text-red-500 border border-red-600/20' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Logout */}
          <div className="p-3 border-t border-zinc-800">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-500 hover:bg-red-600/10 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar - Mobile Only */}
        <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 bg-red-600 rounded flex items-center justify-center font-black text-white text-xs">
                S
              </div>
              <span className="text-base font-black text-white">
                STRYV<span className="text-red-600"> Fitness</span>
              </span>
            </Link>

            <div className="w-9" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Close button for mobile sidebar */}
      {isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="fixed top-4 right-4 z-[60] p-2 rounded-lg bg-zinc-800 text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
