'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, Clock } from 'lucide-react';

export default function Processing() {
  const [status, setStatus] = useState<'loading' | 'success'>('loading');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
    }, 6000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mobile-container flex flex-col items-center justify-center p-8 text-center bg-white">
      {status === 'loading' ? (
        <div className="space-y-10 animate-in fade-in transition-all duration-300">
          <div className="relative w-32 h-32 mx-auto">
             <Loader2 className="w-32 h-32 text-bkash-pink animate-spin stroke-[1.5]" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-bkash-pink rounded-3xl shadow-lg border-4 border-white"></div>
             </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-800">তথ্য যাচাই করা হচ্ছে...</h2>
            <p className="text-gray-400 font-bold text-sm leading-relaxed px-4">
                আপনার দেওয়া তথ্যগুলো আমাদের সার্ভারে যাচাই করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন এবং ব্যাক (Back) রিফ্রেশ (Refresh) করবেন না।
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle size={56} className="text-green-500" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-gray-800">আবেদন সম্পন্ন হয়েছে!</h2>
            <p className="text-gray-500 font-bold leading-relaxed">
                আপনার লোন আবেদনটি সফলভাবে গ্রহণ করা হয়েছে। যাচাই বাছাই শেষে আপনাকে এসএমএস (SMS) এর মাধ্যমে ফলাফল জানানো হবে।
            </p>
          </div>
          <div className="bg-bkash-pink/[0.03] p-6 rounded-3xl flex items-start gap-4 text-left border border-bkash-pink/5">
             <div className="bg-bkash-pink/10 p-2 rounded-xl">
                <Clock className="text-bkash-pink" size={24} />
             </div>
             <div>
                <p className="font-black text-gray-800 text-sm mb-1">প্রক্রিয়াধীন সময়</p>
                <p className="text-xs font-bold text-gray-400">সাধারণত ২-৩ কার্যদিবসের মধ্যে ফলাফল জানানো হয়।</p>
             </div>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full bg-bkash-pink text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-xl"
          >
            হোম পেজে ফিরে যান
          </button>
        </div>
      )}
    </div>
  );
}
