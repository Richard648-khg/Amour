import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Stars, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NON_MESSAGES = [
  "Tu as dû glisser, réessaye ! 😉",
  "Es-tu vraiment, vraiment sûr(e) ?",
  "Même après tout ce qu'on a vécu ? 🥺",
  "Regarde-moi dans les yeux et redis-le...",
  "Bon, j'abandonne, le bouton 'Non' est cassé par tristesse. Clique sur 'Oui' !"
];

const FINAL_MESSAGE = "Depuis que tu es dans ma vie, chaque seconde est une poésie. Merci d'être toi, merci d'être là. Je t'aime plus que les mots ne peuvent l'écrire.";

export default function App() {
  const [step, setStep] = useState<'hero' | 'test' | 'climax'>('hero');
  const [nonIndex, setNonIndex] = useState(0);
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleYes = async () => {
    setStep('climax');
    
    // Confetti effect
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // petals and hearts
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#E63946', '#D4AF37', '#FFF9F9'],
        shapes: ['circle']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#E63946', '#D4AF37', '#FFF9F9'],
        shapes: ['circle']
      });
    }, 250);

    // Start typing effect
    setIsTyping(true);
  };

  useEffect(() => {
    if (isTyping && typedMessage.length < FINAL_MESSAGE.length) {
      const timeout = setTimeout(() => {
        setTypedMessage(FINAL_MESSAGE.slice(0, typedMessage.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else if (typedMessage.length === FINAL_MESSAGE.length) {
      setIsTyping(false);
    }
  }, [isTyping, typedMessage]);

  const handleNo = () => {
    if (nonIndex < NON_MESSAGES.length - 1) {
      setNonIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background with grain effect */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-cover bg-center grayscale-[0.3]"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop")',
          filter: 'contrast(1.1) brightness(0.9)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-rose-white/40 backdrop-blur-[2px]" />
      
      <main className="relative z-10 w-full max-w-2xl px-6 text-center">
        <AnimatePresence mode="wait">
          {step === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="text-gold fill-gold/10" size={64} strokeWidth={1} />
                </motion.div>
                <Stars className="absolute -top-2 -right-2 text-gold animate-pulse" size={20} />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display italic text-gold tracking-tight leading-tight">
                Une petite surprise <br /> t'attend ici...
              </h1>
              
              <button
                onClick={() => setStep('test')}
                className="mt-8 px-10 py-4 bg-passion-red text-rose-white font-sans font-semibold tracking-[0.2em] uppercase rounded-full shadow-xl hover:shadow-passion-red/20 hover:scale-105 transition-all duration-300 group"
              >
                Découvrir
                <Sparkles className="inline-block ml-2 group-hover:rotate-12 transition-transform" size={18} />
              </button>
            </motion.div>
          )}

          {step === 'test' && (
            <motion.div
              key="test"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-12"
            >
              <div className="space-y-4">
                <p className="text-gold font-script text-4xl mb-2">Question de cœur</p>
                <h2 className="text-4xl md:text-6xl font-display text-midnight">
                  Est-ce que tu m'aimes ?
                </h2>
                <p className={cn(
                  "text-passion-red font-sans italic transition-all duration-300 min-h-[1.5rem]",
                  nonIndex > 0 ? "opacity-100" : "opacity-0"
                )}>
                  {NON_MESSAGES[nonIndex - 1]}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                <button
                  onClick={handleYes}
                  className="heart-pulse px-12 py-4 bg-passion-red text-rose-white font-sans font-bold tracking-widest uppercase rounded-full shadow-2xl hover:scale-110 transition-transform"
                >
                  OUI
                </button>
                
                <button
                  onClick={handleNo}
                  className={cn(
                    "px-12 py-4 border-2 border-midnight/20 text-midnight/60 font-sans font-bold tracking-widest uppercase rounded-full transition-all duration-300",
                    nonIndex === NON_MESSAGES.length ? "opacity-50 cursor-not-allowed" : "hover:bg-midnight/5"
                  )}
                >
                  NON
                </button>
              </div>
            </motion.div>
          )}

          {step === 'climax' && (
            <motion.div
              key="climax"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="p-8 md:p-12 border border-gold/30 bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl relative">
                <Heart className="absolute -top-4 -left-4 text-passion-red fill-passion-red" size={32} />
                <Heart className="absolute -bottom-4 -right-4 text-passion-red fill-passion-red" size={32} />
                
                <p className="text-2xl md:text-3xl font-display italic leading-relaxed text-midnight">
                  {typedMessage}
                  {isTyping && <span className="inline-block w-1 h-8 bg-gold ml-1 animate-pulse" />}
                </p>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="font-script text-5xl text-gold"
              >
                Pour toujours...
              </motion.div>

              <button
                onClick={() => {
                  setStep('hero');
                  setNonIndex(0);
                  setTypedMessage('');
                }}
                className="mt-8 text-xs font-sans tracking-[0.3em] uppercase text-midnight/40 hover:text-midnight transition-colors"
              >
                Recommencer
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer decoration */}
      <footer className="absolute bottom-8 z-10 text-[10px] font-sans tracking-[0.5em] uppercase text-gold/60">
        Fait avec amour &bull; 2026
      </footer>
    </div>
  );
}
