'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RouterNode,
  NetworkLink,
  SimulationPacket,
  SimulationStats,
  IncidentEvent,
  ProtocolType,
  RoutingMode,
  ScenarioPreset,
  IncidentFlowState,
} from '@/types/network';
import { INITIAL_NODES, INITIAL_LINKS } from '@/lib/networkTopology';
import { findRouteDijkstra, evaluateRouteDetails } from '@/lib/routing';
import { IntroAnimation } from '@/components/IntroAnimation';
import { Navbar, ActiveTab } from '@/components/Navbar';
import { CityMap } from '@/components/CityMap';
import { TrafficControls } from '@/components/TrafficControls';
import { MetricCards } from '@/components/MetricCards';
import { HealthScore } from '@/components/HealthScore';
import { RouteComparisonPanel } from '@/components/RouteComparisonPanel';
import { IncidentTimeline } from '@/components/IncidentTimeline';
import { PacketExplorer } from '@/components/PacketExplorer';
import { AnalyticsView, HistoryPoint } from '@/components/AnalyticsView';
import { SimulationLab } from '@/components/SimulationLab';
import { AboutView } from '@/components/AboutView';
import { LearningModal } from '@/components/LearningModal';
import { IncidentFlowBanner } from '@/components/IncidentFlowBanner';
import { ProtocolComparisonBanner } from '@/components/ProtocolComparisonBanner';

