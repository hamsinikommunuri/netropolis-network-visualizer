'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, Activity, HeartPulse } from 'lucide-react';

interface HealthScoreProps {
  score: number;
  stats: {
    deliveryPercentage: number;
    avgDelayMs: number;
    failedRoutersCount: number;
    failedLinksCount: number;
    currentCongestionScore: number;
  };
}

export const HealthScore: React.FC<HealthScoreProps> = ({ score, stats }) => {
  const getStatus = (val: number) => {
    if (val >= 88) return { label: 'EXCELLENT', color: '#10B981', bg: 'bg-[#D8F3E5]', text: 'text-[#065F46]' };
    if (val >= 70) return { label: 'STABLE', color: '#3B82F6', bg: 'bg-[#DCEBFA]', text: 'text-[#1E40AF]' };
    if (val >= 50) return { label: 'BUSY', color: '#F59E0B', bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' };
    if (val >= 30) return { label: 'DEGRADED', color: '#F97316', bg: 'bg-[#FFE7D9]', text: 'text-[#9A3412]' };
    return { label: 'CRITICAL', color: '#EF4444', bg: 'bg-[#FDE4EA]', text: 'text-[#9F1239]' };
  };

  const status = getStatus(score);
  const strokeDash = (score / 100) * 283; // 2 * pi * 45 ≈ 283

  return (
    <div className="pastel-card p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-[#ECEFF5] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#DCEBFA] text-[#2563EB] flex items-center justify-center">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2D3142]">Network Health</h3>
            <p className="text-[11px] text-[#7A8398]">Overall Grid Integrity</p>
          </div>
        </div>

        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Circular Meter */}
      <div className="flex items-center justify-center py-4">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#F1F5F9"
              strokeWidth="7"
              fill="none"
            />
            {/* Animated Gauge */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke={status.color}
              strokeWidth="7"
              strokeDasharray="276"
              strokeDashoffset={276 - (score / 100) * 276}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          {/* Inner Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-[#2D3142]">{score}</span>
            <span className="text-[10px] text-[#7A8398] uppercase tracking-wider font-semibold">/ 100 Index</span>
          </div>
        </div>
      </div>

      {/* Sub-Metric Indicators */}
      <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#ECEFF5] pt-3">
        <div className="bg-[#F8FAFC] p-2 rounded-lg">
          <span className="text-[10px] text-[#7A8398] block">Delivery Rate</span>
          <span className="font-bold text-[#2D3142]">{stats.deliveryPercentage}%</span>
        </div>
        <div className="bg-[#F8FAFC] p-2 rounded-lg">
          <span className="text-[10px] text-[#7A8398] block">Avg Latency</span>
          <span className="font-bold text-[#2D3142]">{stats.avgDelayMs} ms</span>
        </div>
        <div className="bg-[#F8FAFC] p-2 rounded-lg">
          <span className="text-[10px] text-[#7A8398] block">Failed Nodes</span>
          <span className={`font-bold ${stats.failedRoutersCount > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
            {stats.failedRoutersCount} offline
          </span>
        </div>
        <div className="bg-[#F8FAFC] p-2 rounded-lg">
          <span className="text-[10px] text-[#7A8398] block">Congestion</span>
          <span className="font-bold text-[#2D3142]">{stats.currentCongestionScore}%</span>
        </div>
      </div>
    </div>
  );
};
