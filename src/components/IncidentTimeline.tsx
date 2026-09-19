'use client';

import React from 'react';
import { IncidentEvent } from '@/types/network';
import { History, Play, AlertTriangle, CheckCircle, Flame, GitBranch, XCircle } from 'lucide-react';

interface IncidentTimelineProps {
  incidents: IncidentEvent[];
  onReplayIncidents: () => void;
  onClearIncidents: () => void;
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({
  incidents,
  onReplayIncidents,
  onClearIncidents,
}) => {
  const getEventIcon = (type: IncidentEvent['type']) => {
    switch (type) {
      case 'router_fail':
        return <XCircle className="w-3.5 h-3.5 text-[#E11D48]" />;
      case 'link_fail':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#EA580C]" />;
      case 'congestion':
        return <Flame className="w-3.5 h-3.5 text-[#D97706]" />;
      case 'reroute':
        return <GitBranch className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'recovered':
        return <CheckCircle className="w-3.5 h-3.5 text-[#059669]" />;
      default:
        return <History className="w-3.5 h-3.5 text-[#7F77A8]" />;
    }
  };

  return (
    <div className="pastel-card p-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#ECEFF5]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFE7D9] text-[#EA580C] flex items-center justify-center">
            <History className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#2D3142] uppercase tracking-wide">
              Network Incident Timeline
            </h3>
            <p className="text-[11px] text-[#7A8398]">Chronological Diagnostic Audit</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReplayIncidents}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#E8E4F3] hover:bg-[#D5CDEC] text-[#695F96] rounded-lg transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Replay Incidents</span>
          </button>
          <button
            onClick={onClearIncidents}
            className="text-[11px] text-[#94A3B8] hover:text-[#475569] underline px-1"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="mt-3 space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {incidents.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#94A3B8] italic">
            No incidents recorded yet. Use the Traffic Control panel to trigger router failure or traffic spikes.
          </div>
        ) : (
          incidents.map((ev, idx) => (
            <div key={ev.id || idx} className="flex items-start gap-2.5 text-xs group">
              <span className="font-mono text-[10px] text-[#7A8398] pt-0.5 whitespace-nowrap">
                {ev.timestamp}
              </span>
              <div className="p-1 rounded-md bg-white border border-[#E2E8F0] shadow-2xs mt-0.5">
                {getEventIcon(ev.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#2D3142] flex items-center gap-1.5 flex-wrap">
                  <span>{ev.title}</span>
                  {ev.affectedTarget && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-[#F1F5F9] text-[#475569] font-mono">
                      {ev.affectedTarget}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#64748B] leading-tight mt-0.5">{ev.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
