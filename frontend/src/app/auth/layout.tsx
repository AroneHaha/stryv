import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
// Assuming your Navbar is in this location. Adjust if necessary.
import Navbar from "../components/Navbar"; 

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* 1. Add the Navbar here */}
      <Navbar />

      {/* 2. Main Content Area */}
      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* 3. Add the Footer here */}
      <footer className="w-full border-t border-zinc-900 bg-black pt-12 pb-8 mt-auto">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start">
               <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 bg-red-600 rounded flex items-center justify-center font-black text-white text-[10px]">D</div>
                  <span className="text-lg font-bold tracking-tight text-white">STRYV<span className="text-red-600"> Fitness</span></span>
               </div>
               <p className="text-xs text-zinc-500">
                  © {new Date().getFullYear()} KSYN Fitness. All rights reserved.
               </p>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors transform hover:scale-110 duration-200" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors transform hover:scale-110 duration-200" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors transform hover:scale-110 duration-200" aria-label="TikTok">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}