import { RouterNode, NetworkLink, RoutingMode } from '@/types/network';

export interface RouteCostBreakdown {
  path: string[];
  baseCost: number;
  congestionPenalty: number;
  lossPenalty: number;
  totalCost: number;
  hops: number;
  viable: boolean;
  bottleneckLink?: string;
}

export function getLinkBetween(links: NetworkLink[], u: string, v: string): NetworkLink | undefined {
  return links.find(
    (link) =>
      (link.source === u && link.target === v) ||
      (link.source === v && link.target === u)
  );
}

export function computeLinkCost(
  link: NetworkLink,
  sourceNode: RouterNode | undefined,
  targetNode: RouterNode | undefined,
  mode: RoutingMode
): number {
  // If either node is failed or link is marked failed, edge is impassable
  if (link.failed || sourceNode?.status === 'failed' || targetNode?.status === 'failed') {
    return Infinity;
  }

  if (mode === 'shortest-path') {
    // Dijkstra based on standard link latency
    return Math.max(1, link.baseLatencyMs);
  }

  // Congestion-Aware: Cost = Base Latency + Non-linear Congestion Penalty + Loss Penalty
  const loadFactor = Math.min(100, Math.max(0, link.currentLoad)) / 100;
  // Non-linear M/M/1 queueing delay curve approximation
  const congestionPenalty = Math.pow(loadFactor, 2.5) * 55;
  const lossPenalty = link.packetLossRate * 150;

  return Math.round((link.baseLatencyMs + congestionPenalty + lossPenalty) * 10) / 10;
}

export function findRouteDijkstra(
  nodes: RouterNode[],
  links: NetworkLink[],
  startId: string,
  targetId: string,
  mode: RoutingMode
): { path: string[]; totalCost: number } | null {
  const nodeMap = new Map<string, RouterNode>(nodes.map((n) => [n.id, n]));
  const startNode = nodeMap.get(startId);
  const targetNode = nodeMap.get(targetId);

  if (!startNode || !targetNode) return null;
  if (startNode.status === 'failed' || targetNode.status === 'failed') return null;

  // Build adjacency list
  const adj = new Map<string, { neighbor: string; link: NetworkLink; weight: number }[]>();
  for (const n of nodes) {
    adj.set(n.id, []);
  }

  for (const link of links) {
    const u = link.source;
    const v = link.target;
    const nodeU = nodeMap.get(u);
    const nodeV = nodeMap.get(v);

    const weight = computeLinkCost(link, nodeU, nodeV, mode);

    if (weight < Infinity) {
      adj.get(u)?.push({ neighbor: v, link, weight });
      adj.get(v)?.push({ neighbor: u, link, weight });
    }
  }

  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  for (const n of nodes) {
    dist.set(n.id, Infinity);
    prev.set(n.id, null);
  }

  dist.set(startId, 0);

  while (visited.size < nodes.length) {
    // Pick unvisited node with minimum distance
    let minNode: string | null = null;
    let minDist = Infinity;

    for (const [id, d] of dist.entries()) {
      if (!visited.has(id) && d < minDist) {
        minDist = d;
        minNode = id;
      }
    }

    if (!minNode || minDist === Infinity) break;
    if (minNode === targetId) break;

    visited.add(minNode);

    const neighbors = adj.get(minNode) || [];
    for (const edge of neighbors) {
      if (visited.has(edge.neighbor)) continue;
      const alt = dist.get(minNode)! + edge.weight;
      if (alt < dist.get(edge.neighbor)!) {
        dist.set(edge.neighbor, alt);
        prev.set(edge.neighbor, minNode);
      }
    }
  }

  if (dist.get(targetId) === Infinity) {
    return null; // No route available
  }

  // Reconstruct path
  const path: string[] = [];
  let curr: string | null = targetId;
  while (curr !== null) {
    path.unshift(curr);
    curr = prev.get(curr) || null;
  }

  return {
    path,
    totalCost: Math.round(dist.get(targetId)! * 10) / 10,
  };
}

export function evaluateRouteDetails(
  path: string[],
  nodes: RouterNode[],
  links: NetworkLink[]
): RouteCostBreakdown {
  const nodeMap = new Map<string, RouterNode>(nodes.map((n) => [n.id, n]));
  let baseCost = 0;
  let congestionPenalty = 0;
  let lossPenalty = 0;
  let viable = true;
  let bottleneckLink: string | undefined = undefined;
  let maxLoad = -1;

  for (let i = 0; i < path.length - 1; i++) {
    const u = path[i];
    const v = path[i + 1];
    const nodeU = nodeMap.get(u);
    const nodeV = nodeMap.get(v);
    const link = getLinkBetween(links, u, v);

    if (!link || link.failed || nodeU?.status === 'failed' || nodeV?.status === 'failed') {
      viable = false;
      break;
    }

    baseCost += link.baseLatencyMs;
    const loadFactor = Math.min(100, Math.max(0, link.currentLoad)) / 100;
    const cPenalty = Math.pow(loadFactor, 2.5) * 55;
    const lPenalty = link.packetLossRate * 150;

    congestionPenalty += cPenalty;
    lossPenalty += lPenalty;

    if (link.currentLoad > maxLoad) {
      maxLoad = link.currentLoad;
      bottleneckLink = `${u} ↔ ${v} (${link.currentLoad}%)`;
    }
  }

  return {
    path,
    baseCost: Math.round(baseCost * 10) / 10,
    congestionPenalty: Math.round(congestionPenalty * 10) / 10,
    lossPenalty: Math.round(lossPenalty * 10) / 10,
    totalCost: viable
      ? Math.round((baseCost + congestionPenalty + lossPenalty) * 10) / 10
      : Infinity,
    hops: Math.max(0, path.length - 1),
    viable,
    bottleneckLink,
  };
}
