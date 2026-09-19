export type NodeRole = 'client' | 'router' | 'server';
export type NodeStatus = 'online' | 'failed' | 'congested';
export type LinkStatus = 'normal' | 'busy' | 'heavy' | 'congested' | 'failed';
export type ProtocolType = 'TCP' | 'UDP';
export type RoutingMode = 'shortest-path' | 'congestion-aware';
export type PacketStatus = 'in-transit' | 'delivered' | 'lost' | 'retransmitting' | 'waiting-ack' | 'ack-in-transit';

export interface RouterNode {
  id: string;
  label: string;
  name: string;
  role: NodeRole;
  x: number;
  y: number;
  status: NodeStatus;
  ip: string;
  description: string;
  queueLength: number;
  maxQueue: number;
  processedCount: number;
  droppedCount: number;
  iconType?: string;
}

export interface NetworkLink {
  id: string;
  source: string;
  target: string;
  bandwidthMbps: number;
  baseLatencyMs: number;
  currentLoad: number; // 0 - 100%
  packetLossRate: number; // 0 - 1
  status: LinkStatus;
  name: string;
  vehiclesOnRoad: number;
  failed: boolean;
}

export interface HopRecord {
  nodeId: string;
  timeMs: number;
}

export interface SimulationPacket {
  id: string;
  protocol: ProtocolType;
  sourceId: string;
  targetId: string;
  path: string[]; // List of node IDs
  currentPathIndex: number;
  progress: number; // 0 to 1 along current link
  speed: number;
  status: PacketStatus;
  sequenceNumber: number;
  sizeBytes: number;
  createdAt: number;
  elapsedMs: number;
  hops: HopRecord[];
  isAck?: boolean;
  retryCount: number;
  color: string;
  lossReason?: string;
  failurePoint?: string;
  waitingForAckUntil?: number;
}

export interface SimulationStats {
  generated: number;
  delivered: number;
  lost: number;
  retransmitted: number;
  deliveryPercentage: number;
  avgDelayMs: number;
  throughputKbps: number;
  currentCongestionScore: number;
  activeRouteChanges: number;
  failedRoutersCount: number;
  failedLinksCount: number;
  baseLatencyMs: number;
}

export interface IncidentFlowState {
  active: boolean;
  stage: 'idle' | 'failed' | 'searching' | 'rerouted' | 'recovered';
  incidentTitle: string;
  previousRoute: string[];
  newRoute: string[];
  message: string;
  timestamp: string;
}

export interface IncidentEvent {
  id: string;
  timestamp: string;
  type: 'router_fail' | 'link_fail' | 'congestion' | 'recovered' | 'reroute' | 'packet_loss';
  title: string;
  description: string;
  affectedTarget?: string;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  protocol: ProtocolType;
  routingMode: RoutingMode;
  packetRate: number;
  lossRate: number;
  congestion: number;
  failedNodes: string[];
  failedLinks: string[];
  recommendedFocus: string;
}

