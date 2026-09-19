'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<number>(0);
  const [fadingOut, setFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // Sequence stages
    const timer1 = setTimeout(() => setPhase(1), 600);   // Vehicle starts traveling, node 1 lights up
    const timer2 = setTimeout(() => setPhase(2), 1400);  // Network nodes illuminate & connect
    const timer3 = setTimeout(() => setPhase(3), 2200);  // Netropolis title emerges
    const timer4 = setTimeout(() => setPhase(4), 3000);  // Subtitle fades in & little cars loop around
    const timer5 = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onComplete, 800);
    }, 4800); // Smooth transition into main app

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setFadingOut(true);
    setTimeout(onComplete, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#FFFDF9] via-[#F4F6FC] to-[#EAE8F7] transition-opacity duration-700 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      {/* Subtle Skip Intro Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-8 px-4 py-2 text-sm text-[#7F77A8] hover:text-[#2D3142] bg-white/70 hover:bg-white border border-[#E2E6EE] rounded-full shadow-sm transition-all flex items-center gap-1.5 backdrop-blur-sm group z-20"
      >
        <span>Skip Intro</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Background Decorative Grid and City Road Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="intro-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E6EE" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#intro-grid)" />
        </svg>
      </div>

      {/* Central Interactive Animation Stage */}
      <div className="relative w-full max-w-2xl h-80 flex flex-col items-center justify-center z-10 px-4">
        {/* Curving SVG Network Road */}
        <svg className="absolute w-full h-full" viewBox="0 0 600 240" fill="none">
          {/* Base Road */}
          <path
            d="M 50 120 C 150 40, 220 200, 300 120 C 380 40, 450 200, 550 120"
            stroke="#DCE2EC"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Road center marking */}
          <path
            d="M 50 120 C 150 40, 220 200, 300 120 C 380 40, 450 200, 550 120"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="animate-road-flow"
          />

          {/* Additional interconnecting cross-streets that fade in */}
          <path
            d="M 180 80 Q 300 20 420 80"
            stroke={phase >= 2 ? '#E8E4F3' : 'transparent'}
            strokeWidth="4"
            strokeDasharray="4 4"
            className="transition-all duration-1000"
          />
          <path
            d="M 180 160 Q 300 220 420 160"
            stroke={phase >= 2 ? '#D8F3E5' : 'transparent'}
            strokeWidth="4"
            strokeDasharray="4 4"
            className="transition-all duration-1000"
          />

          {/* Nodes along the road */}
          {/* Node 1: Client House */}
          <g
            className={`transition-all duration-700 ${
              phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <circle cx="50" cy="120" r="16" fill="#DCEBFA" stroke="#4A7FB8" strokeWidth="2" />
            <text x="50" y="124" fontSize="12" textAnchor="middle" fill="#4A7FB8">🏠</text>
            <text x="50" y="150" fontSize="10" textAnchor="middle" fill="#5C6479" fontWeight="bold">Client A</text>
          </g>

          {/* Node 2: Router R1 */}
          <g
            className={`transition-all duration-700 ${
              phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <circle cx="180" cy="80" r="14" fill="#E8E4F3" stroke="#7F77A8" strokeWidth="2" />
            <text x="180" y="84" fontSize="11" textAnchor="middle" fill="#7F77A8">🚦</text>
            <text x="180" y="60" fontSize="9" textAnchor="middle" fill="#7F77A8">R1 Hub</text>
          </g>

          {/* Node 3: Router R2 (Central) */}
          <g
            className={`transition-all duration-700 ${
              phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <circle cx="300" cy="120" r="18" fill="#FEF3C7" stroke="#B4831B" strokeWidth="2" />
            <text x="300" y="125" fontSize="12" textAnchor="middle" fill="#B4831B">🗼</text>
          </g>

          {/* Node 4: Router R3 */}
          <g
            className={`transition-all duration-700 ${
              phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <circle cx="420" cy="160" r="14" fill="#D8F3E5" stroke="#3D8B68" strokeWidth="2" />
            <text x="420" y="164" fontSize="11" textAnchor="middle" fill="#3D8B68">🚦</text>
            <text x="420" y="190" fontSize="9" textAnchor="middle" fill="#3D8B68">R3 Egress</text>
          </g>

          {/* Node 5: Server Data Center */}
          <g
            className={`transition-all duration-700 ${
              phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <circle cx="550" cy="120" r="16" fill="#FDE4EA" stroke="#C65D7B" strokeWidth="2" />
            <text x="550" y="124" fontSize="12" textAnchor="middle" fill="#C65D7B">🏢</text>
            <text x="550" y="150" fontSize="10" textAnchor="middle" fill="#5C6479" fontWeight="bold">Server Alpha</text>
          </g>

          {/* Travelling Vehicle 1 (TCP Packet) */}
          <g className="animate-float">
            <animateMotion
              path="M 50 120 C 150 40, 220 200, 300 120 C 380 40, 450 200, 550 120"
              dur="3.2s"
              repeatCount="indefinite"
            />
            {/* Cute Pastel Vehicle */}
            <circle cx="0" cy="0" r="8" fill="#4A7FB8" />
            <circle cx="0" cy="0" r="5" fill="#DCEBFA" />
            <rect x="-6" y="-3" width="12" height="6" rx="2" fill="#2563EB" opacity="0.8" />
          </g>

          {/* Travelling Vehicle 2 (UDP Packet on bypass) */}
          {phase >= 3 && (
            <g>
              <animateMotion
                path="M 180 80 Q 300 20 420 80 Q 485 100 550 120"
                dur="2.4s"
                repeatCount="indefinite"
              />
              <circle cx="0" cy="0" r="7" fill="#C65D7B" />
              <circle cx="0" cy="0" r="4" fill="#FDE4EA" />
            </g>
          )}
        </svg>

        {/* Floating Clouds */}
        <div className="absolute top-4 left-10 text-2xl opacity-60 animate-pulse">☁️</div>
        <div className="absolute bottom-4 right-12 text-xl opacity-60 animate-pulse">☁️</div>
      </div>

      {/* Main Title & Subtitle Reveal */}
      <div className="relative text-center mt-2 z-10 px-4">
        <div
          className={`transition-all duration-1000 transform ${
            phase >= 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 bg-[#E8E4F3]/80 border border-[#D0C8E8] text-[#7F77A8] rounded-full text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligent Network Visualization</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#2D3142] drop-shadow-sm">
            Netropolis
          </h1>
        </div>

        <div
          className={`transition-all duration-1000 delay-200 transform mt-3 ${
            phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <p className="text-lg md:text-xl text-[#5C6479] italic font-serif max-w-xl mx-auto">
            “Visualizing Computer Network Traffic as an Intelligent City”
          </p>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#7F77A8]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A7FB8] inline-block"></span>
              Packets as Vehicles
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7F77A8] inline-block"></span>
              Routers as Intersections
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3D8B68] inline-block"></span>
              Links as Roads
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Progress Bar */}
      <div className="absolute bottom-8 w-48 h-1 bg-[#E2E6EE] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#4A7FB8] via-[#7F77A8] to-[#C65D7B] transition-all duration-[4200ms] ease-out"
          style={{ width: phase >= 1 ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
};
