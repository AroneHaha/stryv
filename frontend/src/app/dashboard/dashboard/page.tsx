"use client";

import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Clock,
  AlertCircle,
  CreditCard
} from "lucide-react";

const stats = [
  { name: "Total Members", value: "1,240", change: "+12%", icon: Users, trend: "up" },
  { name: "Monthly Revenue", value: "₱45,200", change: "+8%", icon: DollarSign, trend: "up" },
  { name: "Today's Attendance", value: "142", change: "+5%", icon: Activity, trend: "up" },
  { name: "Active Staff", value: "8", change: "0%", icon: Users, trend: "neutral" },
];

const recentActivity = [
  { id: 1, user: "Juan Dela Cruz", action: "Checked In", time: "08:30 AM", date: "Today", type: "check-in" },
  { id: 2, user: "Maria Santos", action: "Renewed Membership", time: "10:15 AM", date: "Today", type: "payment" },
  { id: 3, user: "Pedro Reyes", action: "Registered New", time: "Yesterday", date: "Yesterday", type: "new" },
  { id: 4, user: "Anna Cruz", action: "Checked Out", time: "06:45 PM", date: "Yesterday", type: "check-out" },
];

const expiringMembers = [
  { id: 1, name: "Mark Bautista", plan: "12 Months", expiresIn: "2 days", method: "GCash" },
  { id: 2, name: "Sarah Lee", plan: "6 Months", expiresIn: "5 days", method: "Cash" },
  { id: 3, name: "John Doe", plan: "1 Month", expiresIn: "6 days", method: "GCash" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full w-full gap-3 sm:gap-4 p-3 sm:p-4 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Dashboard</h1>
          <p className="text-zinc-400 mt-0.5 sm:mt-1 text-xs sm:text-sm">Overview of your gym performance.</p>
        </div>
        <span className="hidden md:block px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500 text-xs font-mono">
          {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 flex-shrink-0">
        {stats.map((stat) => (
          <div key={stat.name} className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 sm:p-4 hover:border-red-600/30 transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/10 rounded-full blur-2xl -mr-5 -mt-5 pointer-events-none"></div>
            
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5 sm:mb-1 truncate">{stat.name}</p>
                <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">{stat.value}</h3>
              </div>
              <div className={`p-1 sm:p-1.5 rounded-lg flex-shrink-0 ${stat.trend === 'up' ? 'bg-red-600/10 text-red-500' : 'bg-zinc-800 text-zinc-400'}`}>
                <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            
            <div className="mt-2 sm:mt-3 flex items-center text-[10px] sm:text-xs">
              {stat.trend === 'up' && (
                <span className="flex items-center text-red-500 font-bold mr-1 sm:mr-2">
                  <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  {stat.change}
                </span>
              )}
              <span className="text-zinc-600 truncate">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 overflow-hidden">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 sm:p-4 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2 sm:mb-3 flex-shrink-0">
            <h3 className="text-base sm:text-lg font-bold text-white">Revenue Overview</h3>
            <select className="bg-black border border-zinc-800 text-zinc-400 text-[10px] sm:text-xs rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 focus:outline-none focus:border-red-600 w-24 sm:w-32">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          
          <div className="flex-1 w-full flex items-end justify-between gap-1 sm:gap-2 min-h-0">
            {[45, 70, 35, 60, 85, 50, 65].map((height, idx) => (
              <div key={idx} className="w-full h-full flex flex-col items-center justify-end gap-1 sm:gap-2">
                <div 
                  className="w-full bg-zinc-800 rounded-t-sm sm:rounded-t-lg relative overflow-hidden transition-all duration-500 hover:bg-red-900/20 min-h-[40px] sm:min-h-0" 
                  style={{ height: `calc(100% - 20px)` }}
                >
                  <div 
                    className="absolute bottom-0 left-0 w-full bg-red-600/80 hover:bg-red-500 transition-all duration-300" 
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <span className="text-[8px] sm:text-[10px] text-zinc-500 uppercase font-bold tracking-wider shrink-0">{'M T W T F S S'.split(' ')[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Column */}
        <div className="flex flex-col gap-2 sm:gap-3 h-full overflow-hidden">
          
          {/* Expiring Members Section */}
          <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 sm:p-4 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-2 sm:mb-3 flex-shrink-0">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />
                Expiring Soon
              </h3>
              <span className="text-[8px] sm:text-[9px] font-bold text-orange-500 bg-orange-500/10 px-1.5 sm:px-2 py-0.5 rounded">7 DAYS</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1.5 sm:space-y-2 pr-0.5 sm:pr-1">
              {expiringMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800 hover:border-red-600/30 transition-all">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold flex-shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs font-bold text-white leading-tight truncate">{member.name}</p>
                      <p className="text-[9px] sm:text-[10px] text-zinc-500 leading-tight truncate">{member.plan}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-[9px] sm:text-[10px] font-bold text-orange-500 leading-tight">{member.expiresIn}</p>
                    <div className="flex items-center justify-end gap-0.5 sm:gap-1 mt-0.5">
                      <CreditCard className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-zinc-600" />
                      <span className="text-[8px] sm:text-[9px] text-zinc-500 uppercase leading-none">{member.method}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 sm:p-4 flex flex-col min-h-0">
            <h3 className="text-[10px] sm:text-xs font-bold text-white mb-1.5 sm:mb-2 flex-shrink-0">Recent Activity</h3>
            
            <div className="flex-1 overflow-y-auto space-y-1.5 sm:space-y-2 pr-0.5 sm:pr-1">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-2 sm:gap-2.5">
                  <div className={`p-1 sm:p-1.5 rounded-full border shrink-0 ${
                    activity.type === 'payment' ? 'bg-green-900/20 border-green-800 text-green-500' :
                    activity.type === 'new' ? 'bg-blue-900/20 border-blue-800 text-blue-500' :
                    activity.type === 'check-out' ? 'bg-zinc-800 border-zinc-700 text-zinc-400' :
                    'bg-red-900/20 border-red-800 text-red-500'
                  }`}>
                    {activity.type === 'check-in' && <Activity className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                    {activity.type === 'payment' && <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                    {activity.type === 'new' && <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                    {activity.type === 'check-out' && <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold text-white truncate leading-tight">{activity.user}</p>
                    <p className="text-[9px] sm:text-[10px] text-zinc-500 truncate leading-tight">{activity.action}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] sm:text-[10px] text-zinc-400 leading-tight">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}