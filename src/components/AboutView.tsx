'use client';

import React from 'react';
import { BookOpen, Layers, ShieldCheck, Sparkles, Cpu, GitBranch, ArrowRight } from 'lucide-react';

export const AboutView: React.FC = () => {
  const mappings = [
    { network: 'Packet (Data Frame)', netropolis: 'Vehicle (Mini Sedan / Delivery Van / Sports Racer)', note: 'Carries byte payload along roads' },
    { network: 'Router (Layer 3 Node)', netropolis: 'Intersection Roundabout / Signal Tower', note: 'Inspects IP destination and routes vehicles' },
    { network: 'Network Link (Physical Medium)', netropolis: 'City Road / Highway / Arterial', note: 'Connects nodes with physical length and speed limits' },
    { network: 'Bandwidth (Capacity)', netropolis: 'Road Capacity (Number of Lanes)', note: 'Max concurrent vehicles without queue build-up' },
    { network: 'Congestion (Buffer Overflow)', netropolis: 'Traffic Jam / Intersection Gridlock', note: 'When incoming packet arrival rate exceeds link servicing' },
    { network: 'Propagation & Queuing Delay', netropolis: 'Travel Time & Signal Wait Delay', note: 'Transit time across distance plus queue latency' },
    { network: 'Packet Loss (Buffer Drop)', netropolis: 'Road Hazard / Broken-down Vehicle', note: 'Vehicle removed from road when queue exceeds capacity' },
    { network: 'Routing Algorithm (OSPF / Dijkstra)', netropolis: 'City Navigation System (GPS)', note: 'Computes optimal path based on distance & traffic impedance' },
    { network: 'Router Failure (Link State Outage)', netropolis: 'Closed Intersection / Roadblock Barrier', note: 'Forces dynamic convergence to alternate paths' },
    { network: 'Link Failure (Cut Cable)', netropolis: 'Closed Road Under Construction', note: 'Immediate detour routing around damaged segment' },
    { network: 'TCP Retransmission', netropolis: 'Resending Lost Delivery Van from Depot', note: 'ACK timeout triggers sender to dispatch duplicate vehicle' },
    { network: 'UDP Transmission', netropolis: 'Fast Courier without Delivery Receipt', note: 'No receipts, high velocity, dropped packages remain lost' },
    { network: 'Network Load', netropolis: 'Traffic Density / Vehicles Per Minute', note: 'Total volume of active traffic across grid' },
    { network: 'Clients (Host Endpoints)', netropolis: 'Suburban Houses / Laptops', note: 'Willow Cottage and Meadow Villa requesting services' },
    { network: 'Servers (Application Daemons)', netropolis: 'Cloud Data Center & Streaming Vault', note: 'Destination buildings responding to client requests' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Hero Header */}
      <div className="pastel-card p-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8E4F3] border border-[#D8D2EC] text-[#7F77A8] rounded-full text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Educational Simulator</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-[#2D3142]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
          Netropolis
        </h1>
        <p className="text-xl text-[#5C6479] italic font-serif max-w-2xl mx-auto">
          “Visualizing Computer Network Traffic as an Intelligent City”
        </p>

        <p className="text-sm text-[#64748B] max-w-3xl mx-auto leading-relaxed pt-2">
          Netropolis translates abstract networking abstractions—packet queues, Dijkstra routing, congestion control, TCP reliability, and link failures—into an intuitive, interactive smart city. Packets cruise across roads as cute pastel vehicles, routers direct traffic at roundabouts, and dynamic routing navigation steers traffic away from bottlenecks.
        </p>
      </div>

      {/* Conceptual Metaphor Mapping Table */}
      <div className="pastel-card p-6 space-y-4">
        <div className="border-b border-[#ECEFF5] pb-3">
          <h2 className="text-lg font-bold text-[#2D3142]">Networking ↔ Netropolis City Metaphor Mapping</h2>
          <p className="text-xs text-[#7A8398]">Formal alignment between computer networking concepts and urban traffic elements</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569]">
                <th className="py-3 px-4 font-bold">Computer Network Concept</th>
                <th className="py-3 px-4 font-bold">Netropolis Urban Equivalent</th>
                <th className="py-3 px-4 font-bold">Educational Behavioral Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEFF5]">
              {mappings.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FDFCF9] transition-colors">
                  <td className="py-2.5 px-4 font-bold text-[#2D3142]">
                    {row.network}
                  </td>
                  <td className="py-2.5 px-4 text-[#2563EB] font-medium">
                    {row.netropolis}
                  </td>
                  <td className="py-2.5 px-4 text-[#64748B]">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Core Networking Theory Explained */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="pastel-card p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#DCEBFA] text-[#1E40AF] flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="text-base font-bold text-[#2D3142]">Dijkstra vs Congestion Routing</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Standard Dijkstra computes paths purely on static link propagation delay. Congestion-aware routing penalizes congested links non-linearly (approximating $M/M/1$ queuing delay), naturally steering traffic through faster detours.
          </p>
        </div>

        <div className="pastel-card p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8E4F3] text-[#7C3AED] flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="text-base font-bold text-[#2D3142]">TCP Reliability & Retransmission</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            TCP implements positive acknowledgments (ACKs). When a packet vehicle encounters a buffer overflow or link break, the sender experiences a Retransmission Timeout (RTO) and re-dispatches the packet vehicle.
          </p>
        </div>

        <div className="pastel-card p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#FDE4EA] text-[#BE185D] flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="text-base font-bold text-[#2D3142]">Topology Convergence & Faults</h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            When core router $R3$ or link $R1-R3$ crashes, the topology dynamically updates edge weights to $\infty$. Packets in-flight reroute along alternate pathways through $R2$ or $R4$, demonstrating link-state convergence.
          </p>
        </div>
      </div>
    </div>
  );
};
