"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-zinc-800 shadow-lg"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-7 w-7 sm:h-8 sm:w-8 bg-red-600 rounded flex items-center justify-center font-black text-white text-[10px] sm:text-xs group-hover:rotate-3 transition-transform">
            S
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
            STRYV<span className="text-red-600"> Fitness</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/features"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Join now
          </Link>
          <Link
            href="/auth/login"
            className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-5 py-2 rounded-md text-sm font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden p-2 text-zinc-300 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`sm:hidden bg-black/95 backdrop-blur-md border-b border-zinc-800 overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 border-b-0'
        }`}
      >
        <div className="px-4 py-4 space-y-3">
          <Link
            href="/features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-md text-sm font-bold transition-all text-center"
          >
            Join now
          </Link>
          <Link
            href="/auth/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-md text-sm font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] text-center"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}