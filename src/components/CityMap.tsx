'use client';

import React, { useState } from 'react';
import { RouterNode, NetworkLink, SimulationPacket, ProtocolType } from '@/types/network';
import { AlertTriangle, CheckCircle2, XCircle, ShieldAlert, Sparkles, Navigation, Info } from 'lucide-react';

interface CityMapProps {
  nodes: RouterNode[];
  links: NetworkLink[];
  packets: SimulationPacket[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  selectedLinkId: string | null;
  onSelectLink: (linkId: string | null) => void;
  onToggleNodeFail: (nodeId: string) => void;
  onToggleLinkFail: (linkId: string) => void;
  activePath: string[] | null;
  protocol: ProtocolType;
}

export const CityMap: React.FC<CityMapProps> = ({
  nodes,
  links,
  packets,
  selectedNodeId,
  onSelectNode,
  selectedLinkId,
  onSelectLink,
  onToggleNodeFail,
  onToggleLinkFail,
  activePath,
  protocol,
}) => {
  const [hoveredNode, setHoveredNode] = useState<RouterNode | null>(null);
  const [hoveredLink, setHoveredLink] = useState<NetworkLink | null>(null);

  const nodeMap = new Map<string, RouterNode>(nodes.map((n) => [n.id, n]));

  // Helper to get link status styling
  const getLinkColors = (link: NetworkLink) => {
    if (link.failed) {
      return {
        roadBase: '#E2E8F0',
        stroke: '#94A3B8',
        lineDash: '4 4',
        width: 14,
        labelBg: '#F1F5F9',
        labelText: '#64748B',
      };
    }
    const load = link.currentLoad;
    if (load >= 90) {
      return {
        roadBase: '#FDE4EA',
        stroke: '#E11D48',
        lineDash: '6 4',
        width: 20,
        labelBg: '#FFE4E6',
        labelText: '#9F1239',
      };
    }
    if (load >= 70) {
      return {
        roadBase: '#FFE7D9',
        stroke: '#EA580C',
        lineDash: '8 6',
        width: 18,
        labelBg: '#FFEDD5',
        labelText: '#9A3412',
      };
    }
    if (load >= 40) {
      return {
        roadBase: '#FEF3C7',
        stroke: '#D97706',
        lineDash: '10 8',
        width: 16,
        labelBg: '#FEF9C3',
        labelText: '#854D0E',
      };
    }
    // 0 - 39% Normal
    return {
      roadBase: '#EBF4EC',
      stroke: '#34A853',
      lineDash: '12 10',
      width: 14,
      labelBg: '#E6F4EA',
      labelText: '#1E7E34',
    };
  };

  // Helper to interpolate position of a packet along its current link
  const getPacketCoord = (packet: SimulationPacket) => {
    const { path, currentPathIndex, progress } = packet;
    if (!path || currentPathIndex >= path.length - 1) {
      const lastNode = nodeMap.get(path[path.length - 1]);
      return lastNode ? { x: lastNode.x, y: lastNode.y, angle: 0 } : { x: 0, y: 0, angle: 0 };
    }

    const u = nodeMap.get(path[currentPathIndex]);
    const v = nodeMap.get(path[currentPathIndex + 1]);

    if (!u || !v) return { x: 0, y: 0, angle: 0 };

    const x = u.x + (v.x - u.x) * progress;
    const y = u.y + (v.y - u.y) * progress;
    const angle = (Math.atan2(v.y - u.y, v.x - u.x) * 180) / Math.PI;

    return { x, y, angle };
  };

  // Check if a link is part of the currently active shortest or chosen path
  const isLinkActiveInRoute = (link: NetworkLink) => {
    if (!activePath || activePath.length < 2) return false;
    for (let i = 0; i < activePath.length - 1; i++) {
      const u = activePath[i];
      const v = activePath[i + 1];
      if ((link.source === u && link.target === v) || (link.source === v && link.target === u)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="relative w-full bg-[#FDFCF9] rounded-2xl border border-[#E5E9F0] shadow-soft overflow-hidden">
      {/* Legend & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-[#ECEFF5] bg-white/70 backdrop-blur-sm gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#2D3142]">City View Map</span>
          <span className="text-xs text-[#7A8398] hidden sm:inline">
            (Interactive Smart City Network: Click any intersection or road to inspect/fail)
          </span>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#4A5568]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-xs bg-[#34A853]"></span>
            <span>Normal (0–39%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-xs bg-[#D97706]"></span>
            <span>Busy (40–69%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-xs bg-[#EA580C]"></span>
            <span>Heavy (70–89%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-xs bg-[#E11D48]"></span>
            <span>Congested (90–100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-xs bg-[#94A3B8]"></span>
            <span>Closed Road</span>
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Canvas */}
      <div className="relative w-full overflow-x-auto min-h-[560px] flex items-center justify-center p-2 sm:p-4 select-none">
        <svg
          viewBox="0 0 1180 600"
          className="w-full max-w-[1180px] h-auto transition-all"
          style={{ minWidth: '920px' }}
        >
          <defs>
            {/* Grid Pattern for City Blocks */}
            <pattern id="city-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="none" stroke="#F1F4F8" strokeWidth="1" />
              <circle cx="30" cy="30" r="1" fill="#E2E8F0" />
            </pattern>

            {/* Road Shading Filter */}
            <filter id="soft-road-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#8B96A5" floodOpacity="0.12" />
            </filter>

            {/* Glowing active route marker */}
            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background City Ground & Blocks */}
          <rect width="100%" height="100%" fill="#FDFCF9" />
          <rect width="100%" height="100%" fill="url(#city-grid)" opacity="0.85" />

          {/* Decorative City River / Canal */}
          <path
            d="M 570 0 C 590 150, 550 300, 580 450 C 600 520, 570 600, 580 600"
            fill="none"
            stroke="#E3F0FC"
            strokeWidth="38"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 570 0 C 590 150, 550 300, 580 450 C 600 520, 570 600, 580 600"
            fill="none"
            stroke="#CDE3F8"
            strokeWidth="3"
            strokeDasharray="12 12"
            opacity="0.8"
          />
          <text x="590" y="50" fill="#90B6DC" fontSize="10" fontStyle="italic" letterSpacing="2">
            METRO RIVER
          </text>

          {/* Decorative City Park Zones */}
          <rect x="330" y="40" width="80" height="90" rx="16" fill="#EDF7F0" opacity="0.6" />
          <text x="370" y="90" fill="#8BBFA0" fontSize="12" textAnchor="middle">🌲 🌳</text>
          <text x="370" y="105" fill="#729E85" fontSize="8" textAnchor="middle" fontStyle="italic">West Park</text>

          <rect x="740" y="460" width="90" height="80" rx="16" fill="#EDF7F0" opacity="0.6" />
          <text x="785" y="505" fill="#8BBFA0" fontSize="12" textAnchor="middle">🌳 🌲</text>
          <text x="785" y="520" fill="#729E85" fontSize="8" textAnchor="middle" fontStyle="italic">Green Meadows</text>

          {/* 1. Network Links / Roads Layer */}
          {links.map((link) => {
            const u = nodeMap.get(link.source);
            const v = nodeMap.get(link.target);
            if (!u || !v) return null;

            const colors = getLinkColors(link);
            const isSelected = selectedLinkId === link.id;
            const isActive = isLinkActiveInRoute(link);
            const midX = (u.x + v.x) / 2;
            const midY = (u.y + v.y) / 2;

            return (
              <g
                key={link.id}
                className="cursor-pointer transition-all group"
                onClick={() => onSelectLink(link.id)}
                onMouseEnter={() => setHoveredLink(link)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {/* Active Route Highlight underlay */}
                {isActive && (
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#60A5FA"
                    strokeWidth={colors.width + 10}
                    strokeLinecap="round"
                    opacity="0.3"
                    filter="url(#route-glow)"
                  />
                )}

                {/* Road Base Asphalt */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={colors.roadBase}
                  strokeWidth={colors.width}
                  strokeLinecap="round"
                  filter="url(#soft-road-shadow)"
                />

                {/* Road Curb / Border */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={isSelected ? '#3B82F6' : colors.stroke}
                  strokeWidth={isSelected ? 3 : 1.5}
                  strokeDasharray={link.failed ? '4 4' : 'none'}
                  strokeLinecap="round"
                  opacity={link.failed ? 0.9 : 0.6}
                />

                {/* Road Center Markings */}
                {!link.failed && (
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    strokeDasharray={colors.lineDash}
                    className={link.currentLoad >= 70 ? 'animate-road-congested' : 'animate-road-flow'}
                    opacity="0.9"
                  />
                )}

                {/* Road Closed Indicator */}
                {link.failed && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <circle cx="0" cy="0" r="10" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                    <text x="0" y="3.5" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                      ✕
                    </text>
                  </g>
                )}

                {/* Road Load Badge */}
                {!link.failed && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-20"
                      y="-9"
                      width="40"
                      height="18"
                      rx="6"
                      fill={colors.labelBg}
                      stroke={colors.stroke}
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x="0"
                      y="3.5"
                      fill={colors.labelText}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {link.currentLoad}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* 2. Moving Packets Layer (Vehicles) */}
          {packets.map((packet) => {
            const coord = getPacketCoord(packet);
            const isTcp = packet.protocol === 'TCP';

            if (packet.status === 'lost') {
              // Show cute lost vehicle with smoke/hazard
              return (
                <g key={packet.id} transform={`translate(${coord.x}, ${coord.y})`}>
                  <circle cx="0" cy="0" r="12" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" className="animate-ping" />
                  <circle cx="0" cy="0" r="8" fill="#EF4444" />
                  <text x="0" y="3" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                    !
                  </text>
                  <text x="0" y="-12" fill="#DC2626" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Lost ({packet.lossReason || 'Drop'})
                  </text>
                </g>
              );
            }

            if (packet.status === 'delivered') {
              // Subtle delivery sparkle
              return (
                <g key={packet.id} transform={`translate(${coord.x}, ${coord.y})`}>
                  <circle cx="0" cy="0" r="10" fill="#D1FAE5" stroke="#10B981" strokeWidth="1.5" />
                  <text x="0" y="3" fill="#047857" fontSize="8" textAnchor="middle">
                    ✓
                  </text>
                </g>
              );
            }

            // Normal In-Transit Vehicle
            return (
              <g
                key={packet.id}
                transform={`translate(${coord.x}, ${coord.y}) rotate(${coord.angle})`}
                className="car-bobbing"
              >
                {/* Vehicle Chassis */}
                {isTcp ? (
                  // TCP Vehicle: Cute Pastel Blue Mini Delivery Van
                  <g>
                    {/* Shadow */}
                    <rect x="-11" y="-6" width="22" height="12" rx="4" fill="#000000" opacity="0.12" />
                    {/* Body */}
                    <rect x="-10" y="-5.5" width="20" height="11" rx="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="0.8" />
                    {/* Windshield */}
                    <rect x="2" y="-4" width="5" height="8" rx="1.5" fill="#DBEAFE" />
                    {/* Roof Cargo Box (Packet Payload indicator) */}
                    <rect x="-8" y="-3.5" width="8" height="7" rx="1" fill="#93C5FD" />
                    {/* Wheels */}
                    <circle cx="-6" cy="-6" r="1.8" fill="#1E293B" />
                    <circle cx="5" cy="-6" r="1.8" fill="#1E293B" />
                    <circle cx="-6" cy="6" r="1.8" fill="#1E293B" />
                    <circle cx="5" cy="6" r="1.8" fill="#1E293B" />
                    {/* Headlights */}
                    <circle cx="10" cy="-2.5" r="1" fill="#FEF08A" />
                    <circle cx="10" cy="2.5" r="1" fill="#FEF08A" />
                  </g>
                ) : (
                  // UDP Vehicle: Cute Pastel Coral Sports Racer (Faster!)
                  <g>
                    <rect x="-10" y="-5" width="20" height="10" rx="4" fill="#000000" opacity="0.12" />
                    <path
                      d="M -9 -4.5 L 4 -4.5 L 10 -2 L 10 2 L 4 4.5 L -9 4.5 Z"
                      fill="#EC4899"
                      stroke="#BE185D"
                      strokeWidth="0.8"
                    />
                    <ellipse cx="2" cy="0" rx="3.5" ry="2.5" fill="#FCE7F3" />
                    {/* Spoiler */}
                    <rect x="-9.5" y="-5" width="2" height="10" rx="0.5" fill="#9D174D" />
                    {/* Wheels */}
                    <circle cx="-5" cy="-5" r="1.5" fill="#1E293B" />
                    <circle cx="6" cy="-5" r="1.5" fill="#1E293B" />
                    <circle cx="-5" cy="5" r="1.5" fill="#1E293B" />
                    <circle cx="6" cy="5" r="1.5" fill="#1E293B" />
                  </g>
                )}

                {/* Packet ID tooltip bubble when hovered */}
                <text
                  x="0"
                  y="-8"
                  fill="#1E293B"
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor="middle"
                  transform={`rotate(${-coord.angle})`}
                >
                  {isTcp ? 'TCP' : 'UDP'}
                </text>
              </g>
            );
          })}

          {/* 3. Network Nodes (Clients, Routers, Servers) */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isFailed = node.status === 'failed';
            const isCongested = node.status === 'congested';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => onSelectNode(node.id)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Selection Halo */}
                {isSelected && (
                  <circle
                    cx="0"
                    cy="0"
                    r="34"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className="animate-spin"
                    style={{ animationDuration: '8s' }}
                  />
                )}

                {/* CLIENT NODE (Cute Cottage / Laptop) */}
                {node.role === 'client' && (
                  <g>
                    {/* Shadow */}
                    <ellipse cx="0" cy="18" rx="24" ry="7" fill="#8B96A5" opacity="0.15" />
                    {/* House Base */}
                    <rect x="-18" y="-4" width="36" height="22" rx="4" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="2" />
                    {/* Roof */}
                    <polygon points="0,-20 -24,-2 24,-2" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5" />
                    {/* Chimney */}
                    <rect x="10" y="-18" width="5" height="8" fill="#C4B5FD" />
                    {/* Door */}
                    <rect x="-4" y="6" width="8" height="12" rx="1.5" fill="#3B82F6" />
                    {/* Window */}
                    <rect x="-12" y="2" width="6" height="6" rx="1" fill="#FEF08A" />
                    <rect x="6" y="2" width="6" height="6" rx="1" fill="#FEF08A" />
                    {/* Label */}
                    <text x="0" y="32" fill="#1E293B" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {node.label}
                    </text>
                    <text x="0" y="44" fill="#64748B" fontSize="8" textAnchor="middle">
                      {node.ip}
                    </text>
                  </g>
                )}

                {/* ROUTER NODE (Roundabout Intersection / Tower) */}
                {node.role === 'router' && (
                  <g>
                    {/* Intersection Roundabout Road Base */}
                    <circle
                      cx="0"
                      cy="0"
                      r="24"
                      fill={isFailed ? '#F1F5F9' : isCongested ? '#FEE2E2' : '#F8FAFC'}
                      stroke={isFailed ? '#94A3B8' : isCongested ? '#EF4444' : '#64748B'}
                      strokeWidth={isFailed ? 2 : 2.5}
                      filter="url(#soft-road-shadow)"
                    />

                    {/* Central Island / Signal Tower */}
                    <circle
                      cx="0"
                      cy="0"
                      r="15"
                      fill={isFailed ? '#E2E8F0' : '#FFFFFF'}
                      stroke={isFailed ? '#CBD5E1' : '#3B82F6'}
                      strokeWidth="1.5"
                    />

                    {/* Tower Icon or Crossway Traffic Light */}
                    {isFailed ? (
                      <text x="0" y="5" fill="#EF4444" fontSize="14" fontWeight="bold" textAnchor="middle">
                        ✕
                      </text>
                    ) : (
                      <g>
                        <circle cx="0" cy="0" r="6" fill="#3B82F6" opacity="0.2" className="pulse-node" />
                        <text x="0" y="4" fill="#3B82F6" fontSize="11" textAnchor="middle">
                          🗼
                        </text>
                      </g>
                    )}

                    {/* Router Code Badge */}
                    <rect
                      x="-18"
                      y="-28"
                      width="36"
                      height="13"
                      rx="4"
                      fill={isFailed ? '#EF4444' : '#1E293B'}
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                    />
                    <text x="0" y="-19" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {node.id}
                    </text>

                    {/* Router Name & Queue Meter */}
                    <text x="0" y="34" fill="#1E293B" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {node.name.split(' ')[0]} {node.name.split(' ')[1] || ''}
                    </text>

                    {/* Mini Queue Length Bar */}
                    {!isFailed && (
                      <g transform="translate(-14, 38)">
                        <rect x="0" y="0" width="28" height="4" rx="2" fill="#E2E8F0" />
                        <rect
                          x="0"
                          y="0"
                          width={Math.min(28, (node.queueLength / node.maxQueue) * 28)}
                          height="4"
                          rx="2"
                          fill={node.queueLength > node.maxQueue * 0.7 ? '#EF4444' : '#10B981'}
                        />
                      </g>
                    )}
                  </g>
                )}

                {/* SERVER NODE (Cloud Data Center Building) */}
                {node.role === 'server' && (
                  <g>
                    <ellipse cx="0" cy="22" rx="24" ry="7" fill="#8B96A5" opacity="0.15" />
                    {/* Modern Glass Server Building */}
                    <rect x="-18" y="-14" width="36" height="34" rx="4" fill="#FFFFFF" stroke="#818CF8" strokeWidth="2" />
                    {/* Server Racks / Windows with glowing server LEDs */}
                    <rect x="-14" y="-10" width="28" height="6" rx="1.5" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="0.8" />
                    <circle cx="-10" cy="-7" r="1" fill="#10B981" />
                    <circle cx="-6" cy="-7" r="1" fill="#3B82F6" />

                    <rect x="-14" y="-1" width="28" height="6" rx="1.5" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="0.8" />
                    <circle cx="-10" cy="2" r="1" fill="#10B981" />
                    <circle cx="-6" cy="2" r="1" fill="#10B981" />

                    <rect x="-14" y="8" width="28" height="6" rx="1.5" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="0.8" />
                    <circle cx="-10" cy="11" r="1" fill="#F59E0B" />
                    <circle cx="-6" cy="11" r="1" fill="#10B981" />

                    {/* Roof Antenna / Cloud */}
                    <line x1="0" y1="-14" x2="0" y2="-22" stroke="#6366F1" strokeWidth="1.5" />
                    <circle cx="0" cy="-22" r="2.5" fill="#4F46E5" />

                    {/* Label */}
                    <text x="0" y="32" fill="#1E293B" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {node.label}
                    </text>
                    <text x="0" y="44" fill="#64748B" fontSize="8" textAnchor="middle">
                      {node.ip}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Selection Details Bottom Drawer */}
      {(selectedNodeId || selectedLinkId) && (
        <div className="border-t border-[#E5E9F0] bg-white/95 p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          {selectedNodeId && (() => {
            const node = nodeMap.get(selectedNodeId);
            if (!node) return null;
            return (
              <div className="flex flex-wrap items-center justify-between w-full gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8E4F3] text-[#7F77A8] flex items-center justify-center font-bold text-base">
                    {node.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#2D3142] flex items-center gap-2">
                      {node.name}
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                        node.status === 'online' ? 'bg-[#D8F3E5] text-[#2D6A4F]' : 'bg-[#FDE4EA] text-[#9F1239]'
                      }`}>
                        {node.status.toUpperCase()}
                      </span>
                    </h3>
                    <p className="text-xs text-[#7A8398]">{node.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#4A5568]">
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">IP ADDRESS</span>
                    <span className="font-mono font-bold">{node.ip}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">PACKET QUEUE</span>
                    <span className="font-bold">{node.queueLength} / {node.maxQueue}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">TOTAL PROCESSED</span>
                    <span className="font-bold">{node.processedCount} pkts</span>
                  </div>
                  {node.role === 'router' && (
                    <button
                      onClick={() => onToggleNodeFail(node.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all border ${
                        node.status === 'failed'
                          ? 'bg-[#D8F3E5] text-[#2D6A4F] border-[#B7E4C7] hover:bg-[#C2EBD4]'
                          : 'bg-[#FDE4EA] text-[#9F1239] border-[#FDA4AF] hover:bg-[#FCD0DC]'
                      }`}
                    >
                      {node.status === 'failed' ? 'Restore Intersection' : 'Close Intersection (Fail)'}
                    </button>
                  )}
                  <button
                    onClick={() => onSelectNode(null)}
                    className="text-xs text-[#94A3B8] hover:text-[#2D3142] underline"
                  >
                    Deselect
                  </button>
                </div>
              </div>
            );
          })()}

          {selectedLinkId && (() => {
            const link = links.find((l) => l.id === selectedLinkId);
            if (!link) return null;
            return (
              <div className="flex flex-wrap items-center justify-between w-full gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DCEBFA] text-[#2B6CB0] flex items-center justify-center font-bold text-sm">
                    🛣️
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#2D3142] flex items-center gap-2">
                      {link.name} ({link.source} ↔ {link.target})
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                        link.failed ? 'bg-[#FDE4EA] text-[#9F1239]' : 'bg-[#D8F3E5] text-[#2D6A4F]'
                      }`}>
                        {link.failed ? 'CLOSED' : `${link.currentLoad}% LOAD`}
                      </span>
                    </h3>
                    <p className="text-xs text-[#7A8398]">
                      Bandwidth: {link.bandwidthMbps} Mbps | Base Latency: {link.baseLatencyMs} ms
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#4A5568]">
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">VEHICLES EN ROUTE</span>
                    <span className="font-bold">{link.vehiclesOnRoad}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">DROP RATE</span>
                    <span className="font-bold">{Math.round(link.packetLossRate * 100)}%</span>
                  </div>
                  <button
                    onClick={() => onToggleLinkFail(link.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all border ${
                      link.failed
                        ? 'bg-[#D8F3E5] text-[#2D6A4F] border-[#B7E4C7] hover:bg-[#C2EBD4]'
                        : 'bg-[#FDE4EA] text-[#9F1239] border-[#FDA4AF] hover:bg-[#FCD0DC]'
                    }`}
                  >
                    {link.failed ? 'Re-open Road' : 'Close Road (Fail Link)'}
                  </button>
                  <button
                    onClick={() => onSelectLink(null)}
                    className="text-xs text-[#94A3B8] hover:text-[#2D3142] underline"
                  >
                    Deselect
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
