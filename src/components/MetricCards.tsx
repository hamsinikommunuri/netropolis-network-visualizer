'use client';

import React from 'react';
import { SimulationStats } from '@/types/network';
import {
  Send,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Gauge,
  GitFork,
  ArrowUpRight,
  TrendingDown,
  Layers,
} from 'lucide-react';

interface MetricCardsProps {
  stats: SimulationStats;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Packets Generated */}
      <div className="pastel-card p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-[#7A8398] mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold">Generated</span>
          <div className="w-6 h-6 rounded-md bg-[#DCEBFA] text-[#2563EB] flex items-center justify-center">
            <Send className="w-3 h-3" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[#2D3142]">{stats.generated}</div>
          <span className="text-[10px] text-[#5C6479]">Vehicles dispatched</span>
        </div>
      </div>

      {/* 2. Packets Delivered & Delivery % */}
      <div className="pastel-card p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-[#7A8398] mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold">Delivered</span>
          <div className="w-6 h-6 rounded-md bg-[#D8F3E5] text-[#059669] flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#2D3142]">{stats.delivered}</span>
            <span className="text-xs font-bold text-[#059669]">({stats.deliveryPercentage}%)</span>
          </div>
          <span className="text-[10px] text-[#5C6479]">Arrived at destination</span>
        </div>
      </div>

      {/* 3. Packets Dropped / Lost */}
      <div className="pastel-card p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-[#7A8398] mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold">Dropped</span>
          <div className="w-6 h-6 rounded-md bg-[#FDE4EA] text-[#E11D48] flex items-center justify-center">
            <AlertOctagon className="w-3 h-3" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#2D3142]">{stats.lost}</span>
            <span className="text-xs font-bold text-[#E11D48]">
              ({stats.generated > 0 ? Math.round((stats.lost / stats.generated) * 100) : 0}%)
            </span>
          </div>
          <span className="text-[10px] text-[#5C6479]">Traffic loss/congestion</span>
        </div>
      </div>

      {/* 4. Average Delay (Latency) */}
      <div className="pastel-card p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-[#7A8398] mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold">Avg Latency</span>
          <div className="w-6 h-6 rounded-md bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
            <Clock className="w-3 h-3" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#2D3142]">{stats.avgDelayMs}</span>
            <span className="text-xs text-[#7A8398] font-bold">ms</span>
          </div>
          <span className="text-[10px] text-[#5C6479]">Travel/transit time</span>
        </div>
      </div>

      {/* 5. Throughput */}
      <div className="pastel-card p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-[#7A8398] mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold">Throughput</span>
          <div className="w-6 h-6 rounded-md bg-[#E8E4F3] text-[#7C3AED] flex items-center justify-center">
            <Gauge className="w-3 h-3" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#2D3142]">{stats.throughputKbps}</span>
            <span className="text-xs text-[#7A8398] font-bold">KB/s</span>
          </div>
          <span className="text-[10px] text-[#5C6479]">Network goodput flow</span>
        </div>
      </div>

      {/* 6. Active Route Changes */}
      <div className="pastel-card p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-[#7A8398] mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold">Reroutes</span>
          <div className="w-6 h-6 rounded-md bg-[#FFE7D9] text-[#EA580C] flex items-center justify-center">
            <GitFork className="w-3 h-3" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[#2D3142]">{stats.activeRouteChanges}</div>
          <span className="text-[10px] text-[#5C6479]">Dynamic path pivots</span>
        </div>
      </div>
    </div>
  );
};
