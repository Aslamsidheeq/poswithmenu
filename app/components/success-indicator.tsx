import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

interface SuccessIndicatorProps {
  onClose: () => void;
}

export function SuccessIndicator({ onClose }: SuccessIndicatorProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center animate-scale-in pointer-events-auto border border-[#e9ecef]">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4caf50] to-[#81c784] flex items-center justify-center mb-4 animate-bounce-in">
          <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
        </div>
        <h3 className="text-[#2c3e50] mb-2">Order Placed Successfully!</h3>
        <p className="text-[#6c757d]">Your order has been saved</p>
      </div>
    </div>
  );
}
