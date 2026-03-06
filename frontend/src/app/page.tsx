"use client";
import Link from "next/link";
import { Zap, Users, Dumbbell, Facebook, Instagram, Check } from "lucide-react";
import { useEffect } from "react";

import Navbar from "./components/Navbar"; // Ensure this path matches your file structure

export default function Home() {
  useEffect(() => {
    // Intersection Observer for Scroll Animations (Fade up effect)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-black">
      {/* 1. Add the Navbar here */}
      <Navbar />

      {/* 2. Main Content - Added pt-20 so content isn't hidden behind the fixed navbar */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-20 relative">
        
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600 rounded-full blur-[140px] opacity-15 pointer-events-none"></div>

        <div className="z-10 text-center max-w-3xl space-y-8 reveal opacity-0 translate-y-10 transition-all duration-1000 ease-out">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-3 py-1 text-xs font-medium text-red-500 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            New memberships open for 2026
          </div>

          <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
            PUSH YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">LIMITS.</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Join the elite fitness community. State-of-the-art equipment, expert trainers, and an environment designed for growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link 
              href="#pricing" 
              className="inline-flex h-14 items-center justify-center rounded-lg bg-red-600 px-22 text-base font-bold text-white hover:bg-red-700 hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
            >
              View Memberships
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 w-full max-w-6xl z-10">
          <FeatureCard 
            icon={<Dumbbell className="h-6 w-6 text-red-500" />}
            title="Pro Equipment"
            description="Top-tier machines and free weights for serious lifters."
          />
          <FeatureCard 
            icon={<Users className="h-6 w-6 text-red-500" />}
            title="Expert Trainers"
            description="Certified coaches ready to guide your transformation journey."
          />
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-red-500" />}
            title="High Energy"
            description="An atmosphere built on intensity, discipline, and results."
          />
        </div>

        {/* MEMBERSHIP SECTION */}
        <section id="pricing" className="w-full max-w-5xl mt-32 mb-20 z-10">
          <div className="text-center mb-12 reveal opacity-0 translate-y-10 transition-all duration-1000">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">Membership Plans</h2>
            <p className="text-zinc-400">Invest in yourself. Choose the plan that fits your goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 6 Months Plan */}
            <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 delay-100 relative group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-8 hover:border-red-600/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-400 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">
                Standard
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-white">6 Months</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">₱1,000</span>
                    <span className="ml-2 text-zinc-500 text-sm">/ total</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Students: ₱800</p>
                </div>

                <ul className="mt-8 space-y-4 flex-1">
                  {['Unlimited Gym Access', 'Locker Room Access', 'Standard Equipment'].map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-zinc-300 group-hover:text-white transition-colors">
                      <Check className="h-4 w-4 text-red-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button className="w-full rounded-lg bg-zinc-800 py-3 text-sm font-bold text-white hover:bg-zinc-700 hover:scale-[1.02] transition-all duration-300 border border-zinc-700 hover:border-zinc-500">
                  Select Plan
                </button>
              </div>
            </div>

            {/* 12 Months Plan */}
            <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 delay-200 relative group flex flex-col rounded-2xl border-2 border-red-600/50 bg-red-600/5 backdrop-blur-sm p-8 shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:shadow-[0_0_50px_rgba(220,38,38,0.3)] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">
                Best Value
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-white">12 Months</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">₱2,000</span>
                    <span className="ml-2 text-zinc-500 text-sm">/ total</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Students: ₱1,600</p>
                </div>

                <ul className="mt-8 space-y-4 flex-1">
                  {['Unlimited Gym Access', 'Priority Locker', 'All Equipment Access', 'Free STRYV Shirt', '1 Free Training Session'].map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-white font-medium">
                      <Check className="h-4 w-4 text-red-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button className="w-full rounded-lg bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-red-900/20">
                  Select Plan
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 bg-black pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start reveal opacity-0 translate-y-10 transition-all duration-1000">
               <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 bg-red-600 rounded flex items-center justify-center font-black text-white text-[10px]">D</div>
                  <span className="text-lg font-bold tracking-tight text-white">STRYV<span className="text-red-600"> Fitness</span></span>
               </div>
               <p className="text-xs text-zinc-500">
                  © {new Date().getFullYear()} KSYN Fitness. All rights reserved.
               </p>
            </div>

            <div className="flex items-center gap-6 reveal opacity-0 translate-y-10 transition-all duration-1000 delay-100">
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
  )
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-red-900/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.2)] transition-all duration-300 group">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-950 border border-zinc-800 group-hover:border-red-600/50 group-hover:bg-red-900/20 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-white group-hover:text-red-500 transition-colors duration-300">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  )
}