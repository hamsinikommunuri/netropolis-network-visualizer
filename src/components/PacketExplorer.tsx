'use client';

import React, { useState } from 'react';
import { SimulationPacket } from '@/types/network';
import {
  Activity,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  Send,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface PacketExplorerProps {
  packets: SimulationPacket[];
  selectedPacketId: string | null;
  onSelectPacket: (id: string | null) => void;
}

export const PacketExplorer: React.FC<PacketExplorerProps> = ({
  packets,
  selectedPacketId,
  onSelectPacket,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredPackets = packets
    .filter((p) => {
      if (filterStatus === 'all') return true;
      return p.status === filterStatus;
    })
    .filter((p) => {
      if (!searchTerm) return true;
      return (
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sourceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.protocol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const selectedPacket = packets.find((p) => p.id === selectedPacketId) || packets[0] || null;

  const getStatusBadge = (status: SimulationPacket['status']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D8F3E5] text-[#065F46] border border-[#A7F3D0]">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'lost':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FDE4EA] text-[#9F1239] border border-[#FDA4AF]">
            <XCircle className="w-3 h-3" /> Lost / Dropped
          </span>
        );
      case 'retransmitting':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            <RotateCw className="w-3 h-3 animate-spin" /> Retransmitting
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DCEBFA] text-[#1E40AF] border border-[#BFDBFE]">
            <Send className="w-3 h-3" /> In Transit
          </span>
        );
    }
  };

  return (
    <div className="pastel-card p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#ECEFF5]">
        <div>
          <h2 className="text-xl font-bold text-[#2D3142] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#4A7FB8]" />
            <span>Packet Explorer</span>
          </h2>
          <p className="text-xs text-[#7A8398]">
            Deep-dive Frame & Transport Layer Inspection for Computer Networks
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search packet ID / host..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#3B82F6] text-[#2D3142] w-48"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none text-[#2D3142]"
          >
            <option value="all">All Statuses</option>
            <option value="delivered">Delivered</option>
            <option value="in-transit">In Transit</option>
            <option value="lost">Lost</option>
            <option value="retransmitting">Retransmitting</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Packets List */}
        <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-2">
          <div className="text-xs font-bold text-[#7A8398] uppercase tracking-wider mb-2">
            Live Streamed Packets ({filteredPackets.length})
          </div>

          {filteredPackets.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#94A3B8] border border-dashed border-[#E2E8F0] rounded-xl">
              No packets matching your filter. Start simulation to dispatch packets.
            </div>
          ) : (
            filteredPackets.slice(0, 35).map((pkt) => {
              const isSelected = selectedPacket?.id === pkt.id;
              return (
                <div
                  key={pkt.id}
                  onClick={() => onSelectPacket(pkt.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#EBF5FF] border-[#93C5FD] shadow-xs ring-1 ring-[#3B82F6]'
                      : 'bg-white border-[#ECEFF5] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2D3142]">{pkt.id}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-xs font-bold ${
                          pkt.protocol === 'TCP' ? 'bg-[#DCEBFA] text-[#1E40AF]' : 'bg-[#FDE4EA] text-[#9F1239]'
                        }`}
                      >
                        {pkt.protocol}
                      </span>
                    </div>
                    {getStatusBadge(pkt.status)}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>
                      {pkt.sourceId} → {pkt.targetId}
                    </span>
                    <span>{pkt.elapsedMs} ms</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Packet Inspector */}
        <div className="lg:col-span-7">
          {selectedPacket ? (
            <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#2D3142]">{selectedPacket.id}</h3>
                    {getStatusBadge(selectedPacket.status)}
                  </div>
                  <p className="text-xs text-[#7A8398]">Sequence #{selectedPacket.sequenceNumber}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-1 rounded-md">
                    {selectedPacket.sizeBytes} bytes payload
                  </span>
                </div>
              </div>

              {/* Protocol Spec Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-xl border border-[#EAEFF5]">
                  <span className="text-[10px] text-[#7A8398] uppercase block">Transport Protocol</span>
                  <span className="text-sm font-bold text-[#2D3142]">{selectedPacket.protocol}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#EAEFF5]">
                  <span className="text-[10px] text-[#7A8398] uppercase block">Hop Count</span>
                  <span className="text-sm font-bold text-[#2D3142]">
                    {selectedPacket.hops.length > 0 ? selectedPacket.hops.length - 1 : selectedPacket.path.length - 1} hops
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#EAEFF5]">
                  <span className="text-[10px] text-[#7A8398] uppercase block">Transit Delay</span>
                  <span className="text-sm font-bold text-[#2D3142]">{selectedPacket.elapsedMs} ms</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#EAEFF5]">
                  <span className="text-[10px] text-[#7A8398] uppercase block">TCP Retries</span>
                  <span className="text-sm font-bold text-[#2D3142]">{selectedPacket.retryCount || 0}</span>
                </div>
              </div>

              {/* Path Flow Route */}
              <div className="bg-white p-4 rounded-xl border border-[#EAEFF5] space-y-2">
                <span className="text-xs font-bold text-[#2D3142] block">Forwarding Path Taken</span>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {selectedPacket.path.map((nodeId, idx) => (
                    <React.Fragment key={idx}>
                      <div className="px-3 py-1.5 bg-[#F1F5F9] rounded-lg text-xs font-mono font-bold text-[#334155] whitespace-nowrap">
                        {nodeId}
                      </div>
                      {idx < selectedPacket.path.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Hop-by-Hop Timeline */}
              <div className="bg-white p-4 rounded-xl border border-[#EAEFF5] space-y-3">
                <span className="text-xs font-bold text-[#2D3142] block">
                  Hop-by-Hop Event Timeline
                </span>
                <div className="relative border-l-2 border-[#E2E8F0] ml-3 pl-4 space-y-3 text-xs">
                  {selectedPacket.hops.map((hop, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#3B82F6] border-2 border-white" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2D3142]">{hop.nodeId}</span>
                        <span className="font-mono text-[#7A8398]">{hop.timeMs} ms</span>
                      </div>
                      <span className="text-[11px] text-[#64748B]">
                        {idx === 0
                          ? 'Packet injected into network interface'
                          : idx === selectedPacket.hops.length - 1 && selectedPacket.status === 'delivered'
                          ? 'Reached destination and processed'
                          : 'Forwarded via routing table'}
                      </span>
                    </div>
                  ))}

                  {selectedPacket.status === 'lost' && (
                    <div className="relative">
                      <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#EF4444] border-2 border-white" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#EF4444]">Dropped</span>
                        <span className="font-mono text-[#EF4444]">{selectedPacket.elapsedMs} ms</span>
                      </div>
                      <span className="text-[11px] text-[#DC2626]">
                        {selectedPacket.lossReason || 'Buffer overflow or link disruption'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-sm text-[#94A3B8] bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              Select a packet from the list to inspect its protocol headers and hop timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
