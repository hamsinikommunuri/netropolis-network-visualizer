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
} from 'lucide-react';

interface TrafficControlsProps {
  isRunning: boolean;
  onToggleRunning: () => void;
  packetRate: number;
  onChangePacketRate: (val: number) => void;
  lossRate: number;
  onChangeLossRate: (val: number) => void;
  congestionMultiplier: number;
  onChangeCongestion: (val: number) => void;
  bandwidthMultiplier: number;
  onChangeBandwidth: (val: number) => void;
  protocol: ProtocolType;
  onChangeProtocol: (proto: ProtocolType) => void;
  routingMode: RoutingMode;
  onChangeRoutingMode: (mode: RoutingMode) => void;
  onBurstTraffic: (count: number) => void;
  onTriggerCongestionSpike: () => void;
  onFailCoreRouter: () => void;
  onFailCoreLink: () => void;
  onRestoreAll: () => void;
  onReset: () => void;
}

export const TrafficControls: React.FC<TrafficControlsProps> = ({
  isRunning,
  onToggleRunning,
  packetRate,
  onChangePacketRate,
  lossRate,
  onChangeLossRate,
  congestionMultiplier,
  onChangeCongestion,
  bandwidthMultiplier,
  onChangeBandwidth,
  protocol,
  onChangeProtocol,
  routingMode,
  onChangeRoutingMode,
  onBurstTraffic,
  onTriggerCongestionSpike,
  onFailCoreRouter,
  onFailCoreLink,
  onRestoreAll,
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
            <p className="text-xs text-[#7A8398]">Real-time Network Flow Modulation</p>
          </div>
        </div>

        {/* Global Run/Pause */}
        <button
          onClick={onToggleRunning}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border ${
            isRunning
              ? 'bg-[#FFE7D9] text-[#C46A42] border-[#F9CBB2] hover:bg-[#FCD8C4]'
              : 'bg-[#D8F3E5] text-[#2D6A4F] border-[#B7E4C7] hover:bg-[#C2EBD4]'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isRunning ? 'PAUSE TRAFFIC' : 'RESUME TRAFFIC'}</span>
        </button>
      </div>

      {/* Protocol & Routing Mode Switchers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Protocol Selector */}
        <div className="p-3 bg-[#F9FBFC] rounded-xl border border-[#E9EDF5]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#2D3142] uppercase tracking-wide">Transport Protocol</span>
            <span className="text-[10px] text-[#7A8398]">Layer 4 Model</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChangeProtocol('TCP')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                protocol === 'TCP'
                  ? 'bg-[#DCEBFA] text-[#1E40AF] border-[#93C5FD] shadow-xs'
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
                  ? 'bg-[#FDE4EA] text-[#BE185D] border-[#F472B6] shadow-xs'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>🏎️</span>
                <span>UDP (Fast/Lossy)</span>
              </div>
              <span className="text-[10px] font-normal text-[#C65D7B]">Low Latency, No Retries</span>
            </button>
          </div>
        </div>

        {/* Routing Mode Selector */}
        <div className="p-3 bg-[#F9FBFC] rounded-xl border border-[#E9EDF5]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#2D3142] uppercase tracking-wide">Routing Algorithm</span>
            <span className="text-[10px] text-[#7A8398]">Layer 3 Path Selection</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChangeRoutingMode('shortest-path')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                routingMode === 'shortest-path'
                  ? 'bg-[#E8E4F3] text-[#5B21B6] border-[#C4B5FD] shadow-xs'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              <span>Shortest Path</span>
              <span className="text-[10px] font-normal text-[#7F77A8]">Static Dijkstra / Latency</span>
            </button>

            <button
              onClick={() => onChangeRoutingMode('congestion-aware')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                routingMode === 'congestion-aware'
                  ? 'bg-[#D8F3E5] text-[#065F46] border-[#6EE7B7] shadow-xs'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              <span>Congestion-Aware</span>
              <span className="text-[10px] font-normal text-[#3D8B68]">Dynamic Load & Loss Cost</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Parameter Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Packet Generation Rate */}
        <div className="p-3 bg-white rounded-xl border border-[#ECEFF5]">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#2D3142]">Traffic Density</label>
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
          <span className="text-[10px] text-[#7A8398] block mt-1">Simulated vehicle generation frequency</span>
        </div>

        {/* Link Bandwidth Multiplier */}
        <div className="p-3 bg-white rounded-xl border border-[#ECEFF5]">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#2D3142]">Road Capacity</label>
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
          <span className="text-[10px] text-[#7A8398] block mt-1">Network link bandwidth capacity</span>
        </div>

        {/* Artificial Congestion */}
        <div className="p-3 bg-white rounded-xl border border-[#ECEFF5]">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#2D3142]">Cross-Traffic</label>
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
          <span className="text-[10px] text-[#7A8398] block mt-1">Background road traffic congestion</span>
        </div>

        {/* Artificial Packet Loss */}
        <div className="p-3 bg-white rounded-xl border border-[#ECEFF5]">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#2D3142]">Road Hazard / Loss</label>
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
          <span className="text-[10px] text-[#7A8398] block mt-1">Artificial packet loss probability</span>
        </div>
      </div>

      {/* Network Incident Injection Buttons */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-[#2D3142] uppercase tracking-wide">
            Network Incident Injection
          </span>
          <span className="text-xs text-[#7A8398]">Test Dynamic Resilience</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* Burst Traffic */}
          <button
            onClick={() => onBurstTraffic(5)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#DCEBFA] hover:bg-[#C5DFF8] text-[#1E40AF] border border-[#BFDBFE] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Burst 5 Pkts</span>
          </button>

          {/* Trigger Congestion Spike */}
          <button
            onClick={onTriggerCongestionSpike}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border border-[#FCD34D] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Spike Congestion</span>
          </button>

          {/* Fail Core Router */}
          <button
            onClick={onFailCoreRouter}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#FDE4EA] hover:bg-[#FBCFE8] text-[#9F1239] border border-[#F472B6] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <XOctagon className="w-3.5 h-3.5" />
            <span>Crash R3 Hub</span>
          </button>

          {/* Fail Core Link */}
          <button
            onClick={onFailCoreLink}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#FFE7D9] hover:bg-[#FED7AA] text-[#9A3412] border border-[#FB923C] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <XOctagon className="w-3.5 h-3.5" />
            <span>Sever Main Rd</span>
          </button>

          {/* Restore Network */}
          <button
            onClick={onRestoreAll}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#D8F3E5] hover:bg-[#A7F3D0] text-[#065F46] border border-[#6EE7B7] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Restore All</span>
          </button>

          {/* Reset Metrics */}
          <button
            onClick={onReset}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-[#475569] border border-[#E2E8F0] transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Stats</span>
          </button>
        </div>
      </div>
    </div>
  );
};
