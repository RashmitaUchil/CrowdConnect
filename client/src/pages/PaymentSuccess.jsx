import { SuccessCard } from '@/components/PaymentSuccess/SuccessCard';
import { Confetti } from '@/components/PaymentSuccess/Confetti';

export function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <Confetti />
      <SuccessCard   />
    </div>
  );
}