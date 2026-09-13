import React, { useState, useRef } from 'react';
import { Award } from 'lucide-react';

interface MakeInIndiaLionProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MakeInIndiaLion: React.FC<MakeInIndiaLionProps> = ({
  className = '',
  size = 'lg',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-full max-w-[340px] h-[260px]';
      case 'lg':
        return 'w-full max-w-[620px] h-[360px] sm:h-[400px]';
      default:
        return 'w-full max-w-[500px] h-[320px] sm:h-[350px]';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={toggleFlip}
      title="Click to flip (क्लिक करके 3D कार्ड घुमाएं)"
      className={`w-full flex flex-col items-center justify-center text-center select-none cursor-pointer ${className}`}
      style={{ perspective: '1400px' }}
    >
      {/* 3D Flippable Card Stage */}
      <div
        className={`relative ${getSizeClasses()} transition-transform duration-700 ease-out`}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY + (isFlipped ? 180 : 0)}deg) scale3d(${
            isHovered ? 1.02 : 1
          }, ${isHovered ? 1.02 : 1}, 1)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glowing Indian Tricolor Ambient Aura */}
        <div
          className={`absolute inset-0 -m-6 rounded-3xl bg-gradient-to-r from-orange-500/35 via-white/10 to-emerald-500/35 blur-3xl transition-opacity duration-500 pointer-events-none ${
            isHovered ? 'opacity-100 scale-105' : 'opacity-60 scale-100'
          }`}
          style={{ transform: 'translateZ(-10px)' }}
        />

        {/* ========================================================================= */}
        {/* FRONT FACE: ONLY 3D Extruded Gear Lion Image (Clean & Pristine) */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl bg-black border border-orange-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(255,119,0,0.2)] overflow-hidden flex items-center justify-center p-4 sm:p-6"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          {/* Dynamic 3D Glare / Specular Sheen Beam */}
          <div
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-200"
            style={{
              opacity: isHovered && !isFlipped ? 0.35 : 0,
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 165, 0, 0.25) 30%, transparent 70%)`,
            }}
          />

          {/* 3D Embossed Mechanical Gear Lion Image (Clean Hero Showcase) */}
          <img
            src="/make_in_india_lion_3d.jpg"
            alt="Make in India 3D Lion"
            className="w-full h-full object-contain filter contrast-[1.08] brightness-[1.03]"
            loading="lazy"
          />
        </div>

        {/* ========================================================================= */}
        {/* BACK FACE: ONLY PM Modi Speech (Speech Text Only) */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 border-2 border-orange-500/45 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(255,119,0,0.25)] overflow-hidden flex flex-col justify-between p-5 sm:p-7 text-left"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Dynamic 3D Glare on Back */}
          <div
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-200"
            style={{
              opacity: isHovered && isFlipped ? 0.3 : 0,
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 165, 0, 0.2) 30%, transparent 70%)`,
            }}
          />

          {/* Top Tricolor Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF7700] via-white to-[#138808]" />

          {/* Header of the Back Face */}
          <div className="flex items-center space-x-3 border-b border-slate-800/90 pb-3 z-10">
            <div className="h-9 w-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white tracking-wide uppercase flex items-center space-x-1.5">
                <span className="text-orange-400">PM Modi</span>
                <span>Speech</span>
                <span className="text-xs">🇮🇳</span>
              </h4>
              <p className="text-[10px] sm:text-[11px] text-amber-300 font-medium">
                ऐतिहासिक संबोधन • Make in India & आत्मनिर्भर भारत
              </p>
            </div>
          </div>

          {/* Speech Text Content */}
          <div className="my-3 flex-1 overflow-y-auto pr-1 space-y-3 z-10 text-[11px] sm:text-[12px] leading-relaxed text-slate-200 font-sans custom-scrollbar">
            <p className="text-slate-300">
              "आज जब हम <strong className="text-white font-bold">21वीं सदी के भारत</strong> की बात करते हैं, तो हमारे सामने एक ऐसा संकल्प होता है जो सिर्फ देश की सीमाओं तक सीमित नहीं है, बल्कि पूरी दुनिया में भारत की एक नई पहचान बना रहा है। वह संकल्प है— <span className="text-orange-400 font-extrabold">"Make in India" (मेक इन इंडिया)</span> और <span className="text-emerald-400 font-extrabold">"आत्मनिर्भर भारत"</span>।
            </p>

            <p className="text-slate-300">
              जब हमने 'मेक इन इंडिया' की शुरुआत की थी, तब यह सिर्फ एक स्लोगन या नारा नहीं था। यह भारत के <strong className="text-amber-300 font-bold">140 करोड़ नागरिकों के सामर्थ्य</strong>, हमारे युवाओं के कौशल और हमारे उद्यमियों के जज्बे पर एक अटूट विश्वास था। आज यह आह्वान एक <span className="text-white underline decoration-orange-400 underline-offset-2">जन-आंदोलन</span> बन चुका है।
            </p>

            <p className="text-slate-300">
              साथियों, हमें सिर्फ एक बाजार (Market) बनकर नहीं रहना है। हमें दुनिया का एक प्रमुख <strong className="text-orange-300 font-bold">ग्लोबल मैन्युफैक्चरिंग हब</strong> बनना है। जब हम कहते हैं "मेक इन इंडिया", तो हमारा मतलब सिर्फ भारत में सामान बनाना नहीं है। हमारा उद्देश्य है— <span className="text-white font-extrabold bg-orange-950/60 px-1.5 py-0.5 rounded border border-orange-500/40">"Make for India" और "Make for the World"</span>। यानी हम जो भी बनाएं, उसकी गुणवत्ता (Quality) इतनी शानदार हो कि दुनिया कहे— <em className="text-amber-200 font-semibold">'दिस प्रोडक्ट इज मेड इन इंडिया'</em>।
            </p>

            <p className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-emerald-300 font-medium">
              हमारे पास <span className="font-extrabold text-white">"Zero Defect, Zero Effect"</span> का मंत्र है। हमारे उत्पाद में कोई कमी न हो (<span className="text-amber-300">Zero Defect</span>) और हमारे पर्यावरण पर इसका कोई बुरा असर न पड़े (<span className="text-emerald-400">Zero Effect</span>)।"
            </p>
          </div>

          {/* Bottom Pillar Badges */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-[9px] font-bold text-orange-300">
                Make for World
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-bold text-emerald-300">
                Zero Defect Zero Effect
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
