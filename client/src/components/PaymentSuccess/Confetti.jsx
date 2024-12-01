import { useEffect } from 'react';

export function Confetti() {
  useEffect(() => {
    const colors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
    const confettiCount = 150;
    
    function createConfetti() {
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.className = 'absolute w-2 h-2 rounded-full pointer-events-none opacity-0';
        confetti.style.backgroundColor = randomColor;
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animation = `confetti ${1 + Math.random() * 2}s ease-out forwards`;
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        
        document.getElementById('confetti-container')?.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
      }
    }
    
    createConfetti();
  }, []);

  return (
    <>
      <div id="confetti-container" className="fixed inset-0 pointer-events-none" />
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}