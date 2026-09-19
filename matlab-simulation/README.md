# Netropolis — MATLAB Network Simulation & Analysis Suite

This directory contains analytical mathematical models and network simulation scripts in **MATLAB / GNU Octave** accompanying the **Netropolis** computer networks educational platform.

---

## 🔬 Theoretical Formulations & Experiments

### 1. `latency_vs_traffic.m` — Queuing Delay Modeling
- **Theoretical Basis**: Kleinrock Independence Approximation and $M/M/1$ Queuing Network:
  $$d_{\text{queue}} = \frac{1}{\mu C - \lambda}$$
- Demonstrates the sharp non-linear latency knee when roadway link utilization $\rho = \frac{\lambda}{\mu C}$ crosses 70% and 90%.

### 2. `packet_loss_vs_congestion.m` — Finite Buffer Overflow
- **Theoretical Basis**: $M/M/1/K$ Erlang Loss System with buffer capacity $K$:
  $$P_{\text{loss}} = \frac{(1 - \rho)\rho^K}{1 - \rho^{K+1}}$$
- Analyzes vehicle loss probabilities for buffer depths $K = 15, 30, 50$ packets.

### 3. `throughput_vs_offered_load.m` — Transport Protocols (TCP vs UDP)
- Analyzes TCP Reno AIMD (Additive Increase Multiplicative Decrease) steady-state throughput hovering at bottleneck link capacity versus uncontrolled UDP transmission leading to buffer saturation.

### 4. `congestion_aware_routing_comparison.m` — Dynamic Cost Routing
- Models Netropolis dynamic routing cost function:
  $$\text{Cost}(e) = \text{BaseLatency}(e) + \alpha \cdot \left(\frac{\text{Load}(e)}{\text{Capacity}(e)}\right)^{2.5} + \beta \cdot \text{LossRate}(e)$$
- Illustrates the crossover point where taking the 4-hop northern detour (Highland Expressway) becomes mathematically superior to the congested 3-hop Grand Metro Highway.

### 5. `node_failure_recovery_analysis.m` — Fault Tolerance & Convergence
- Simulates transient packet drop and recovery time during core router $R3$ crash and subsequent link-state recalculation.

---

## 💻 Running the Scripts

### In MATLAB:
1. Open MATLAB and navigate to this folder:
   ```matlab
   cd matlab-simulation
   ```
2. Run the master suite:
   ```matlab
   run_all_simulations
   ```
3. Or run any individual experiment:
   ```matlab
   latency_vs_traffic
   ```

### In GNU Octave (Open-Source):
```bash
octave --no-gui run_all_simulations.m
```
Generated high-resolution `.png` plots will be saved in the directory for inclusion in lab reports or thesis slides.
