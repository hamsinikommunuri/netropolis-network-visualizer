'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { NetworkLink, SimulationStats } from '@/types/network';
import { BarChart3, TrendingUp, Zap, Clock, ShieldAlert, Activity, Navigation, HeartPulse, Flame } from 'lucide-react';

export interface HistoryPoint {
  timestamp: string;
  throughput: number;
  avgDelay: number;
  lossRate: number;
  congestion: number;
  health: number;
  routingCost: number;
  tcpCount: number;
  udpCount: number;
}

interface AnalyticsViewProps {
  history: HistoryPoint[];
  links: NetworkLink[];
  stats: SimulationStats;
  tcpTotal: number;
  udpTotal: number;
  tcpDelivered: number;
  udpDelivered: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  history,
  links,
  stats,
  tcpTotal,
  udpTotal,
  tcpDelivered,
  udpDelivered,
}) => {
  // Format link data for BarChart
  const linkData = links.map((l) => ({
    name: `${l.source}-${l.target}`,
    load: l.currentLoad,
    failed: l.failed ? 100 : 0,
    status: l.status,
  }));

  const protocolData = [
    {
      protocol: 'TCP (Reliable)',
      Generated: tcpTotal,
      Delivered: tcpDelivered,
      Rate: tcpTotal > 0 ? Math.round((tcpDelivered / tcpTotal) * 100) : 0,
    },
    {
      protocol: 'UDP (Best Effort)',
      Generated: udpTotal,
      Delivered: udpDelivered,
      Rate: udpTotal > 0 ? Math.round((udpDelivered / udpTotal) * 100) : 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pastel-card p-5">
        <div className="flex items-center gap-2 pb-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8E4F3] text-[#7F77A8] flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#2D3142]">Real-Time Telemetry & Network Analytics</h2>
            <p className="text-xs text-[#7A8398]">Dynamic Queuing Performance, Throughput, and Delay Metrics</p>
          </div>
        </div>
      </div>

      {/* Primary Graphs Row: 1. Throughput vs Time & 2. Delay vs Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Throughput vs Time */}
        <div className="pastel-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
              <span>1. Throughput vs Time (KB/s)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-[#3B82F6]">
              Current: {stats.throughputKbps} KB/s
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#DBEAFE" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="throughput"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#throughputGrad)"
                  name="Throughput (KB/s)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Delay / Latency vs Time */}
        <div className="pastel-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#EA580C]" />
              <span>2. End-to-End Delay vs Time (ms)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-[#EA580C]">
              Current: {stats.avgDelayMs} ms
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgDelay"
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={false}
                  name="Transit Delay (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Graphs Row: 3. Packet Loss & 4. Link Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Packet Loss vs Time */}
        <div className="pastel-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
              <span>3. Packet Loss Rate vs Time (%)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-[#EF4444]">
              Loss: {stats.generated > 0 ? Math.round((stats.lost / stats.generated) * 100) : 0}%
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FCA5A5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FEE2E2" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="lossRate"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#lossGrad)"
                  name="Loss Rate (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Link Road Utilization */}
        <div className="pastel-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#10B981]" />
              <span>4. Link Utilization Capacity (%)</span>
            </h3>
            <span className="text-xs text-[#7A8398]">Roadway load distribution</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={linkData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={9}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="load" fill="#34D399" radius={[4, 4, 0, 0]} name="Utilization (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tertiary Graphs Row: 5. Routing Cost vs Time & 6. Network Health vs Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5. Routing Cost vs Time (REQUIRED BY SPEC) */}
        <div className="pastel-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-[#7C3AED]" />
              <span>5. Dynamic Routing Cost vs Time</span>
            </h3>
            <span className="text-xs font-mono font-bold text-[#7C3AED]">
              Cost: {history.length > 0 ? history[history.length - 1].routingCost : 22}
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="routingCost"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                  name="Path Cost (Latency + Penalties)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Network Health Score vs Time (REQUIRED BY SPEC) */}
        <div className="pastel-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-[#10B981]" />
              <span>6. Network Health Index vs Time</span>
            </h3>
            <span className="text-xs font-mono font-bold text-[#10B981]">
              Score: {history.length > 0 ? history[history.length - 1].health : 100} / 100
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A7F3D0" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#D1FAE5" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="health"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#healthGrad)"
                  name="Health Score (/100)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quaternary Graphs Row: 7. Congestion Over Time & 8. TCP vs UDP Delivery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7. Congestion Over Time (REQUIRED BY SPEC) */}
        <div className="pastel-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#F59E0B]" />
              <span>7. Congestion Index Over Time (%)</span>
            </h3>
            <span className="text-xs font-mono font-bold text-[#F59E0B]">
              Avg Load: {stats.currentCongestionScore}%
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="congGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FDE68A" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FEF3C7" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="timestamp" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="congestion"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#congGrad)"
                  name="Congestion Index (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8. Protocol Shootout: TCP vs UDP Delivery */}
        <div className="pastel-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#2563EB]" />
            <span>8. Protocol Comparison: TCP vs UDP Delivery</span>
          </h3>

          <div className="space-y-4 pt-1">
            {protocolData.map((p, idx) => (
              <div key={idx} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#2D3142]">{p.protocol}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0]">
                    {p.Rate}% Delivery
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${idx === 0 ? 'bg-[#3B82F6]' : 'bg-[#EC4899]'}`}
                    style={{ width: `${p.Rate}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#64748B]">
                  <span>Dispatched: {p.Generated} packets</span>
                  <span>Delivered: {p.Delivered} packets</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

