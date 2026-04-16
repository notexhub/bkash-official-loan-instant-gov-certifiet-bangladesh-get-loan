'use client';

import Link from 'next/link';
import Banner from '@/components/Banner';

export default function Home() {
  return (
    <div className="mobile-container justify-between bg-white fade-in">
      <div className="flex-1 flex flex-col ">
        <Banner />
        
      </div>

      {/* Bottom Pink Tray */}
      <div className="bg-bkash-pink p-8 rounded-t-[40px] flex flex-col items-center gap-6 shadow-2xl">
        <h2 className="text-white font-bold text-center text-[17px]">দারুণ সব সার্ভিস আপনার অপেক্ষায়</h2>
        
        <Link href="/login" className="w-full">
          <button className="w-full bg-white text-bkash-pink font-extrabold py-5 rounded-2xl text-xl shadow-lg active:scale-95 transition-all">
            লগ ইন / রেজিস্ট্রেশন
          </button>
        </Link>
        
        <div className="flex gap-4 text-white font-bold opacity-90 text-[12px]">
          <span>বিকাশ নাম্বার পরিবর্তন</span>
          <span>|</span>
          <span>যোগাযোগ</span>
          <span>|</span>
          <span>আমাদের সম্পর্কে</span>
        </div>

        <div className="mt-4 text-[10px] text-white/50">
          © 2026 আমার লোন লিমিটেড। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </div>
  );
}
