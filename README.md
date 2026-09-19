# Netropolis — Visualizing Computer Network Traffic as an Intelligent City

> **Interactive Educational Computer Networks Simulation Platform**  
> Translating fundamental Layer 3 and Layer 4 computer networking mechanisms into an animated, intuitive smart city.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Java Sockets](https://img.shields.io/badge/Java_Sockets-Standard_API-orange?style=flat&logo=openjdk)](https://openjdk.org/)
[![MATLAB](https://img.shields.io/badge/MATLAB-M%2FM%2F1_Queuing_Analysis-red?style=flat&logo=mathworks)](https://www.mathworks.com/)

---

## 🌐 Live Website & Links

- **Production Deployment (Vercel)**: [https://netropolis-network-visualizer.vercel.app](https://netropolis-network-visualizer.vercel.app)
- **GitHub Repository**: [https://github.com/hamsinikommunuri/netropolis-network-visualizer](https://github.com/hamsinikommunuri/netropolis-network-visualizer)

---

## 🏙️ Overview

**Netropolis** is an interactive educational computer networks visualizer built for university-level computer network demonstrations, laboratories, and self-directed learning. 

Rather than viewing dry abstract node-link topology graphs, Netropolis renders a vibrant pastel city where data packets travel as delivery vans and high-speed sports cars, routers function as roundabouts and intersection towers, and network congestion manifests as visible traffic jams with non-linear queuing delays.

---

## 💡 Motivation

Computer networks education often suffers from high cognitive load when students transition between:
1. Mathematical queuing models ($M/M/1$ delay curves, Shannon capacity, packet loss probability).
2. Algorithmic shortest-path graph theory (Dijkstra vs Congestion-Aware dynamic metrics).
3. Protocol behavioral distinctions (TCP Reno reliable delivery with ACKs & RTOs vs connectionless UDP best-effort).
4. Physical topologies and link-state convergence during node or link failures.

Netropolis bridges this pedagogical divide by giving abstract packets physical velocity, tangible roads, observable buffer queues, and dynamic detours that make complex networking behavior instantly clear.

---

## ✨ Features

- **Full-Screen Narrative Intro Animation**: Smooth animated sequence illustrating a packet vehicle cruising down a network avenue, illuminating intersection roundabouts, and revealing the Netropolis identity.
- **Centerpiece City View**: 7 routers, 2 client residential endpoints, and 2 enterprise cloud server data centers rendered with pastel curbs, road markings, glowing signal towers, and live moving vehicles.
- **Dynamic Roadway Utilization States**:
  - `0–39%` (Normal): Mint Green (`#D8F3E5` / `#34A853`)
  - `40–69%` (Busy): Soft Yellow (`#FEF3C7` / `#D97706`)
  - `70–89%` (Heavy Load): Pastel Peach (`#FFE7D9` / `#EA580C`)
  - `90–100%` (Congested / Gridlock): Blush Pink / Crimson (`#FDE4EA` / `#E11D48`)
  - `Failed`: Muted Slate Gray with closed road construction barriers.
- **Transport Protocol Shootout (TCP vs UDP)**:
  - **TCP Mode**: Dispatches cute pastel blue delivery vans (`🚙`), enforces positive ACKs, measures RTT, and executes automatic retransmissions upon buffer exhaustion or link outages.
  - **UDP Mode**: Dispatches high-speed magenta sports racers (`🏎️`) with lower latency and zero connection overhead, where dropped packets vanish without retransmission.
- **Real-Time Traffic Modulation Control**:
  - Sliders for generation rate (1–15 pkts/s), roadway bandwidth multiplier (0.5x–2.5x), cross-traffic congestion (0.5x–3.0x), and artificial loss rate (0%–40%).
  - One-click incident injection: Burst Traffic, Spike Congestion, Crash R3 Hub, Sever Main Highway, and Full Network Restoration.
- **Intelligent GPS Navigation & Congestion-Aware Routing**:
  - Real-time comparison between Static Dijkstra (shortest physical latency) and Dynamic Congestion-Aware Routing ($C(e) = \text{Base} + \alpha \cdot \text{Load}^{2.5} + \beta \cdot \text{Loss}$).
  - Live route cost breakdown modal showing mathematical justification for chosen bypasses.
- **Packet Explorer**:
  - Microscopic frame inspector displaying Packet ID, Protocol headers, Sequence Number, Byte payload, Total elapsed transit time, and hop-by-hop latency timestamps.
- **Diagnostic Network Incident Timeline**:
  - Chronological audit trail logging topology modifications, queue build-ups, link-state reroutes, and network recoveries, with replay capability.
- **Circular Network Health Score**:
  - Real-time health gauge (0–100) factoring in node availability, link integrity, queue congestion, and packet loss rate.
- **Live Telemetry Analytics**:
  - Real-time Recharts visualizations for Throughput vs Time, End-to-End Latency vs Time, Packet Loss & Congestion Index, Link Utilization Bar Charts, and TCP vs UDP delivery rates.
- **Simulation Lab**:
  - 7 curated laboratory experimentation presets (Normal Baseline, Heavy Congestion, Core Router Crash, Severed Highway, High Loss Subnet, TCP vs UDP, and Congestion Detour Demonstration) with before/after metric deltas.
- **Educational Encyclopedia & Tooltips**:
  - Modal glossary explaining Routers, Packets, Bandwidth, Latency, Throughput, Packet Loss, TCP, UDP, Congestion, and $M/M/1$ Queuing.

---

## 🗺️ Network-to-City Metaphor Mapping

| Computer Network Concept | Netropolis Smart City Equivalent | Educational Meaning |
| :--- | :--- | :--- |
| **Data Packet (Frame)** | Delivery Vehicle / Sports Racer | Carries byte payload across network roads |
| **Router (Layer 3 Node)** | Intersection Roundabout / Signal Tower | Inspects destination IP and forwards vehicles |
| **Network Link (Physical Wire)** | City Roadway / Highway | Connects intersections with bandwidth limits |
| **Bandwidth (Capacity)** | Number of Lanes & Road Width | Maximum concurrent vehicles without queuing |
| **Congestion (Buffer Overflow)** | Traffic Jam / Gridlock | Traffic arrival rate exceeds link servicing |
| **Latency / Propagation Delay** | Commute & Transit Time | Road traversal time + intersection wait time |
| **Packet Loss (Drop)** | Broken-Down Vehicle / Impassable Road | Vehicle removed due to full intersection queue |
| **Routing Algorithm (OSPF / Dijkstra)** | GPS Navigation System | Computes quickest path based on road impedance |
| **Router Failure** | Closed Intersection Roundabout | Forces dynamic rerouting around blocked node |
| **Link Failure** | Road Closed Under Construction | Packets detour through alternate avenues |
| **TCP Retransmission** | Resending Lost Delivery Van | Sender re-dispatches vehicle after ACK timeout |
| **UDP Transmission** | Fast Courier Without Receipt | High-speed delivery with zero retry overhead |
| **Clients** | Willow Cottage & Meadow Villa | Residential endpoints originating data requests |
| **Servers** | Cloud Data Center & Streaming Vault | Enterprise facilities answering client queries |

---

## 🧮 Mathematical Formulations & Algorithms

### 1. Static Shortest Path (Dijkstra)
Finds the path minimizing cumulative baseline propagation latency:
$$\min \sum_{e \in \text{Path}} d_{\text{base}}(e)$$

### 2. Dynamic Congestion-Aware Routing Cost
Computes edge impedance using non-linear queuing penalty:
$$\text{Cost}(e) = d_{\text{base}}(e) + \alpha \cdot \left(\frac{\text{Load}(e)}{100}\right)^{2.5} + \beta \cdot P_{\text{loss}}(e)$$
Where:
- $d_{\text{base}}(e)$: Physical propagation delay in milliseconds.
- $\alpha = 55$: Congestion penalty multiplier approximating $M/M/1$ queue explosion.
- $\beta = 150$: Penalty factor for packet drop probability.

### 3. Network Health Score Formulation
$$\text{Health} = 100 - 20 \cdot N_{\text{failed\_routers}} - 10 \cdot L_{\text{failed\_links}} - 25 \cdot \left(\frac{\bar{\rho}}{100}\right) - 40 \cdot \left(\frac{P_{\text{dropped}}}{P_{\text{total}}}\right)$$
Clamped strictly to $[5, 100]$.

---

## 🛠️ Tech Stack & Architecture

- **Web Framework**: Next.js 14 (App Router) + React 18 + TypeScript 5
- **Styling**: Tailwind CSS with custom pastel design system (`#DCEBFA`, `#E8E4F3`, `#FDE4EA`, `#D8F3E5`, `#FFE7D9`, `#FEF3C7`)
- **Typography**: Strictly classical Times New Roman serif styling (`"Times New Roman", Times, serif`) as mandated.
- **Charts & Telemetry**: Recharts dynamic responsive area, line, and bar charts.
- **Icons**: Lucide React.
- **Standalone Java Module**: Pure Java Standard Networking APIs (`java.net.Socket`, `java.net.ServerSocket`, `java.net.DatagramSocket`, `java.net.DatagramPacket`).
- **Analytical Simulation Module**: MATLAB / GNU Octave mathematical queuing and failure scripts.

---

## 📁 Repository Structure

```
netropolis-network-visualizer/
├── src/
│   ├── app/
│   │   ├── globals.css                # Times New Roman & pastel design tokens
│   │   ├── layout.tsx                 # Root layout and metadata
│   │   └── page.tsx                   # Master simulation engine and page coordinator
│   ├── components/
│   │   ├── AboutView.tsx              # Educational concept mapping table & theory
│   │   ├── AnalyticsView.tsx          # Real-time Recharts performance charts
│   │   ├── CityMap.tsx                # Visual centerpiece: animated SVG smart city
│   │   ├── HealthScore.tsx            # Circular gauge network integrity meter
│   │   ├── IncidentTimeline.tsx       # Chronological diagnostic event logger
│   │   ├── IntroAnimation.tsx         # Narrative full-screen opening animation
│   │   ├── LearningModal.tsx          # Networking encyclopedia and glossary
│   │   ├── MetricCards.tsx            # Live telemetry statistics cards
│   │   ├── Navbar.tsx                 # Top navigation and health pill
│   │   ├── PacketExplorer.tsx         # Detailed packet frame inspector
│   │   ├── RouteComparisonPanel.tsx   # Dijkstra vs Congestion-Aware route math
│   │   ├── SimulationLab.tsx          # 7 preset experimentation scenarios
│   │   └── TrafficControls.tsx        # Sliders, toggles, and incident triggers
│   ├── lib/
│   │   ├── networkTopology.ts         # Initial nodes, coordinates, and road parameters
│   │   └── routing.ts                 # Dijkstra and dynamic cost calculations
│   └── types/
│       └── network.ts                 # TypeScript interfaces for nodes, links, and packets
├── java-socket-demo/                  # Standalone Java Networking Module
│   ├── TCPServer.java                 # Reliable server issuing ACKs
│   ├── TCPClient.java                 # Reliable client measuring RTT & timeout
│   ├── UDPServer.java                 # Fast connectionless datagram server
│   ├── UDPClient.java                 # High-frequency datagram client
│   └── README.md                      # Java compilation & execution guide
├── matlab-simulation/                 # MATLAB / Octave Queuing Models
│   ├── latency_vs_traffic.m           # M/M/1 queuing delay modeling
│   ├── packet_loss_vs_congestion.m    # M/M/1/K finite buffer drop analysis
│   ├── throughput_vs_offered_load.m   # TCP Reno AIMD vs UDP throughput
│   ├── congestion_aware_routing_comparison.m # Detour cost crossover analysis
│   ├── node_failure_recovery_analysis.m # Fault tolerance convergence dynamics
│   ├── run_all_simulations.m          # Master automated test suite runner
│   └── README.md                      # MATLAB execution & theory guide
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## ⚡ Local Setup

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/hamsinikommunuri/netropolis-network-visualizer.git
cd netropolis-network-visualizer
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## ☕ Java Socket Module Instructions

Navigate to the `java-socket-demo` directory and compile all classes:
```bash
cd java-socket-demo
javac *.java
```

### Run TCP Demonstration (Reliable Delivery):
- **Terminal 1**: `java TCPServer`
- **Terminal 2**: `java TCPClient`

### Run UDP Demonstration (Best-Effort Streaming):
- **Terminal 1**: `java UDPServer`
- **Terminal 2**: `java UDPClient`

Detailed explanations are available in [`java-socket-demo/README.md`](./java-socket-demo/README.md).

---

## 📊 MATLAB Simulation Instructions

Navigate to the `matlab-simulation` directory:
```bash
cd matlab-simulation
```
In MATLAB or GNU Octave, run:
```matlab
run_all_simulations
```
This executes all 5 theoretical network performance models and produces high-resolution PNG plots. Detailed explanations are available in [`matlab-simulation/README.md`](./matlab-simulation/README.md).

---

## 🚀 Deployment

The Netropolis web application is deployed to **Vercel** with continuous deployment from the GitHub repository:
- **Hosting Provider**: Vercel Edge Network
- **Production URL**: [https://netropolis-network-visualizer.vercel.app](https://netropolis-network-visualizer.vercel.app)
- **Framework**: Next.js 14 (Static & Serverless Hybrid)

---

## ⚠️ Limitations & Educational Simplifications

1. **Discrete Simulation Clock**: Packet movement and queue arrivals update at a 50 ms tick resolution rather than nanosecond-accurate packet arrival times found in discrete-event network emulators like ns-3.
2. **Simplified Sliding Window**: TCP window expansion is modeled as additive vehicle bursts rather than a full byte-level implementation of TCP SACK or Cubic state machines.
3. **Decoupled Java Backend**: The Java socket demos run standalone on local machines for educational experimentation and are intentionally decoupled from the hosted Vercel web frontend to ensure 100% serverless uptime without requiring long-lived TCP socket daemons.
4. **Synthetic Queue Buffers**: Router queue drop thresholds utilize approximated $M/M/1/K$ drop probabilities rather than emulating specific kernel socket buffer memory allocators.

---

## 🔭 Future Enhancements

- Support for customized user-drawn network topologies via drag-and-drop intersections.
- Interactive BGP (Border Gateway Protocol) multi-autonomous-system (multi-city) federation mode.
- Implementation of modern active queue management algorithms (e.g., CoDel / RED).
- WebAssembly-compiled packet capture exporter (`.pcap`) downloadable for Wireshark inspection.
