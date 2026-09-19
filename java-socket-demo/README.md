# Netropolis — Java Socket Programming Module

This directory contains standalone, standard Java networking programs demonstrating core Layer 4 Transport protocols (**TCP** and **UDP**) to accompany the **Netropolis** network visualization platform.

---

## 🏛️ Architecture & Relationship to Netropolis Web Simulator

- **Web Simulator**: High-performance browser-based animated city simulation visualizing network topology, routing algorithms (Dijkstra vs Congestion-Aware), queueing delays, and packet loss without requiring a persistent JVM runtime on the Vercel server.
- **Java Socket Module**: Standalone runnable laboratory module implementing standard Java sockets (`java.net.Socket`, `java.net.ServerSocket`, `java.net.DatagramSocket`, `java.net.DatagramPacket`) to demonstrate real socket programming as taught in undergraduate Computer Networks courses.

| Module File | Protocol | Netropolis Role | Characteristics |
| :--- | :--- | :--- | :--- |
| `TCPServer.java` | TCP | Server Alpha (Data Center) | Connection-oriented, issues explicit ACK receipts |
| `TCPClient.java` | TCP | Willow Cottage (Client A) | 3-Way Handshake, RTT measurement, ACK timeout handling |
| `UDPServer.java` | UDP | Server Beta (Streaming Vault) | Connectionless, receives datagrams with zero overhead |
| `UDPClient.java` | UDP | Meadow Villa (Client B) | Fire-and-forget streaming courier, no retransmission |

---

## 🚀 Compilation & Execution Instructions

### Prerequisites
- JDK 8 or higher (tested with OpenJDK 11, 17, 21).
- Terminal or PowerShell.

### Step 1: Compile All Java Files
```bash
cd java-socket-demo
javac *.java
```

### Step 2: Run TCP Experiment (Reliable Delivery)
Open two terminal windows:

**Terminal 1 (Server):**
```bash
java TCPServer
```
*Output:*
```
[READY] Waiting for TCP connection from client vehicle...
```

**Terminal 2 (Client):**
```bash
java TCPClient
```
*Output:*
```
[CONNECTED] 3-Way Handshake Established with Server.
--> Dispatched Vehicle #1: NETROPOLIS_PKT#P1001 [SRC:Client-A DST:Server-Alpha SEQ:1 LEN:1024B]
<-- Received ACK: Seq=1 PayloadLen=75 Status=DELIVERED (RTT: 18 ms)
...
TCP TRANSMISSION SUMMARY:
  Packets Dispatched: 5
  ACKs Received:      5
  Packet Loss Rate:   0.0%
```

---

### Step 3: Run UDP Experiment (Low-Overhead Streaming)
Open two terminal windows:

**Terminal 1 (Server):**
```bash
java UDPServer
```

**Terminal 2 (Client):**
```bash
java UDPClient
```
*Output:*
```
--> Dispatched Fast UDP Datagram #1 (81 bytes) at 1726723200100 ms
--> Dispatched Fast UDP Datagram #2 (81 bytes) at 1726723200250 ms
UDP TRANSMISSION SUMMARY:
  Packets Dispatched: 5
  Connection State:   Connectionless (Best Effort)
  Retransmissions:    0 (None in UDP)
```
