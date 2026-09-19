'use client';

import React from 'react';
import {
  Activity,
  Compass,
  Sliders,
  BarChart3,
  FlaskConical,
  Info,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Sparkles,
  Zap
} from 'lucide-react';
import { ProtocolType, RoutingMode } from '@/types/network';

export type ActiveTab = 'city' | 'explorer' | 'controls' | 'analytics' | 'lab' | 'about';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  healthScore: number;
  protocol: ProtocolType;
  routingMode: RoutingMode;
  onOpenLearningModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isRunning,
  onToggleRunning,
  onReset,
  healthScore,
  protocol,
  routingMode,
  onOpenLearningModal,
}) => {
  const getHealthBadge = (score: number) => {
    if (score >= 85) {
      return { label: 'Stable', bg: 'bg-[#D8F3E5]', text: 'text-[#2D6A4F]', border: 'border-[#B7E4C7]' };
    }
    if (score >= 65) {
      return { label: 'Busy', bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', border: 'border-[#FDE68A]' };
    }
    if (score >= 40) {
      return { label: 'Degraded', bg: 'bg-[#FFE7D9]', text: 'text-[#9A3412]', border: 'border-[#FDBA74]' };
    }
    return { label: 'Critical', bg: 'bg-[#FDE4EA]', text: 'text-[#9F1239]', border: 'border-[#FDA4AF]' };
  };

  const health = getHealthBadge(healthScore);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'city', label: 'City View', icon: <Compass className="w-4 h-4" /> },
    { id: 'explorer', label: 'Packet Explorer', icon: <Activity className="w-4 h-4" /> },
    { id: 'controls', label: 'Traffic Control', icon: <Sliders className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'lab', label: 'Simulation Lab', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8ECF2] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('city')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#DCEBFA] via-[#E8E4F3] to-[#FDE4EA] flex items-center justify-center border border-[#D5DCF0] shadow-sm">
              <span className="text-xl">🏙️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-[#2D3142]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                  Netropolis
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-[#E8E4F3] text-[#7F77A8] border border-[#D8D2EC]">
                  Sim v1.0
                </span>
              </div>
              <p className="text-[11px] text-[#7A8398] italic hidden sm:block">
                Network Traffic as an Intelligent City
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F4F6FB] p-1 rounded-xl border border-[#E6EBF3]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-[#2D3142] shadow-xs font-semibold'
                      : 'text-[#64748B] hover:text-[#2D3142] hover:bg-white/60'
                  }`}
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  <span className={isActive ? 'text-[#4A7FB8]' : 'text-[#8C98AC]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Header Items */}
          <div className="flex items-center gap-2.5">
            {/* Quick Health Score Pill */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${health.bg} ${health.text} ${health.border}`}
              title={`Network Health: ${healthScore}/100 (${health.label})`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              <span>Health {healthScore}%</span>
            </div>

            {/* Current Mode Pills */}
            <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-[#F4F6FB] border border-[#E2E7F0] rounded-lg text-xs text-[#5C6479]">
              <span className="font-semibold text-[#4A7FB8]">{protocol}</span>
              <span className="text-[#A3ADC2]">|</span>
              <span className="truncate max-w-[110px]" title={routingMode}>
                {routingMode === 'congestion-aware' ? 'Congestion-Aware' : 'Shortest Path'}
              </span>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={onToggleRunning}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-xs ${
                isRunning
                  ? 'bg-[#FFE7D9] hover:bg-[#FCD8C4] text-[#C46A42] border-[#F9CBB2]'
                  : 'bg-[#D8F3E5] hover:bg-[#C2EBD4] text-[#2D6A4F] border-[#B7E4C7]'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isRunning ? 'Pause' : 'Start'}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              title="Reset Simulation & Clear Packets"
              className="p-1.5 text-[#64748B] hover:text-[#2D3142] hover:bg-[#F1F4F9] rounded-lg border border-transparent hover:border-[#E2E6EE] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Learning Modal Trigger */}
            <button
              onClick={onOpenLearningModal}
              title="Educational Concept Guide & Tooltips"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#E8E4F3] hover:bg-[#DCD5EE] text-[#695F96] border border-[#D5CDEC] rounded-lg text-xs font-medium transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Learn</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-[#EAEFF5] text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md whitespace-nowrap ${
                activeTab === item.id ? 'bg-[#DCEBFA] text-[#2C5282] font-bold' : 'text-[#64748B]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
