'use client';

import React, { useState } from 'react';
import { X, BookOpen, Search, ExternalLink, Lightbulb } from 'lucide-react';

interface Term {
  title: string;
  category: 'Layer 2/3' | 'Layer 4' | 'Performance' | 'Algorithms';
  definition: string;
  netropolisAnalogy: string;
  technicalFormula?: string;
}

const GLOSSARY_TERMS: Term[] = [
  {
    title: 'Router',
    category: 'Layer 2/3',
    definition: 'A networking device that forwards data packets between computer networks based on destination IP addresses.',
    netropolisAnalogy: 'Intersection Roundabout / Traffic Controller directing vehicles to outgoing roads based on signs.',
  },
  {
    title: 'Packet',
    category: 'Layer 2/3',
    definition: 'The fundamental formatted unit of data carried by a packet-switched network, containing headers (IP source/dest) and payload.',
    netropolisAnalogy: 'A small vehicle (delivery van or sports racer) carrying cargo across roadways to destination buildings.',
  },
  {
    title: 'Bandwidth',
    category: 'Performance',
    definition: 'The maximum rate of data transfer across a given network path, measured in bits per second (bps, Mbps, Gbps).',
    netropolisAnalogy: 'Road Width & Number of Lanes. A 4-lane highway handles more simultaneous vehicles than a single-lane road.',
    technicalFormula: 'C = B \\log_2(1 + S/N) \\text{ (Shannon Capacity)}',
  },
  {
    title: 'Latency (Delay)',
    category: 'Performance',
    definition: 'The total time taken for data to travel from the source to its destination. Composed of propagation, transmission, nodal processing, and queuing delay.',
    netropolisAnalogy: 'Total Commute Duration = Travel Time + Time waiting behind jammed cars at red lights.',
    technicalFormula: 'd_{\\text{nodal}} = d_{\\text{proc}} + d_{\\text{queue}} + d_{\\text{trans}} + d_{\\text{prop}}',
  },
  {
    title: 'Throughput',
    category: 'Performance',
    definition: 'The actual rate at which data is successfully delivered over a communication channel in practice (goodput).',
    netropolisAnalogy: 'The number of cars that actually arrive at their destination buildings per minute.',
  },
  {
    title: 'Packet Loss',
    category: 'Performance',
    definition: 'Failure of transmitted packets to arrive at their destination, typically caused by network buffer exhaustion (overflow) or link errors.',
    netropolisAnalogy: 'A vehicle that breaks down or is turned away because the parking lot / intersection is 100% full.',
  },
  {
    title: 'TCP (Transmission Control Protocol)',
    category: 'Layer 4',
    definition: 'A connection-oriented transport protocol that guarantees ordered, reliable data delivery with congestion control and retransmissions.',
    netropolisAnalogy: 'A reliable postal delivery van with certified return-receipts (ACKs). If a van is lost, another is dispatched.',
  },
  {
    title: 'UDP (User Datagram Protocol)',
    category: 'Layer 4',
    definition: 'A lightweight connectionless transport protocol with minimal latency, no handshake, and no retransmission guarantee.',
    netropolisAnalogy: 'A high-speed sports courier. If a vehicle crashes, no retransmission is attempted, maintaining low latency.',
  },
  {
    title: 'Congestion',
    category: 'Performance',
    definition: 'A state where demand for network capacity exceeds available resources, leading to queuing delays, packet loss, and throughput collapse.',
    netropolisAnalogy: 'Traffic Gridlock. Cars backup onto feeder streets, slowing everybody down.',
  },
  {
    title: 'Routing Algorithm',
    category: 'Algorithms',
    definition: 'The mathematical method (e.g. Dijkstra, Bellman-Ford, OSPF) used by routers to determine the optimal forwarding path across a graph.',
    netropolisAnalogy: 'GPS Satellite Navigation computing the quickest route based on road distance and live traffic conditions.',
  },
  {
    title: 'Queueing Delay (M/M/1)',
    category: 'Algorithms',
    definition: 'Time spent waiting in router buffers before transmission begins. Explodes non-linearly as utilization approaches 100%.',
    netropolisAnalogy: 'The queue of cars waiting at an intersection tollbooth during rush hour.',
    technicalFormula: 'W = \\frac{1}{\\mu - \\lambda} = \\frac{1/\\mu}{1 - \\rho}',
  },
];

interface LearningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LearningModal: React.FC<LearningModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = GLOSSARY_TERMS.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (!searchTerm) return true;
    return (
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.netropolisAnalogy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#ECEFF5] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8E4F3] text-[#7F77A8] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2D3142]">Netropolis Educational Encyclopedia</h2>
              <p className="text-xs text-[#7A8398]">Core Computer Networking Concepts & City Metaphors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#2D3142] hover:bg-[#EDF2F7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter bar */}
        <div className="p-4 border-b border-[#ECEFF5] flex flex-wrap gap-2 items-center justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search concepts (e.g., Latency, TCP, Dijkstra)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto text-xs">
            {['all', 'Layer 2/3', 'Layer 4', 'Performance', 'Algorithms'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium ${
                  selectedCategory === cat
                    ? 'bg-[#DCEBFA] text-[#1E40AF] font-bold'
                    : 'text-[#64748B] hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Body Terms */}
        <div className="p-5 overflow-y-auto space-y-4">
          {filtered.map((term, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-[#ECEFF5] bg-[#FDFCF9] space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#2D3142]">{term.title}</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#E8E4F3] text-[#7F77A8]">
                  {term.category}
                </span>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed">{term.definition}</p>

              <div className="flex items-start gap-2 p-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg text-xs text-[#166534]">
                <Lightbulb className="w-4 h-4 shrink-0 text-[#16A34A] mt-0.5" />
                <div>
                  <strong className="font-semibold block text-[#15803D]">Netropolis City Metaphor:</strong>
                  <span>{term.netropolisAnalogy}</span>
                </div>
              </div>

              {term.technicalFormula && (
                <div className="font-mono text-[11px] bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0] text-[#334155]">
                  {term.technicalFormula}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
