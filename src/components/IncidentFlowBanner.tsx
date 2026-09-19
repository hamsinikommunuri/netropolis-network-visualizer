'use client';

import React from 'react';
import { IncidentFlowState } from '@/types/network';
import { AlertOctagon, CheckCircle2, RotateCw, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface IncidentFlowBannerProps {
  flowState: IncidentFlowState;
  onDismiss?: () => void;
}

export const IncidentFlowBanner: React.FC<IncidentFlowBannerProps> = ({ flowState, onDismiss }) => {
  if (!flowState.active && flowState.stage === 'idle') return null;

  return (
    <div className="pastel-card p-4 border border-[#FBCFE8] bg-gradient-to-r from-[#FFF5F7] via-[#FFFDF9] to-[#F0FDF4] shadow-soft animate-fade-in transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECEFF5] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FDE4EA] text-[#E11D48] flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-2">
              <span>Network Incident Live Transition</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#FDE4EA] text-[#9F1239] border border-[#FDA4AF]">
                {flowState.incidentTitle}
              </span>
            </h3>
            <p className="text-xs text-[#7A8398]">{flowState.message}</p>
          </div>
        </div>

        <div className="text-xs font-mono text-[#7A8398]">
          {flowState.timestamp}
        </div>
      </div>

      {/* 5-Step Visual Transition Diagram */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
        {/* Step 1: Previous Route */}
        <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-[10px] text-[#7A8398] uppercase font-bold block mb-1">
            1. Previous Route
          </span>
          <div className="font-mono text-[11px] text-[#334155] font-semibold truncate" title={flowState.previousRoute.join(' → ')}>
            {flowState.previousRoute.length > 0 ? flowState.previousRoute.join(' → ') : 'Client → R1 → R3 → Server'}
          </div>
          <span className="text-[10px] text-[#64748B] block mt-1">Normal shortest path</span>
        </div>

        {/* Step 2: Fault Detected */}
        <div className={`p-2.5 rounded-xl border transition-all shadow-2xs ${
          flowState.stage === 'failed'
            ? 'bg-[#FDE4EA] border-[#FDA4AF] ring-1 ring-[#E11D48]'
            : 'bg-white border-[#E2E8F0]'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-[#9F1239]">2. Failure Event</span>
            <AlertOctagon className="w-3.5 h-3.5 text-[#E11D48]" />
          </div>
          <div className="font-bold text-[11px] text-[#9F1239]">
            {flowState.incidentTitle.toUpperCase()}
          </div>
          <span className="text-[10px] text-[#BE185D] block mt-1">Packets in transit dropped</span>
        </div>

        {/* Step 3: Searching Alternate Route */}
        <div className={`p-2.5 rounded-xl border transition-all shadow-2xs ${
          flowState.stage === 'searching'
            ? 'bg-[#FEF3C7] border-[#FDE68A] ring-1 ring-[#D97706]'
            : 'bg-white border-[#E2E8F0]'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-[#92400E]">3. Route Calculation</span>
            <RotateCw className={`w-3.5 h-3.5 text-[#D97706] ${flowState.stage === 'searching' ? 'animate-spin' : ''}`} />
          </div>
          <div className="font-semibold text-[11px] text-[#92400E]">
            Searching Alternate Route...
          </div>
          <span className="text-[10px] text-[#B45309] block mt-1">Dijkstra cost update</span>
        </div>

        {/* Step 4: New Detour Route */}
        <div className={`p-2.5 rounded-xl border transition-all shadow-2xs ${
          flowState.stage === 'rerouted' || flowState.stage === 'recovered'
            ? 'bg-[#EFF6FF] border-[#BFDBFE] ring-1 ring-[#3B82F6]'
            : 'bg-white border-[#E2E8F0]'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-[#1E40AF]">4. New Route</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
          </div>
          <div className="font-mono text-[11px] text-[#1D4ED8] font-bold truncate" title={flowState.newRoute.join(' → ')}>
            {flowState.newRoute.length > 0 ? flowState.newRoute.join(' → ') : 'Client → R1 → R2 → R5 → Server'}
          </div>
          <span className="text-[10px] text-[#3B82F6] block mt-1">Traffic corridor diverted</span>
        </div>

        {/* Step 5: Network Recovered */}
        <div className={`p-2.5 rounded-xl border transition-all shadow-2xs ${
          flowState.stage === 'recovered'
            ? 'bg-[#D8F3E5] border-[#A7F3D0] ring-1 ring-[#10B981]'
            : 'bg-white border-[#E2E8F0]'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-[#065F46]">5. Status</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="font-bold text-[11px] text-[#065F46]">
            {flowState.stage === 'recovered' ? 'NETWORK RECOVERED' : 'Detour Active'}
          </div>
          <span className="text-[10px] text-[#047857] block mt-1">Flow stabilized</span>
        </div>
      </div>
    </div>
  );
};
