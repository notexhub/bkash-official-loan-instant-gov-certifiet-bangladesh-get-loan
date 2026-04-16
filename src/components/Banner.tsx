'use client';

export default function Banner() {
  return (
    <div className="w-full h-auto overflow-hidden rounded-xl shadow-sm mb-4">
       <img 
         src="https://i.postimg.cc/05QS75Tc/IMG-20260224-053231.jpg" 
         alt="bKash Loan Banner" 
         className="w-full h-full object-cover"
         onError={(e) => {
           // Fallback if the link fails
           e.currentTarget.src = "https://i.postimg.cc/05QS75Tc/IMG-20260224-053231.jpg";
         }}
       />
    </div>
  );
}
