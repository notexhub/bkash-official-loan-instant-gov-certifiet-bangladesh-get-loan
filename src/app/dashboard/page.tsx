'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, CreditCard, Landmark, PiggyBank, PlusSquare, Smartphone, Wallet, Send, ShoppingBag, Lightbulb } from 'lucide-react';
import Banner from '@/components/Banner';

export default function Dashboard() {
  const [phone, setPhone] = useState('');
  const router = useRouter();

  useEffect(() => {
    const p = sessionStorage.getItem('temp_phone');
    if (!p) router.push('/login');
    setPhone(p || '');
  }, [router]);

  return (
    <div className="mobile-container flex flex-col bg-[#F5F5F5] fade-in">
      {/* bKash App Header */}
      <div className="bg-bkash-pink p-4 text-white rounded-b-[30px] shadow-lg mb-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/10">
               <Landmark className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-bold opacity-90">ইউজার পোর্টাল</p>
              <div className="bg-white text-bkash-pink text-[11px] px-3 py-0.5 rounded-full font-black mt-1 inline-block">
                ব্যালেন্স দেখতে ট্যাপ করুন
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 space-y-4 pb-10">
        {/* Banner */}
        <Banner />

        {/* Loan Tile */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer" onClick={() => router.push('/apply')}>
           <div className="w-14 h-14 bg-bkash-pink/10 rounded-2xl flex items-center justify-center">
              <Landmark className="text-bkash-pink" size={28} />
           </div>
           <div className="flex-1">
              <h3 className="font-extrabold text-gray-800">সিটি ব্যাংক লোন</h3>
              <p className="text-[12px] text-gray-500 font-bold">ইন্সট্যান্ট লোন সুবিধা নিন</p>
           </div>
           <button className="bg-bkash-pink text-white text-[10px] font-black px-4 py-2 rounded-full shadow-md uppercase">
              Apply
           </button>
        </div>

        {/* Services Grid (Mini) */}
        <div className="bg-white rounded-2xl p-4 grid grid-cols-4 gap-4 shadow-sm border border-gray-50">
           <SmallIcon icon={<Send size={20} className="text-bkash-pink" />} label="সেন্ড মানি" />
           <SmallIcon icon={<Smartphone size={20} className="text-bkash-pink" />} label="মোবাইল রিচার্জ" />
           <SmallIcon icon={<ShoppingBag size={20} className="text-bkash-pink" />} label="পেমেন্ট" />
           <SmallIcon icon={<Wallet size={20} className="text-bkash-pink" />} label="ক্যাশ আউট" />
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
           <p className="text-[11px] font-bold text-gray-400 px-1 uppercase tracking-wider">অন্যান্য সার্ভিস</p>
           <div className="bg-white rounded-2xl shadow-sm border border-gray-50 divide-y divide-gray-50 overflow-hidden">
               <ListItem icon={<PiggyBank size={20} className="text-blue-500" />} label="সেভিংস" />
               <ListItem icon={<Landmark size={20} className="text-green-600" />} label="লোন রেকর্ড" />
               <ListItem icon={<Lightbulb size={20} className="text-orange-500" />} label="পে বিল" />
           </div>
        </div>
      </div>
    </div>
  );
}

function SmallIcon({ icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
        {icon}
      </div>
      <span className="text-[10px] font-extrabold text-gray-600">{label}</span>
    </div>
  );
}

function ListItem({ icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex justify-between items-center p-4 active:bg-gray-50 transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        {icon}
        <span className="text-[13px] font-bold text-gray-700">{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-300" />
    </div>
  );
}
