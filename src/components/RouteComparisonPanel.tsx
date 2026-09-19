'use client';

import React, { useState } from 'react';
import { RouterNode, NetworkLink, RoutingMode } from '@/types/network';
import { findRouteDijkstra, evaluateRouteDetails, RouteCostBreakdown } from '@/lib/routing';
import { Navigation, Check, ChevronDown, ChevronUp, AlertCircle, Info } from 'lucide-react';

interface RouteComparisonPanelProps {
  nodes: RouterNode[];
  links: NetworkLink[];
  routingMode: RoutingMode;
  sourceNodeId: string;
  targetNodeId: string;
}

export const RouteComparisonPanel: React.FC<RouteComparisonPanelProps> = ({
  nodes,
  links,
  routingMode,
  sourceNodeId,
  targetNodeId,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  // Candidate Route 1: Shortest Path (Static Latency Dijkstra)
  const shortestResult = findRouteDijkstra(nodes, links, sourceNodeId, targetNodeId, 'shortest-path');
  const shortestBreakdown = shortestResult
    ? evaluateRouteDetails(shortestResult.path, nodes, links)
    : null;

  // Candidate Route 2: Congestion-Aware (Dynamic Cost Dijkstra)
  const dynamicResult = findRouteDijkstra(nodes, links, sourceNodeId, targetNodeId, 'congestion-aware');
  const dynamicBreakdown = dynamicResult
    ? evaluateRouteDetails(dynamicResult.path, nodes, links)
    : null;

  // Selected route based on current active routing mode
  const isDynamicActive = routingMode === 'congestion-aware';
  const activeRoute = isDynamicActive ? dynamicBreakdown : shortestBreakdown;

  return (
    <div className="pastel-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8E4F3] text-[#7F77A8] flex items-center justify-center">
            <Navigation className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#2D3142] uppercase tracking-wide">
              GPS Navigation & Route Selection
            </h3>
            <p className="text-[11px] text-[#7A8398]">
              {sourceNodeId} → {targetNodeId} Active Corridor
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-[#4A7FB8] hover:text-[#1E40AF] font-semibold"
        >
          <span>{expanded ? 'Hide Math' : 'Why this route?'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Primary Route Summary Pill */}
      {activeRoute && activeRoute.viable ? (
        <div className="mt-3 p-2.5 bg-[#F9FBFC] rounded-xl border border-[#E9EDF5] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#D8F3E5] text-[#2D6A4F] border border-[#B7E4C7]">
              Active Route
            </span>
            <span className="text-xs font-bold text-[#2D3142]">
              {activeRoute.path.join(' → ')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#5C6479]">
            <span>{activeRoute.hops} Hops</span>
            <span>•</span>
            <span>Base: {activeRoute.baseCost} ms</span>
            <span>•</span>
            <span className="font-bold text-[#2D3142]">
              Total Cost: {activeRoute.totalCost}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-3 p-2.5 bg-[#FDE4EA] text-[#9F1239] rounded-xl border border-[#FDA4AF] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>No viable route available between selected nodes! Check failed intersections/roads.</span>
        </div>
      )}

      {/* Expandable Detailed Breakdown Comparing Route A vs Route B */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#ECEFF5] space-y-3">
          <div className="text-[11px] text-[#7A8398] italic">
            Dynamic Route Cost = Base Link Latency + Congestion Penalty (Load^2.5) + Packet Loss Penalty
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Route A: Static Shortest Path */}
            <div className={`p-3 rounded-xl border transition-all ${
              !isDynamicActive
                ? 'bg-[#EBF5FF] border-[#93C5FD] ring-1 ring-[#3B82F6]'
                : 'bg-white border-[#E2E8F0]'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#2D3142]">Route A: Shortest Physical Path</span>
                {!isDynamicActive && (
                  <span className="text-[10px] font-bold text-[#2563EB] bg-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Check className="w-3 h-3" /> SELECTED
                  </span>
                )}
              </div>

              {shortestBreakdown && shortestBreakdown.viable ? (
                <div className="space-y-1 text-xs">
                  <div className="font-mono text-[#334155] text-[11px] truncate">
                    {shortestBreakdown.path.join(' → ')}
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 text-[11px] text-[#64748B] pt-1">
                    <div>Base Latency: <span className="font-bold text-[#2D3142]">{shortestBreakdown.baseCost} ms</span></div>
                    <div>Congestion Penalty: <span className="font-bold text-[#EA580C]">+{shortestBreakdown.congestionPenalty}</span></div>
                    <div>Loss Penalty: <span className="font-bold text-[#E11D48]">+{shortestBreakdown.lossPenalty}</span></div>
                    <div>Total Cost: <span className="font-bold text-[#2D3142]">{shortestBreakdown.totalCost}</span></div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#EF4444] italic">Route broken by offline road/node</div>
              )}
            </div>

            {/* Route B: Congestion-Aware Adaptive Route */}
            <div className={`p-3 rounded-xl border transition-all ${
              isDynamicActive
                ? 'bg-[#E8F8F0] border-[#6EE7B7] ring-1 ring-[#10B981]'
                : 'bg-white border-[#E2E8F0]'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#2D3142]">Route B: Congestion-Aware Route</span>
                {isDynamicActive && (
                  <span className="text-[10px] font-bold text-[#059669] bg-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Check className="w-3 h-3" /> SELECTED
                  </span>
                )}
              </div>

              {dynamicBreakdown && dynamicBreakdown.viable ? (
                <div className="space-y-1 text-xs">
                  <div className="font-mono text-[#334155] text-[11px] truncate">
                    {dynamicBreakdown.path.join(' → ')}
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 text-[11px] text-[#64748B] pt-1">
                    <div>Base Latency: <span className="font-bold text-[#2D3142]">{dynamicBreakdown.baseCost} ms</span></div>
                    <div>Congestion Penalty: <span className="font-bold text-[#EA580C]">+{dynamicBreakdown.congestionPenalty}</span></div>
                    <div>Loss Penalty: <span className="font-bold text-[#E11D48]">+{dynamicBreakdown.lossPenalty}</span></div>
                    <div>Total Cost: <span className="font-bold text-[#2D3142]">{dynamicBreakdown.totalCost}</span></div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#EF4444] italic">Route broken by offline road/node</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
