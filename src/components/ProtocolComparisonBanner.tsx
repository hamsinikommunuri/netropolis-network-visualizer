'use client';

import React, { useState } from 'react';
import { ProtocolType } from '@/types/network';
import { Check, X, RotateCw, Clock, ArrowRight, Play, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface ProtocolComparisonBannerProps {
  onRunTcpDemo: () => void;
  onRunUdpDemo: () => void;
  activeProtocol: ProtocolType;
}

export const ProtocolComparisonBanner: React.FC<ProtocolComparisonBannerProps> = ({
  onRunTcpDemo,
  onRunUdpDemo,
  activeProtocol,
}) => {
  const [activeTab, setActiveTab] = useState<'TCP' | 'UDP'>(activeProtocol);

  return (
    <div className="pastel-card p-4 border border-[#DCEBFA] bg-gradient-to-r from-[#F8FAFC] via-[#FFFFFF] to-[#F8FAFC]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#ECEFF5]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#DCEBFA] text-[#2563EB] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2D3142] flex items-center gap-2">
              <span>Transport Layer Comparison: TCP vs UDP In-Depth</span>
            </h3>
            <p className="text-xs text-[#7A8398]">
              Observe delivery reliability, ACK verification, and retransmission dynamics
            </p>
          </div>
        </div>

        {/* Action buttons to trigger the demonstration sequence */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('TCP');
              onRunTcpDemo();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#DCEBFA] hover:bg-[#C5DFF8] text-[#1E40AF] border border-[#BFDBFE] transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Demonstrate TCP (ACK + Retry)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('UDP');
              onRunUdpDemo();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FDE4EA] hover:bg-[#FBCFE8] text-[#9F1239] border border-[#F472B6] transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Demonstrate UDP (Best Effort)</span>
          </button>
        </div>
      </div>

      {/* Protocol Visual Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {/* TCP Column */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          activeTab === 'TCP'
            ? 'bg-[#F4F9FF] border-[#93C5FD] shadow-xs ring-1 ring-[#3B82F6]'
            : 'bg-white border-[#E2E8F0]'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🚙</span>
              <span className="font-bold text-xs text-[#1E40AF]">TCP (Transmission Control Protocol)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DCEBFA] text-[#1E40AF]">
              Reliable Delivery
            </span>
          </div>

          <p className="text-[11px] text-[#64748B] mb-2 leading-relaxed">
            Connection-oriented with sequence numbers and ACKs. If a packet is lost at a congested or broken router, the sender retransmits along an alternate path.
          </p>

          <div className="p-2.5 bg-white rounded-lg border border-[#E2E8F0] space-y-1.5 text-xs font-mono">
            <div className="text-[10px] text-[#7A8398] uppercase font-sans font-bold">Standard TCP Visual Sequence:</div>
            <div className="flex items-center gap-1 text-[#334155]">
              <span>Client</span>
              <ArrowRight className="w-3 h-3 text-[#94A3B8]" />
              <span>R1</span>
              <ArrowRight className="w-3 h-3 text-[#94A3B8]" />
              <span>R3</span>
              <ArrowRight className="w-3 h-3 text-[#94A3B8]" />
              <span className="text-[#EF4444] font-bold">✕ Lost</span>
            </div>
            <div className="text-[11px] text-[#D97706] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Waiting for ACK... (Timeout Timer)</span>
            </div>
            <div className="text-[11px] text-[#2563EB] flex items-center gap-1">
              <RotateCw className="w-3 h-3 animate-spin" />
              <span>Retransmitting vehicle via alternate road...</span>
            </div>
            <div className="flex items-center gap-1 text-[#059669] font-bold">
              <span>Client</span>
              <ArrowRight className="w-3 h-3" />
              <span>R1</span>
              <ArrowRight className="w-3 h-3" />
              <span>R2</span>
              <ArrowRight className="w-3 h-3" />
              <span>R5</span>
              <ArrowRight className="w-3 h-3" />
              <span>Server Alpha ✓</span>
            </div>
          </div>
        </div>

        {/* UDP Column */}
        <div className={`p-3.5 rounded-xl border transition-all ${
          activeTab === 'UDP'
            ? 'bg-[#FFF5F8] border-[#F472B6] shadow-xs ring-1 ring-[#EC4899]'
            : 'bg-white border-[#E2E8F0]'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🏎️</span>
              <span className="font-bold text-xs text-[#BE185D]">UDP (User Datagram Protocol)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FDE4EA] text-[#9F1239]">
              Best Effort (Fast)
            </span>
          </div>

          <p className="text-[11px] text-[#64748B] mb-2 leading-relaxed">
            Connectionless with zero acknowledgment overhead and faster transit speed. If a packet is lost, it remains lost without any retransmission.
          </p>

          <div className="p-2.5 bg-white rounded-lg border border-[#E2E8F0] space-y-1.5 text-xs font-mono">
            <div className="text-[10px] text-[#7A8398] uppercase font-sans font-bold">Standard UDP Visual Sequence:</div>
            <div className="flex items-center gap-1 text-[#334155]">
              <span>Client</span>
              <ArrowRight className="w-3 h-3 text-[#94A3B8]" />
              <span>R1</span>
              <ArrowRight className="w-3 h-3 text-[#94A3B8]" />
              <span>R3</span>
              <ArrowRight className="w-3 h-3 text-[#94A3B8]" />
              <span className="text-[#EF4444] font-bold">✕ Lost</span>
            </div>
            <div className="text-[11px] text-[#94A3B8] italic">
              No ACK requested • No retransmission timer
            </div>
            <div className="text-[11px] text-[#DC2626] font-bold flex items-center gap-1">
              <X className="w-3 h-3" />
              <span>Packet remains lost (Application handles loss or tolerates frame drop)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
