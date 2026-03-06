"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight, Eye, EyeOff, Dumbbell } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      // Check for member credentials
      if (formData.username === "test" && formData.password === "test") {
        router.push("/member");
      } else {
        router.push("/dashboard/dashboard");
      }
    }, 1500);
  };

  return (
    <div className="relative w-full h-186 flex items-center justify-center overflow-hidden bg-black">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[500px] bg-red-900 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
      
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{
             backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      <div className="relative z-10 w-full max-w-[400px] px-4">
        <div className="w-full rounded-2xl border border-zinc-800/1 bg-black/40 backdrop-blur-2xl p-8 shadow-2xl shadow-black/50">
          
          <div className="flex flex-col items-center justify-center mb-8">
            <Link href="/" className="flex items-center gap-2.5 mb-3 group">
              <div className="h-10 w-10 bg-red-600 rounded flex items-center justify-center font-black text-white text-sm shadow-[0_0_20px_rgba(220,38,38,0.4)] group-hover:rotate-3 transition-transform duration-300">
                S
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                STRYV<span className="text-red-600"> Fitness</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm font-medium tracking-wide">Welcome back, athlete.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Dumbbell className="h-5 w-5 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-zinc-800 rounded-xl bg-zinc-950/50 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all duration-300 text-sm"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Password
                </label>
                <Link href="#" className="text-[10px] font-medium text-red-500 hover:text-red-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Zap className="h-5 w-5 text-zinc-600 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-11 pr-11 py-3 border border-zinc-800 rounded-xl bg-zinc-950/50 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all duration-300 text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer text-zinc-600 hover:text-white transition-colors" 
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setShowPassword(!showPassword) }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold text-black rounded-xl bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 focus:ring-offset-zinc-900 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8.0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-zinc-800/50 pt-5">
            <p className="text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link href="/register" className="font-bold text-red-500 hover:text-red-400 transition-colors">
                Join the gym
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}