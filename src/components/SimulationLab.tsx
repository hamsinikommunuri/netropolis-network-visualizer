'use client';

import React, { useState } from 'react';
import { ScenarioPreset, SimulationStats } from '@/types/network';
import {
  FlaskConical,
  Play,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'normal',
    name: 'Scenario 1: Normal Network Baseline',
    subtitle: 'Free-flowing suburban traffic & high throughput',
    description: 'All 7 routers and 18 links operate normally under moderate traffic load. Demonstrates baseline latency and reliable packet delivery.',
    protocol: 'TCP',
    routingMode: 'shortest-path',
    packetRate: 3,
    lossRate: 0.0,
    congestion: 1.0,
    failedNodes: [],
    failedLinks: [],
    recommendedFocus: 'Observe steady vehicle transit and 100% ACK delivery with low queuing delay.',
  },
  {
    id: 'heavy-traffic',
    name: 'Scenario 2: Heavy Rush-Hour Congestion',
    subtitle: 'Traffic jams at core intersections',
    description: 'High packet generation rate overwhelms the Grand Metro Highway and central intersections, simulating rush-hour queue build-up.',
    protocol: 'TCP',
    routingMode: 'shortest-path',
    packetRate: 12,
    lossRate: 0.1,
    congestion: 2.5,
    failedNodes: [],
    failedLinks: [],
    recommendedFocus: 'Observe queue bars filling up at R3 and latency escalating due to M/M/1 queuing delay.',
  },
  {
    id: 'router-failure',
    name: 'Scenario 3: Core Router Failure (R3 Crash)',
    subtitle: 'Closed intersection & immediate detour recalculation',
    description: 'Central hub R3 is abruptly taken offline. All packets queued at R3 are dropped, and network protocols dynamically compute detours via R2 or R4.',
    protocol: 'TCP',
    routingMode: 'congestion-aware',
    packetRate: 4,
    lossRate: 0.0,
    congestion: 1.0,
    failedNodes: ['R3'],
    failedLinks: [],
    recommendedFocus: 'Watch vehicles reroute around the closed R3 roundabout toward Highland Expressway (R2).',
  },
  {
    id: 'link-failure',
    name: 'Scenario 4: Arterial Link Failure (R1 ↔ R3 Road Closed)',
    subtitle: 'Severed highway link & topology convergence',
    description: 'The primary backbone highway between R1 and R3 is closed for maintenance. Packets dynamically divert through northern and southern arterials.',
    protocol: 'TCP',
    routingMode: 'congestion-aware',
    packetRate: 4,
    lossRate: 0.0,
    congestion: 1.2,
    failedNodes: [],
    failedLinks: ['R1_R3'],
    recommendedFocus: 'Inspect route recalculation metrics in the Route Comparison panel.',
  },
  {
    id: 'high-loss',
    name: 'Scenario 5: High Packet Loss (Lossy Wireless Subnet)',
    subtitle: '30% packet drop rate & TCP retransmission storm',
    description: 'Severe packet drop simulates noisy transmission channels. TCP detects loss via missing ACKs / timeouts and resends vehicles.',
    protocol: 'TCP',
    routingMode: 'congestion-aware',
    packetRate: 4,
    lossRate: 0.35,
    congestion: 1.5,
    failedNodes: [],
    failedLinks: [],
    recommendedFocus: 'Count retransmitted vehicles (spinning retry badges) and notice degraded goodput.',
  },
  {
    id: 'tcp-vs-udp',
    name: 'Scenario 6: TCP vs UDP Protocol Shootout',
    subtitle: 'Reliable delivery vs low-overhead speed',
    description: 'Contrasts UDP streaming against TCP reliable transmission under identical loss conditions.',
    protocol: 'UDP',
    routingMode: 'shortest-path',
    packetRate: 6,
    lossRate: 0.25,
    congestion: 1.2,
    failedNodes: [],
    failedLinks: [],
    recommendedFocus: 'Switch between TCP and UDP to witness dropped UDP packets vanishing without retransmission.',
  },
  {
    id: 'congestion-routing',
    name: 'Scenario 7: Congestion-Aware Routing in Action',
    subtitle: 'Smart navigation avoids traffic jams',
    description: 'Creates heavy congestion on the central shortest path while keeping bypass roads clear. Congestion-aware routing proactively takes the scenic detour.',
    protocol: 'TCP',
    routingMode: 'congestion-aware',
    packetRate: 8,
    lossRate: 0.05,
    congestion: 2.2,
    failedNodes: [],
    failedLinks: [],
    recommendedFocus: 'Observe how the algorithm prefers the longer 4-hop northern bypass over the jammed 3-hop central road.',
  },
];

