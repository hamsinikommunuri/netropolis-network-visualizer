'use client';

import React from 'react';
import { ProtocolType, RoutingMode } from '@/types/network';
import {
  Sliders,
  Zap,
  Flame,
  XOctagon,
  RefreshCw,
  Play,
  Pause,
  Shuffle,
  Shield,
  Send,
  SlidersHorizontal,
  Clock,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface TrafficControlsProps {
  isRunning: boolean;
  onStartSimulation: () => void;
  onPauseSimulation: () => void;
  packetRate: number;
  onChangePacketRate: (val: number) => void;
  lossRate: number;
  onChangeLossRate: (val: number) => void;
  congestionMultiplier: number;
  onChangeCongestion: (val: number) => void;
  bandwidthMultiplier: number;
  onChangeBandwidth: (val: number) => void;
  baseLatencyMultiplier: number;
  onChangeBaseLatency: (val: number) => void;
  burstPacketCount: number;
  onChangeBurstPacketCount: (val: number) => void;
  protocol: ProtocolType;
  onChangeProtocol: (proto: ProtocolType) => void;
  routingMode: RoutingMode;
  onChangeRoutingMode: (mode: RoutingMode) => void;
  onGenerateTraffic: () => void;
  onCreateCongestion: () => void;
  onFailRouter: () => void;
  onFailLink: () => void;
  onRestoreNetwork: () => void;
  onReset: () => void;
}

export const TrafficControls: React.FC<TrafficControlsProps> = ({
  isRunning,
  onStartSimulation,
  onPauseSimulation,
  packetRate,
  onChangePacketRate,
  lossRate,
  onChangeLossRate,
  congestionMultiplier,
  onChangeCongestion,
  bandwidthMultiplier,
  onChangeBandwidth,
  baseLatencyMultiplier,
  onChangeBaseLatency,
  burstPacketCount,
  onChangeBurstPacketCount,
  protocol,
  onChangeProtocol,
  routingMode,
  onChangeRoutingMode,
  onGenerateTraffic,
  onCreateCongestion,
  onFailRouter,
  onFailLink,
  onRestoreNetwork,
  onReset,
}) => {
  return (
    <div className="pastel-card p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#ECEFF5]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8E4F3] text-[#7F77A8] flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2D3142]">Traffic Control Panel</h2>
            <p className="text-xs text-[#7A8398]">Real-time Network Flow Modulation & Condition Tuning</p>
          </div>
        </div>

        {/* Primary Simulation Status Indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
              isRunning
                ? 'bg-[#D8F3E5] text-[#065F46] border-[#6EE7B7]'
                : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#10B981] animate-ping' : 'bg-[#F59E0B]'}`}></span>
            <span>{isRunning ? 'SIMULATION RUNNING' : 'SIMULATION PAUSED'}</span>
          </span>
        </div>
      </div>

      {/* Protocol & Routing Mode Switchers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Protocol Selector */}
        <div className="p-3 bg-[#F9FBFC] rounded-xl border border-[#E9EDF5]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#2D3142] uppercase tracking-wide flex items-center gap-1">
              <span>Transport Protocol</span>
              <span title="Layer 4: TCP guarantees reliability via ACKs & Retransmissions; UDP sends datagrams without verification." className="text-[#94A3B8] cursor-help">
                <HelpCircle className="w-3 h-3" />
              </span>
            </span>
            <span className="text-[10px] text-[#7A8398]">TCP vs UDP</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChangeProtocol('TCP')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                protocol === 'TCP'
                  ? 'bg-[#DCEBFA] text-[#1E40AF] border-[#93C5FD] shadow-xs ring-1 ring-[#3B82F6]'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>🚙</span>
                <span>TCP (Reliable)</span>
              </div>
              <span className="text-[10px] font-normal text-[#4A7FB8]">ACKs + Retransmissions</span>
            </button>

            <button
              onClick={() => onChangeProtocol('UDP')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                protocol === 'UDP'
                  ? 'bg-[#FDE4EA] text-[#BE185D] border-[#F472B6] shadow-xs ring-1 ring-[#EC4899]'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>🏎️</span>
                <span>UDP (Fast)</span>
              </div>
              <span className="text-[10px] font-normal text-[#C65D7B]">Low Latency, No Retries</span>
            </button>
          </div>
        </div>

        {/* Routing Mode Selector */}
        <div className="p-3 bg-[#F9FBFC] rounded-xl border border-[#E9EDF5]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#2D3142] uppercase tracking-wide flex items-center gap-1">
              <span>Routing Mode</span>
              <span title="Layer 3: Shortest Path uses static physical latency. Congestion-Aware dynamically factors link utilization and loss into path selection." className="text-[#94A3B8] cursor-help">
                <HelpCircle className="w-3 h-3" />
              </span>
            </span>
            <span className="text-[10px] text-[#7A8398]">Algorithm</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChangeRoutingMode('shortest-path')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                routingMode === 'shortest-path'
                  ? 'bg-[#E8E4F3] text-[#5B21B6] border-[#C4B5FD] shadow-xs ring-1 ring-[#8B5CF6]'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              <span>Shortest Path</span>
              <span className="text-[10px] font-normal text-[#7F77A8]">Static Dijkstra Latency</span>
            </button>

            <button
              onClick={() => onChangeRoutingMode('congestion-aware')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                routingMode === 'congestion-aware'
                  ? 'bg-[#D8F3E5] text-[#065F46] border-[#6EE7B7] shadow-xs ring-1 ring-[#10B981]'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              <span>Congestion-Aware</span>
              <span className="text-[10px] font-normal text-[#3D8B68]">Dynamic Load Cost</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Parameter Sliders (All 6 Required Controls) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* 1. Packet Generation Rate */}
        <div className="p-3 bg-white rounded-xl border border-[#ECEFF5] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#2D3142]">Packet Gen Rate</label>
              <span className="text-xs font-mono font-bold text-[#4A7FB8]">{packetRate} pkts/s</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={packetRate}
              onChange={(e) => onChangePacketRate(Number(e.target.value))}
              className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
            />
          </div>
          <span className="text-[10px] text-[#7A8398] mt-1.5">Dispatch frequency</span>
        </div>

        {/* 2. Link Bandwidth */}
        <div className="p-3 bg-white rounded-xl border border-[#ECEFF5] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#2D3142]">Link Bandwidth</label>
              <span className="text-xs font-mono font-bold text-[#3D8B68]">{bandwidthMultiplier}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.25"
              value={bandwidthMultiplier}
              onChange={(e) => onChangeBandwidth(Number(e.target.value))}
              className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
            />
          </div>
          <span className="text-[10px] text-[#7A8398] mt-1.5">Road vehicle capacity</span>
        </div>

        {/* 3. Network Congestion */}
        <div className="p-3 bg-white rounded-xl border border-[#ECEFF5] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#2D3142]">Congestion</label>
              <span className="text-xs font-mono font-bold text-[#EA580C]">{congestionMultiplier}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.5"
              value={congestionMultiplier}
              onChange={(e) => onChangeCongestion(Number(e.target.value))}
              className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#EA580C]"
            />
          </div>
          <span className="text-[10px] text-[#7A8398] mt-1.5">Cross-traffic load</span>
        </div>

        {/* 4. Artificial Packet Loss */}
        <div className="p-3 bg-white rounded-xl border border-[#ECEFF5] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#2D3142]">Packet Loss</label>
              <span className="text-xs font-mono font-bold text-[#E11D48]">{Math.round(lossRate * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.05"
              value={lossRate}
              onChange={(e) => onChangeLossRate(Number(e.target.value))}
              className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#EF4444]"
            />
          </div>
          <span className="text-[10px] text-[#7A8398] mt-1.5">Buffer drop probability</span>
        </div>

        {/* 5. Base Latency (REQUIRED BY SPEC) */}
        <div className="p-3 bg-white rounded-xl border border-[#ECEFF5] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#2D3142]">Base Latency</label>
              <span className="text-xs font-mono font-bold text-[#7C3AED]">{baseLatencyMultiplier}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.25"
              value={baseLatencyMultiplier}
              onChange={(e) => onChangeBaseLatency(Number(e.target.value))}
              className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
            />
          </div>
          <span className="text-[10px] text-[#7A8398] mt-1.5">Road propagation delay</span>
        </div>

        {/* 6. Number of Packets (REQUIRED BY SPEC) */}
        <div className="p-3 bg-white rounded-xl border border-[#ECEFF5] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#2D3142]">Number of Packets</label>
              <span className="text-xs font-mono font-bold text-[#2563EB]">{burstPacketCount} pkts</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={burstPacketCount}
              onChange={(e) => onChangeBurstPacketCount(Number(e.target.value))}
              className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
            />
          </div>
          <span className="text-[10px] text-[#7A8398] mt-1.5">Batch injection quantity</span>
        </div>
      </div>

      {/* Explicit Action Buttons Required by Section 10 */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-[#2D3142] uppercase tracking-wide">
            Interactive Control Actions
          </span>
          <span className="text-xs text-[#7A8398]">Direct Network State Manipulation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {/* 1. Start Simulation */}
          <button
            onClick={onStartSimulation}
            disabled={isRunning}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs border ${
              isRunning
                ? 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed'
                : 'bg-[#D8F3E5] hover:bg-[#C2EBD4] text-[#065F46] border-[#6EE7B7]'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start</span>
          </button>

          {/* 2. Pause */}
          <button
            onClick={onPauseSimulation}
            disabled={!isRunning}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs border ${
              !isRunning
                ? 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed'
                : 'bg-[#FFE7D9] hover:bg-[#FCD8C4] text-[#C46A42] border-[#F9CBB2]'
            }`}
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>

          {/* 3. Reset */}
          <button
            onClick={onReset}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-[#475569] border border-[#E2E8F0] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* 4. Generate Traffic */}
          <button
            onClick={onGenerateTraffic}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#DCEBFA] hover:bg-[#C5DFF8] text-[#1E40AF] border border-[#BFDBFE] transition-all flex items-center justify-center gap-1.5 shadow-xs"
            title={`Dispatch ${burstPacketCount} packet vehicles immediately`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Generate ({burstPacketCount})</span>
          </button>

          {/* 5. Create Congestion */}
          <button
            onClick={onCreateCongestion}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border border-[#FCD34D] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Congestion</span>
          </button>

          {/* 6. Fail Router */}
          <button
            onClick={onFailRouter}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#FDE4EA] hover:bg-[#FBCFE8] text-[#9F1239] border border-[#F472B6] transition-all flex items-center justify-center gap-1.5 shadow-xs"
            title="Fail Core Router R3 (Central Hub)"
          >
            <XOctagon className="w-3.5 h-3.5" />
            <span>Fail Router</span>
          </button>

          {/* 7. Fail Link */}
          <button
            onClick={onFailLink}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#FFE7D9] hover:bg-[#FED7AA] text-[#9A3412] border border-[#FB923C] transition-all flex items-center justify-center gap-1.5 shadow-xs"
            title="Sever Highway Link R1 ↔ R3"
          >
            <XOctagon className="w-3.5 h-3.5" />
            <span>Fail Link</span>
          </button>

          {/* 8. Restore Network */}
          <button
            onClick={onRestoreNetwork}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#D8F3E5] hover:bg-[#A7F3D0] text-[#065F46] border border-[#6EE7B7] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Restore</span>
          </button>
        </div>
      </div>
    </div>
  );
};