export default function Home() {
  // Intro state
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('city');

  // Simulation Controls & Protocol State
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [protocol, setProtocol] = useState<ProtocolType>('TCP');
  const [routingMode, setRoutingMode] = useState<RoutingMode>('congestion-aware');
  const [packetRate, setPacketRate] = useState<number>(4);
  const [bandwidthMultiplier, setBandwidthMultiplier] = useState<number>(1.0);
  const [congestionMultiplier, setCongestionMultiplier] = useState<number>(1.0);
  const [lossRate, setLossRate] = useState<number>(0.0);
  const [baseLatencyMultiplier, setBaseLatencyMultiplier] = useState<number>(1.0);
  const [burstPacketCount, setBurstPacketCount] = useState<number>(5);

  // Network Elements
  const [nodes, setNodes] = useState<RouterNode[]>(INITIAL_NODES);
  const [links, setLinks] = useState<NetworkLink[]>(INITIAL_LINKS);
  const [packets, setPackets] = useState<SimulationPacket[]>([]);
  // Persistent packet buffer for Packet Explorer (retains last 80 packets without expiring)
  const [packetHistory, setPacketHistory] = useState<SimulationPacket[]>([]);

  // Selection states
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [selectedPacketId, setSelectedPacketId] = useState<string | null>(null);

  // Educational Modal
  const [learningModalOpen, setLearningModalOpen] = useState<boolean>(false);

  // Incident Live Transition Flow (Requirement 12 & 13)
  const [incidentFlow, setIncidentFlow] = useState<IncidentFlowState>({
    active: false,
    stage: 'idle',
    incidentTitle: 'System Normal',
    previousRoute: ['C-A', 'R1', 'R3', 'R6', 'S-B'],
    newRoute: ['C-A', 'R1', 'R2', 'R5', 'S-A'],
    message: 'All network roads and intersections operational.',
    timestamp: '00:00',
  });

  // Statistics
  const [stats, setStats] = useState<SimulationStats>({
    generated: 0,
    delivered: 0,
    lost: 0,
    retransmitted: 0,
    deliveryPercentage: 100,
    avgDelayMs: 24,
    throughputKbps: 180,
    currentCongestionScore: 18,
    activeRouteChanges: 0,
    failedRoutersCount: 0,
    failedLinksCount: 0,
    baseLatencyMs: 8,
  });

  // History buffer for telemetry charts
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  // Incident log
  const [incidents, setIncidents] = useState<IncidentEvent[]>([
    {
      id: 'init-1',
      timestamp: '00:00',
      type: 'recovered',
      title: 'Simulation Initialized',
      description: 'Netropolis smart city network online with 7 intersections and 18 roadways.',
    },
  ]);

  // Protocol specific counters
  const [tcpTotal, setTcpTotal] = useState<number>(0);
  const [udpTotal, setUdpTotal] = useState<number>(0);
  const [tcpDelivered, setTcpDelivered] = useState<number>(0);
  const [udpDelivered, setUdpDelivered] = useState<number>(0);

  // Packet ID generator ref
  const packetIdCounter = useRef<number>(1000);
  const simulationTimeSeconds = useRef<number>(0);
  const lastRouteRef = useRef<string>('');

  // Format timestamp MM:SS
  const getSimTimestamp = () => {
    const s = Math.floor(simulationTimeSeconds.current);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add an incident to the timeline
  const logIncident = useCallback(
    (
      type: IncidentEvent['type'],
      title: string,
      description: string,
      affectedTarget?: string
    ) => {
      setIncidents((prev) => [
        {
          id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          timestamp: getSimTimestamp(),
          type,
          title,
          description,
          affectedTarget,
        },
        ...prev.slice(0, 49),
      ]);
    },
    []
  );

  // Calculate overall network health score (0-100)
  const computeHealthScore = useCallback(() => {
    const failedRouters = nodes.filter((n) => n.role === 'router' && n.status === 'failed').length;
    const failedLinks = links.filter((l) => l.failed).length;
    const avgLoad =
      links.length > 0
        ? links.reduce((acc, l) => acc + (l.failed ? 100 : l.currentLoad), 0) / links.length
        : 0;
    const lossFraction = stats.generated > 0 ? stats.lost / stats.generated : 0;

    let score = 100;
    score -= failedRouters * 20;
    score -= failedLinks * 10;
    score -= Math.round((avgLoad / 100) * 25);
    score -= Math.round(lossFraction * 40);

    return Math.max(5, Math.min(100, Math.round(score)));
  }, [nodes, links, stats.generated, stats.lost]);

  // Trigger step-by-step incident transition sequence (Requirement 12)
  const triggerIncidentSequence = useCallback(
    (incidentTitle: string, failedEntityId: string) => {
      const prevPath = findRouteDijkstra(nodes, links, 'C-A', 'S-A', routingMode)?.path || [
        'C-A',
        'R1',
        'R3',
        'R6',
        'S-B',
      ];

      // Step 1 & 2: Failure Event
      setIncidentFlow({
        active: true,
        stage: 'failed',
        incidentTitle,
        previousRoute: prevPath,
        newRoute: [],
        message: `${incidentTitle.toUpperCase()} — Packets in transit on this corridor are dropped.`,
        timestamp: getSimTimestamp(),
      });

      // Step 3: Searching
      setTimeout(() => {
        setIncidentFlow((cur) => ({
          ...cur,
          stage: 'searching',
          message: 'Searching for alternate detour route via dynamic graph recalculation...',
        }));
      }, 1200);

      // Step 4: Rerouted
      setTimeout(() => {
        const altResult = findRouteDijkstra(nodes, links, 'C-A', 'S-A', routingMode);
        const newPath = altResult?.path || ['C-A', 'R1', 'R2', 'R5', 'S-A'];
        setIncidentFlow((cur) => ({
          ...cur,
          stage: 'rerouted',
          newRoute: newPath,
          message: `Traffic corridor redirected: ${newPath.join(' → ')}`,
        }));
      }, 2600);

      // Step 5: Network Recovered / Stabilized
      setTimeout(() => {
        setIncidentFlow((cur) => ({
          ...cur,
          stage: 'recovered',
          message: 'NETWORK RECOVERED: New steady state established. Traffic flow stabilized.',
        }));
      }, 5500);
    },
    [nodes, links, routingMode]
  );

  // Toggle Router Failure
  const handleToggleNodeFail = useCallback(
    (nodeId: string) => {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === nodeId) {
            const willFail = n.status !== 'failed';
            logIncident(
              willFail ? 'router_fail' : 'recovered',
              willFail ? `Intersection ${nodeId} Closed` : `Intersection ${nodeId} Restored`,
              willFail
                ? `Node ${nodeId} (${n.name}) went offline. Traffic must detour.`
                : `Node ${nodeId} (${n.name}) restored to operational service.`,
              nodeId
            );

            if (willFail) {
              triggerIncidentSequence(`Router ${nodeId} Failed`, nodeId);
            }

            return {
              ...n,
              status: willFail ? 'failed' : 'online',
              queueLength: willFail ? 0 : n.queueLength,
            };
          }
          return n;
        })
      );
    },
    [logIncident, triggerIncidentSequence]
  );

  // Toggle Link Road Failure
  const handleToggleLinkFail = useCallback(
    (linkId: string) => {
      setLinks((prev) =>
        prev.map((l) => {
          if (l.id === linkId) {
            const willFail = !l.failed;
            logIncident(
              willFail ? 'link_fail' : 'recovered',
              willFail ? `Roadway ${l.name} Closed` : `Roadway ${l.name} Re-opened`,
              willFail
                ? `Link ${l.source} ↔ ${l.target} blocked due to incident. Rerouting.`
                : `Link ${l.source} ↔ ${l.target} cleared for traffic flow.`,
              linkId
            );

            if (willFail) {
              triggerIncidentSequence(`Road ${l.name} Closed`, linkId);
            }

            return { ...l, failed: willFail, status: willFail ? 'failed' : 'normal' };
          }
          return l;
        })
      );
    },
    [logIncident, triggerIncidentSequence]
  );

  // Trigger sudden congestion spike on central highway
  const handleTriggerCongestionSpike = useCallback(() => {
    setLinks((prev) =>
      prev.map((l) => {
        if (l.id === 'R1_R3' || l.id === 'R3_R5') {
          return { ...l, currentLoad: 96, status: 'congested' };
        }
        return l;
      })
    );
    logIncident(
      'congestion',
      'Sudden Traffic Surge at Central Corridor',
      'Roads R1-R3 and R3-R5 reached 96% utilization. Congestion penalties surging.',
      'R3 Central Crossway'
    );
    triggerIncidentSequence('Central Highway Congestion Spike', 'R1_R3');
  }, [logIncident, triggerIncidentSequence]);

  // Restore entire network
  const handleRestoreAll = useCallback(() => {
    setNodes((prev) => prev.map((n) => ({ ...n, status: 'online', queueLength: 0 })));
    setLinks((prev) => prev.map((l) => ({ ...l, failed: false, currentLoad: 15, status: 'normal' })));
    logIncident(
      'recovered',
      'All City Infrastructure Restored',
      'All closed intersections and roadways re-opened to normal traffic.'
    );
    setIncidentFlow({
      active: true,
      stage: 'recovered',
      incidentTitle: 'System Restored',
      previousRoute: ['C-A', 'R1', 'R2', 'R5', 'S-A'],
      newRoute: ['C-A', 'R1', 'R3', 'R5', 'S-A'],
      message: 'NETWORK RECOVERED: All core intersections and arterials fully operational.',
      timestamp: getSimTimestamp(),
    });
  }, [logIncident]);

  // Reset entire metrics
  const handleReset = useCallback(() => {
    setPackets([]);
    setPacketHistory([]);
    setStats({
      generated: 0,
      delivered: 0,
      lost: 0,
      retransmitted: 0,
      deliveryPercentage: 100,
      avgDelayMs: 22,
      throughputKbps: 180,
      currentCongestionScore: 15,
      activeRouteChanges: 0,
      failedRoutersCount: 0,
      failedLinksCount: 0,
      baseLatencyMs: 8,
    });
    setTcpTotal(0);
    setUdpTotal(0);
    setTcpDelivered(0);
    setUdpDelivered(0);
    setHistory([]);
    setIncidentFlow({
      active: false,
      stage: 'idle',
      incidentTitle: 'System Normal',
      previousRoute: [],
      newRoute: [],
      message: 'Telemetry metrics cleared.',
      timestamp: '00:00',
    });
    logIncident('recovered', 'Telemetry Statistics Reset', 'Packet counters cleared.');
  }, [logIncident]);

  // Spawn a new simulated packet vehicle
  const spawnPacket = useCallback(
    (customProto?: ProtocolType, forcedSource?: string, forcedTarget?: string) => {
      const activeProto = customProto || protocol;
      const sources = ['C-A', 'C-B'];
      const targets = ['S-A', 'S-B'];
      const sourceId = forcedSource || sources[Math.floor(Math.random() * sources.length)];
      const targetId = forcedTarget || targets[Math.floor(Math.random() * targets.length)];

      const routeResult = findRouteDijkstra(nodes, links, sourceId, targetId, routingMode);

      if (!routeResult || routeResult.path.length < 2) {
        logIncident(
          'packet_loss',
          'Packet Transmission Blocked',
          `Cannot route from ${sourceId} to ${targetId}: no operational path found!`,
          `${sourceId} → ${targetId}`
        );
        return null;
      }

      const routeStr = routeResult.path.join('-');
      if (lastRouteRef.current && lastRouteRef.current !== routeStr) {
        setStats((prev) => ({ ...prev, activeRouteChanges: prev.activeRouteChanges + 1 }));
        logIncident(
          'reroute',
          'Dynamic Path Recalculation',
          `Traffic corridor diverted to: ${routeResult.path.join(' → ')}`,
          routeResult.path[1]
        );
      }
      lastRouteRef.current = routeStr;

      packetIdCounter.current += 1;
      const newId = `#P${packetIdCounter.current}`;

      const baseSpeed = activeProto === 'UDP' ? 0.045 : 0.035;
      const adjustedSpeed = Math.max(0.015, Math.min(0.08, baseSpeed / baseLatencyMultiplier));

      const newPacket: SimulationPacket = {
        id: newId,
        protocol: activeProto,
        sourceId,
        targetId,
        path: routeResult.path,
        currentPathIndex: 0,
        progress: 0,
        speed: adjustedSpeed,
        status: 'in-transit',
        sequenceNumber: packetIdCounter.current,
        sizeBytes: activeProto === 'TCP' ? 1024 : 512,
        createdAt: Date.now(),
        elapsedMs: 0,
        hops: [{ nodeId: sourceId, timeMs: 0 }],
        retryCount: 0,
        color: activeProto === 'TCP' ? '#3B82F6' : '#EC4899',
      };

      // Add to live moving packets
      setPackets((prev) => [...prev.slice(-35), newPacket]);

      // Add to persistent packet history for Packet Explorer (retaining last 80)
      setPacketHistory((prev) => [newPacket, ...prev.slice(0, 79)]);

      setStats((prev) => ({ ...prev, generated: prev.generated + 1 }));

      if (activeProto === 'TCP') {
        setTcpTotal((t) => t + 1);
      } else {
        setUdpTotal((u) => u + 1);
      }

      return newPacket;
    },
    [nodes, links, protocol, routingMode, baseLatencyMultiplier, logIncident]
  );

  // Burst traffic helper (uses burstPacketCount)
  const handleBurstTraffic = useCallback(
    (count?: number) => {
      const actualCount = count || burstPacketCount;
      for (let i = 0; i < actualCount; i++) {
        setTimeout(() => {
          spawnPacket();
        }, i * 140);
      }
      logIncident(
        'congestion',
        `Traffic Generated (${actualCount} vehicles)`,
        `Injected ${actualCount} concurrent packet vehicles into residential entry points.`
      );
    },
    [burstPacketCount, spawnPacket, logIncident]
  );

  // Full Incident Replay Sequence (Requirement 13)
  const handleReplayIncident = useCallback(() => {
    // 1. Reset network to healthy baseline
    handleRestoreAll();

    // 2. Dispatch baseline packet
    setTimeout(() => {
      spawnPacket('TCP', 'C-A', 'S-A');
    }, 400);

    // 3. Inject R3 failure after 1.5s
    setTimeout(() => {
      handleToggleNodeFail('R3');
    }, 1600);

    // 4. Dispatch new packet along northern detour
    setTimeout(() => {
      spawnPacket('TCP', 'C-A', 'S-A');
      spawnPacket('TCP', 'C-B', 'S-B');
    }, 3800);

    // 5. Restore network after 7s
    setTimeout(() => {
      handleRestoreAll();
    }, 7500);
  }, [handleRestoreAll, handleToggleNodeFail, spawnPacket]);

  // Demonstrate TCP Sequence: Drop at R3 -> Wait for ACK -> Retransmit -> Delivered -> Return ACK (Requirement 9)
  const handleRunTcpDemo = useCallback(() => {
    setProtocol('TCP');
    logIncident(
      'reroute',
      'TCP Protocol Reliability Demonstration',
      'Demonstrating packet transmission, ACK wait, retransmission timeout, and return receipt.'
    );

    // Dispatch TCP packet
    const pkt = spawnPacket('TCP', 'C-A', 'S-A');
    if (!pkt) return;

    // Simulate drop on route after 1.2s
    setTimeout(() => {
      setPackets((prev) =>
        prev.map((p) => {
          if (p.id === pkt.id && p.status === 'in-transit') {
            return {
              ...p,
              status: 'waiting-ack',
              lossReason: 'ACK Timeout Simulation',
              waitingForAckUntil: Date.now() + 1000,
            };
          }
          return p;
        })
      );
      logIncident('packet_loss', `TCP Packet ${pkt.id} Lost`, 'Waiting for ACK receipt... Timeout timer active.');
    }, 1200);

    // Trigger retransmission after 2.4s
    setTimeout(() => {
      const altRoute = findRouteDijkstra(nodes, links, 'C-A', 'S-A', 'congestion-aware');
      if (altRoute) {
        const retryPacket: SimulationPacket = {
          ...pkt,
          id: `${pkt.id}-R1`,
          status: 'retransmitting',
          path: altRoute.path,
          currentPathIndex: 0,
          progress: 0,
          retryCount: 1,
          createdAt: Date.now(),
          elapsedMs: 35,
          lossReason: 'TCP Retransmission after Timeout',
        };
        setPackets((prev) => [...prev, retryPacket]);
        setPacketHistory((prev) => [retryPacket, ...prev.slice(0, 79)]);
        setStats((s) => ({ ...s, retransmitted: s.retransmitted + 1 }));
        logIncident('reroute', `TCP Retransmitting ${pkt.id}`, `Sender re-dispatched vehicle along alternate detour: ${altRoute.path.join(' → ')}`);
      }
    }, 2400);
  }, [nodes, links, spawnPacket, logIncident]);

  // Demonstrate UDP Sequence: Drop at R3 -> No ACK, No Retransmission (Requirement 9)
  const handleRunUdpDemo = useCallback(() => {
    setProtocol('UDP');
    logIncident(
      'packet_loss',
      'UDP Best-Effort Demonstration',
      'Demonstrating high-speed connectionless stream. Dropped datagrams have no ACK and no retransmission.'
    );

    const pkt = spawnPacket('UDP', 'C-B', 'S-B');
    if (!pkt) return;

    // Simulate drop on road after 1.0s
    setTimeout(() => {
      setPackets((prev) =>
        prev.map((p) => {
          if (p.id === pkt.id && p.status === 'in-transit') {
            return {
              ...p,
              status: 'lost',
              lossReason: 'UDP Buffer Drop (No Retransmission)',
            };
          }
          return p;
        })
      );
      logIncident('packet_loss', `UDP Datagram ${pkt.id} Lost`, 'No ACK requested. Packet remains lost without retry.');
    }, 1000);
  }, [spawnPacket, logIncident]);

  // Apply scenario preset from Simulation Lab
  const handleApplyScenario = useCallback(
    (preset: ScenarioPreset) => {
      setProtocol(preset.protocol);
      setRoutingMode(preset.routingMode);
      setPacketRate(preset.packetRate);
      setLossRate(preset.lossRate);
      setCongestionMultiplier(preset.congestion);

      // Apply failed nodes
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          status: preset.failedNodes.includes(n.id) ? 'failed' : 'online',
        }))
      );

      // Apply failed links
      setLinks((prev) =>
        prev.map((l) => ({
          ...l,
          failed: preset.failedLinks.includes(l.id),
          status: preset.failedLinks.includes(l.id) ? 'failed' : 'normal',
        }))
      );

      logIncident('reroute', `Applied Scenario: ${preset.name}`, preset.description);
    },
    [logIncident]
  );

  // Main Simulation Tick Loop (50ms interval = 20 ticks/sec)
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      simulationTimeSeconds.current += 0.05;

      setPackets((prevPackets) => {
        const nextPackets: SimulationPacket[] = [];

        for (const pkt of prevPackets) {
          // Keep delivered / lost packets briefly on screen (2.0s) for visual satisfaction
          if (pkt.status === 'delivered' || pkt.status === 'lost') {
            if (Date.now() - pkt.createdAt < 2200) {
              nextPackets.push(pkt);
            }
            continue;
          }

          // Handle waiting-ack state
          if (pkt.status === 'waiting-ack') {
            if (pkt.waitingForAckUntil && Date.now() >= pkt.waitingForAckUntil) {
              // Timeout expired! Retransmit
              const newRoute = findRouteDijkstra(nodes, links, pkt.sourceId, pkt.targetId, routingMode);
              if (newRoute) {
                const retried: SimulationPacket = {
                  ...pkt,
                  status: 'retransmitting',
                  path: newRoute.path,
                  currentPathIndex: 0,
                  progress: 0,
                  retryCount: pkt.retryCount + 1,
                  hops: [...pkt.hops, { nodeId: pkt.sourceId, timeMs: Math.round(pkt.elapsedMs + 25) }],
                };
                nextPackets.push(retried);
                setPacketHistory((hist) =>
                  hist.map((h) => (h.id === pkt.id ? { ...h, status: 'retransmitting', retryCount: pkt.retryCount + 1 } : h))
                );
                setStats((s) => ({ ...s, retransmitted: s.retransmitted + 1 }));
                continue;
              }
            } else {
              nextPackets.push(pkt);
              continue;
            }
          }

          const currentU = pkt.path[pkt.currentPathIndex];
          const nextV = pkt.path[pkt.currentPathIndex + 1];

          // Check if current node or next node failed
          const nodeU = nodes.find((n) => n.id === currentU);
          const nodeV = nodes.find((n) => n.id === nextV);
          const link = links.find(
            (l) =>
              (l.source === currentU && l.target === nextV) ||
              (l.source === nextV && l.target === currentU)
          );

          if (!link || link.failed || nodeU?.status === 'failed' || nodeV?.status === 'failed') {
            if (pkt.protocol === 'TCP' && pkt.retryCount < 2 && !pkt.isAck) {
              // TCP Retransmission!
              logIncident(
                'reroute',
                `TCP ACK Timeout on ${pkt.id}`,
                `Packet lost at closed ${currentU} ↔ ${nextV}. Retransmitting from ${pkt.sourceId}...`
              );
              const newRoute = findRouteDijkstra(nodes, links, pkt.sourceId, pkt.targetId, routingMode);
              if (newRoute) {
                const retryingPkt: SimulationPacket = {
                  ...pkt,
                  path: newRoute.path,
                  currentPathIndex: 0,
                  progress: 0,
                  retryCount: pkt.retryCount + 1,
                  status: 'retransmitting',
                  lossReason: 'Link failure reroute',
                  hops: [{ nodeId: pkt.sourceId, timeMs: Math.round(pkt.elapsedMs + 20) }],
                };
                nextPackets.push(retryingPkt);
                setPacketHistory((hist) =>
                  hist.map((h) => (h.id === pkt.id ? { ...h, status: 'retransmitting', retryCount: pkt.retryCount + 1 } : h))
                );
                setStats((s) => ({ ...s, retransmitted: s.retransmitted + 1 }));
                continue;
              }
            }

            // Otherwise lost
            const lostPkt: SimulationPacket = {
              ...pkt,
              status: 'lost',
              lossReason: 'Intersection/Road Closed',
            };
            nextPackets.push(lostPkt);
            setPacketHistory((hist) =>
              hist.map((h) => (h.id === pkt.id ? { ...h, status: 'lost', lossReason: 'Intersection/Road Closed' } : h))
            );
            setStats((s) => ({ ...s, lost: s.lost + 1 }));
            continue;
          }

          // Random channel loss or artificial drop
          const totalLossProb = lossRate + link.packetLossRate;
          if (Math.random() < totalLossProb * 0.015) {
            if (pkt.protocol === 'TCP' && pkt.retryCount < 2 && !pkt.isAck) {
              const retryingPkt: SimulationPacket = {
                ...pkt,
                status: 'retransmitting',
                progress: 0,
                retryCount: pkt.retryCount + 1,
                lossReason: 'Congestion buffer drop',
              };
              nextPackets.push(retryingPkt);
              setPacketHistory((hist) =>
                hist.map((h) => (h.id === pkt.id ? { ...h, status: 'retransmitting', retryCount: pkt.retryCount + 1 } : h))
              );
              setStats((s) => ({ ...s, retransmitted: s.retransmitted + 1 }));
              continue;
            }

            const droppedPkt: SimulationPacket = {
              ...pkt,
              status: 'lost',
              lossReason: 'Buffer Exhaustion',
            };
            nextPackets.push(droppedPkt);
            setPacketHistory((hist) =>
              hist.map((h) => (h.id === pkt.id ? { ...h, status: 'lost', lossReason: 'Buffer Exhaustion' } : h))
            );
            setStats((s) => ({ ...s, lost: s.lost + 1 }));
            continue;
          }

          // Move vehicle forward
          const newProgress = pkt.progress + pkt.speed;
          const updatedElapsed = pkt.elapsedMs + 18;

          if (newProgress >= 1.0) {
            // Reached next node!
            const nextHopIndex = pkt.currentPathIndex + 1;
            const reachedNodeId = pkt.path[nextHopIndex];

            if (nextHopIndex >= pkt.path.length - 1) {
              // Delivered at final destination server!
              const deliveredPkt: SimulationPacket = {
                ...pkt,
                currentPathIndex: nextHopIndex,
                progress: 1.0,
                status: 'delivered',
                elapsedMs: updatedElapsed,
                hops: [...pkt.hops, { nodeId: reachedNodeId, timeMs: updatedElapsed }],
              };
              nextPackets.push(deliveredPkt);
              setPacketHistory((hist) =>
                hist.map((h) =>
                  h.id === pkt.id
                    ? {
                        ...h,
                        status: 'delivered',
                        elapsedMs: updatedElapsed,
                        hops: [...pkt.hops, { nodeId: reachedNodeId, timeMs: updatedElapsed }],
                      }
                    : h
                )
              );

              setStats((s) => {
                const newDelivered = s.delivered + 1;
                const newTotalGen = Math.max(1, s.generated);
                return {
                  ...s,
                  delivered: newDelivered,
                  deliveryPercentage: Math.round((newDelivered / newTotalGen) * 100),
                  avgDelayMs: Math.round((s.avgDelayMs * 0.9 + updatedElapsed * 0.1) * 10) / 10,
                  throughputKbps: Math.round(s.throughputKbps + 12),
                };
              });

              if (pkt.protocol === 'TCP') {
                setTcpDelivered((d) => d + 1);

                // Return ACK vehicle traveling back from destination server to client (Requirement 8 & 9)
                if (!pkt.isAck) {
                  const ackPacket: SimulationPacket = {
                    id: `ACK-${pkt.id.replace('#', '')}`,
                    protocol: 'TCP',
                    sourceId: reachedNodeId,
                    targetId: pkt.sourceId,
                    path: [...pkt.path].reverse(),
                    currentPathIndex: 0,
                    progress: 0,
                    speed: Math.min(0.08, pkt.speed * 1.5), // Fast lightweight return receipt
                    status: 'ack-in-transit',
                    sequenceNumber: pkt.sequenceNumber,
                    sizeBytes: 64,
                    createdAt: Date.now(),
                    elapsedMs: 0,
                    hops: [{ nodeId: reachedNodeId, timeMs: updatedElapsed }],
                    isAck: true,
                    retryCount: 0,
                    color: '#10B981',
                  };
                  nextPackets.push(ackPacket);
                }
              } else {
                setUdpDelivered((d) => d + 1);
              }
            } else {
              // Intermediate intersection reached
              const hoppingPkt: SimulationPacket = {
                ...pkt,
                currentPathIndex: nextHopIndex,
                progress: 0,
                elapsedMs: updatedElapsed,
                hops: [...pkt.hops, { nodeId: reachedNodeId, timeMs: updatedElapsed }],
              };
              nextPackets.push(hoppingPkt);
              setPacketHistory((hist) =>
                hist.map((h) =>
                  h.id === pkt.id
                    ? {
                        ...h,
                        currentPathIndex: nextHopIndex,
                        hops: [...pkt.hops, { nodeId: reachedNodeId, timeMs: updatedElapsed }],
                      }
                    : h
                )
              );

              // Increment router processed count
              setNodes((prevNodes) =>
                prevNodes.map((n) =>
                  n.id === reachedNodeId ? { ...n, processedCount: n.processedCount + 1 } : n
                )
              );
            }
          } else {
            nextPackets.push({
              ...pkt,
              progress: newProgress,
              elapsedMs: updatedElapsed,
            });
          }
        }

        return nextPackets;
      });

      // Update link vehicle counts & loads
      setLinks((prevLinks) =>
        prevLinks.map((link) => {
          if (link.failed) {
            return { ...link, currentLoad: 100, vehiclesOnRoad: 0, status: 'failed' };
          }
          const vehicles = packets.filter((p) => {
            const u = p.path[p.currentPathIndex];
            const v = p.path[p.currentPathIndex + 1];
            return (
              (link.source === u && link.target === v) ||
              (link.source === v && link.target === u)
            );
          }).length;

          const rawLoad = Math.min(
            100,
            Math.round((vehicles * 18 * congestionMultiplier) / bandwidthMultiplier)
          );
          let status: NetworkLink['status'] = 'normal';
          if (rawLoad >= 90) status = 'congested';
          else if (rawLoad >= 70) status = 'heavy';
          else if (rawLoad >= 40) status = 'busy';

          return {
            ...link,
            vehiclesOnRoad: vehicles,
            currentLoad: Math.max(8, rawLoad),
            status,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, nodes, links, packets, lossRate, congestionMultiplier, bandwidthMultiplier, routingMode, logIncident]);

  // Spawner timer based on packetRate
  useEffect(() => {
    if (!isRunning) return;
    const intervalMs = Math.max(120, Math.round(1000 / packetRate));
    const timer = setInterval(() => {
      spawnPacket();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isRunning, packetRate, spawnPacket]);

  // Telemetry buffer update every 1 second (tracks all 8 chart parameters)
  useEffect(() => {
    const timer = setInterval(() => {
      const hScore = computeHealthScore();
      const avgLoad =
        links.reduce((acc, l) => acc + (l.failed ? 100 : l.currentLoad), 0) / (links.length || 1);
      const curLoss = stats.generated > 0 ? (stats.lost / stats.generated) * 100 : 0;

      const activeRouteEval = evaluateRouteDetails(
        findRouteDijkstra(nodes, links, 'C-A', 'S-A', routingMode)?.path || ['C-A', 'R1', 'R3', 'S-A'],
        nodes,
        links
      );

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      setHistory((prev) => [
        ...prev.slice(-19),
        {
          timestamp: timeStr,
          throughput: Math.max(50, stats.throughputKbps),
          avgDelay: Math.max(10, stats.avgDelayMs),
          lossRate: Math.round(curLoss),
          congestion: Math.round(avgLoad),
          health: hScore,
          routingCost: activeRouteEval.viable ? activeRouteEval.totalCost : 99,
          tcpCount: tcpTotal,
          udpCount: udpTotal,
        },
      ]);

      // Decay throughput smoothly if no packets arriving
      setStats((s) => ({
        ...s,
        throughputKbps: Math.max(40, Math.round(s.throughputKbps * 0.95)),
        failedRoutersCount: nodes.filter((n) => n.role === 'router' && n.status === 'failed').length,
        failedLinksCount: links.filter((l) => l.failed).length,
        currentCongestionScore: Math.round(avgLoad),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [computeHealthScore, links, nodes, stats.generated, stats.lost, stats.throughputKbps, stats.avgDelayMs, routingMode, tcpTotal, udpTotal]);

  const activePathResult = findRouteDijkstra(nodes, links, 'C-A', 'S-A', routingMode);
  const activePath = activePathResult ? activePathResult.path : null;
  const currentHealth = computeHealthScore();

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#2D3142] flex flex-col font-serif selection:bg-[#DCEBFA]">
      {/* Fullscreen Opening Intro Animation */}
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRunning={isRunning}
        onToggleRunning={() => setIsRunning(!isRunning)}
        onReset={handleReset}
        healthScore={currentHealth}
        protocol={protocol}
        routingMode={routingMode}
        onOpenLearningModal={() => setLearningModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Live Metrics Cards (Always visible on City & Controls) */}
        {(activeTab === 'city' || activeTab === 'controls') && (
          <MetricCards stats={stats} />
        )}

        {/* Live Incident Flow Transition Banner (Visible on City & Controls when incident occurs) */}
        {(activeTab === 'city' || activeTab === 'controls') && incidentFlow.active && (
          <IncidentFlowBanner flowState={incidentFlow} />
        )}

        {/* TAB 1: CITY VIEW (Centerpiece) */}
        {activeTab === 'city' && (
          <div className="space-y-6">
            <CityMap
              nodes={nodes}
              links={links}
              packets={packets}
              selectedNodeId={selectedNodeId}
              onSelectNode={(id) => setSelectedNodeId(id)}
              selectedLinkId={selectedLinkId}
              onSelectLink={(id) => setSelectedLinkId(id)}
              onToggleNodeFail={handleToggleNodeFail}
              onToggleLinkFail={handleToggleLinkFail}
              activePath={activePath}
              protocol={protocol}
            />

            {/* Protocol Comparison & Live Demo Banner */}
            <ProtocolComparisonBanner
              onRunTcpDemo={handleRunTcpDemo}
              onRunUdpDemo={handleRunUdpDemo}
              activeProtocol={protocol}
            />

            {/* Bottom Row: Route Comparison & Incident Timeline & Health Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <RouteComparisonPanel
                  nodes={nodes}
                  links={links}
                  routingMode={routingMode}
                  sourceNodeId="C-A"
                  targetNodeId="S-A"
                />
              </div>

              <div className="lg:col-span-4">
                <IncidentTimeline
                  incidents={incidents}
                  onReplayIncidents={handleReplayIncident}
                  onClearIncidents={() => setIncidents([])}
                />
              </div>

              <div className="lg:col-span-3">
                <HealthScore score={currentHealth} stats={stats} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PACKET EXPLORER (Uses persistent packetHistory so packets never vanish) */}
        {activeTab === 'explorer' && (
          <PacketExplorer
            packets={packetHistory.length > 0 ? packetHistory : packets}
            selectedPacketId={selectedPacketId}
            onSelectPacket={(id) => setSelectedPacketId(id)}
          />
        )}

        {/* TAB 3: TRAFFIC CONTROL PANEL */}
        {activeTab === 'controls' && (
          <div className="space-y-6">
            <TrafficControls
              isRunning={isRunning}
              onStartSimulation={() => setIsRunning(true)}
              onPauseSimulation={() => setIsRunning(false)}
              packetRate={packetRate}
              onChangePacketRate={(val) => setPacketRate(val)}
              lossRate={lossRate}
              onChangeLossRate={(val) => setLossRate(val)}
              congestionMultiplier={congestionMultiplier}
              onChangeCongestion={(val) => setCongestionMultiplier(val)}
              bandwidthMultiplier={bandwidthMultiplier}
              onChangeBandwidth={(val) => setBandwidthMultiplier(val)}
              baseLatencyMultiplier={baseLatencyMultiplier}
              onChangeBaseLatency={(val) => setBaseLatencyMultiplier(val)}
              burstPacketCount={burstPacketCount}
              onChangeBurstPacketCount={(val) => setBurstPacketCount(val)}
              protocol={protocol}
              onChangeProtocol={(p) => setProtocol(p)}
              routingMode={routingMode}
              onChangeRoutingMode={(m) => setRoutingMode(m)}
              onGenerateTraffic={() => handleBurstTraffic()}
              onCreateCongestion={handleTriggerCongestionSpike}
              onFailRouter={() => handleToggleNodeFail('R3')}
              onFailLink={() => handleToggleLinkFail('R1_R3')}
              onRestoreNetwork={handleRestoreAll}
              onReset={handleReset}
            />

            {/* Also render compact city view underneath controls for instant feedback */}
            <CityMap
              nodes={nodes}
              links={links}
              packets={packets}
              selectedNodeId={selectedNodeId}
              onSelectNode={(id) => setSelectedNodeId(id)}
              selectedLinkId={selectedLinkId}
              onSelectLink={(id) => setSelectedLinkId(id)}
              onToggleNodeFail={handleToggleNodeFail}
              onToggleLinkFail={handleToggleLinkFail}
              activePath={activePath}
              protocol={protocol}
            />
          </div>
        )}

        {/* TAB 4: ANALYTICS (All 8 spec charts) */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            history={history}
            links={links}
            stats={stats}
            tcpTotal={tcpTotal}
            udpTotal={udpTotal}
            tcpDelivered={tcpDelivered}
            udpDelivered={udpDelivered}
          />
        )}

        {/* TAB 5: SIMULATION LAB */}
        {activeTab === 'lab' && (
          <SimulationLab
            onApplyScenario={handleApplyScenario}
            currentStats={stats}
            onNavigateToCity={() => setActiveTab('city')}
          />
        )}

        {/* TAB 6: ABOUT */}
        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Educational Modal */}
      <LearningModal
        isOpen={learningModalOpen}
        onClose={() => setLearningModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-[#EAEFF5] bg-white/70 text-center text-xs text-[#7A8398]">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>Netropolis — Educational Computer Networks Interactive Simulation</span>
          <span className="italic">“Visualizing Computer Network Traffic as an Intelligent City”</span>
        </div>
      </footer>
    </div>
  );
}