interface SimulationLabProps {
  onApplyScenario: (preset: ScenarioPreset) => void;
  currentStats: SimulationStats;
  onNavigateToCity: () => void;
}

export const SimulationLab: React.FC<SimulationLabProps> = ({
  onApplyScenario,
  currentStats,
  onNavigateToCity,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioPreset>(PRESET_SCENARIOS[0]);
  const [baselineSnapshot, setBaselineSnapshot] = useState<SimulationStats | null>(null);

  const handleRun = (scenario: ScenarioPreset) => {
    setSelectedScenario(scenario);
    setBaselineSnapshot({ ...currentStats });
    onApplyScenario(scenario);
  };

  return (
    <div className="space-y-6">
      <div className="pastel-card p-6">
        <div className="flex items-center gap-2 pb-2">
          <div className="w-8 h-8 rounded-lg bg-[#DCEBFA] text-[#2563EB] flex items-center justify-center">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2D3142]">Simulation Lab: Academic Case Studies</h2>
            <p className="text-xs text-[#7A8398]">
              Reproducible Networking Experiments with Controlled Topologies & Before/After Metrics
            </p>
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRESET_SCENARIOS.map((scenario) => {
          const isCurrent = selectedScenario.id === scenario.id;
          return (
            <div
              key={scenario.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-[#F4F9FF] border-[#93C5FD] shadow-sm ring-1 ring-[#3B82F6]'
                  : 'bg-white border-[#ECEFF5] hover:shadow-sm'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E8E4F3] text-[#7F77A8]">
                    {scenario.protocol} • {scenario.routingMode === 'congestion-aware' ? 'Adaptive' : 'Shortest'}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-[#2563EB] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-[#2D3142]">{scenario.name}</h3>
                <p className="text-xs text-[#4A7FB8] font-medium">{scenario.subtitle}</p>
                <p className="text-xs text-[#64748B] leading-relaxed">{scenario.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAEFF5] space-y-3">
                <div className="bg-[#F8FAFC] p-2.5 rounded-xl text-[11px] text-[#475569]">
                  <strong className="text-[#2D3142] block mb-0.5">Laboratory Focus:</strong>
                  {scenario.recommendedFocus}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRun(scenario)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#3B82F6] hover:bg-[#2563EB] text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Scenario</span>
                  </button>

                  {isCurrent && (
                    <button
                      onClick={onNavigateToCity}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#DCEBFA] hover:bg-[#BFDBFE] text-[#1E40AF] transition-colors flex items-center gap-1"
                    >
                      <span>View Map</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Before / After Experiment Evaluation Panel */}
      {baselineSnapshot && (
        <div className="pastel-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECEFF5]">
            <h3 className="font-bold text-sm text-[#2D3142]">
              Experimental Metric Delta: {selectedScenario.name}
            </h3>
            <span className="text-xs text-[#7A8398]">Comparing Against Pre-Experiment Baseline</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-[#7A8398] block">Packet Delivery Rate</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-bold text-[#2D3142]">{currentStats.deliveryPercentage}%</span>
                <span className="text-[11px] text-[#64748B] line-through">
                  ({baselineSnapshot.deliveryPercentage}%)
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-[#7A8398] block">Average Delay</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-bold text-[#2D3142]">{currentStats.avgDelayMs} ms</span>
                <span className="text-[11px] text-[#64748B]">
                  vs {baselineSnapshot.avgDelayMs} ms
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-[#7A8398] block">Network Throughput</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-bold text-[#2D3142]">{currentStats.throughputKbps} KB/s</span>
                <span className="text-[11px] text-[#64748B]">
                  vs {baselineSnapshot.throughputKbps} KB/s
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] text-[#7A8398] block">Dynamic Reroutes</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-bold text-[#2D3142]">{currentStats.activeRouteChanges}</span>
                <span className="text-[11px] text-[#64748B]">
                  (+{Math.max(0, currentStats.activeRouteChanges - baselineSnapshot.activeRouteChanges)})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
