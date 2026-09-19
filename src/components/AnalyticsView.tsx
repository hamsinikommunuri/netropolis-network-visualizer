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
import { BarChart3, TrendingUp, Zap, Clock, ShieldAlert, Activity } from 'lucide-react';

interface HistoryPoint {
  timestamp: string;
  throughput: number;
  avgDelay: number;
  lossRate: number;
  congestion: number;
  health: number;
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

      {/* Primary Graphs Row: Throughput vs Time and Delay vs Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Throughput vs Time */}
        <div className="pastel-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
              <span>Throughput vs Time (KB/s)</span>
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

        {/* Delay / Latency vs Time */}
        <div className="pastel-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#EA580C]" />
              <span>End-to-End Delay vs Time (ms)</span>
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

      {/* Secondary Graphs Row: Packet Loss Rate & Link Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Packet Loss & Congestion */}
        <div className="pastel-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
              <span>Packet Loss & Congestion Index (%)</span>
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
                <Line
                  type="monotone"
                  dataKey="congestion"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                  name="Congestion Index (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Link Road Utilization */}
        <div className="pastel-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#10B981]" />
              <span>Link Utilization Capacity (%)</span>
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

      {/* Protocol Shootout Row */}
      <div className="pastel-card p-5 space-y-4">
        <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-1.5">
          <span>Protocol Comparison: TCP (Reliable) vs UDP (Best Effort)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocolData.map((p, idx) => (
            <div key={idx} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#2D3142]">{p.protocol}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0]">
                  {p.Rate}% Delivery
                </span>
              </div>
              <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className={`h-full ${idx === 0 ? 'bg-[#3B82F6]' : 'bg-[#EC4899]'}`}
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
  );
};
