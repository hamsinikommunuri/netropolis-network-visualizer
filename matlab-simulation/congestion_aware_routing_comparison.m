%% Netropolis: Congestion-Aware Routing vs Shortest Path Comparison
% Compares static Dijkstra (based on base propagation latency)
% against Dynamic Congestion-Aware Routing with penalty function:
%   Cost(e) = BaseCost(e) + alpha * (Load(e) / Capacity(e))^2.5 + beta * LossRate(e)

clear; clc; close all;

fprintf('Running Experiment 4: Congestion-Aware Routing Comparison...\n');

% Simulation over 20 time steps with increasing background traffic on Route A
time_steps = 1:20;

% Route A: Direct Shortest Path (R1 -> R3 -> R5 -> Server Alpha)
base_cost_A = 13; % ms
load_A = min(98, 20 + time_steps * 4.2); % Surges from 24% to 98%
penalty_A = 55 * ((load_A / 100) .^ 2.5);
total_cost_A = base_cost_A + penalty_A;

% Route B: Northern Bypass (R1 -> R2 -> R5 -> Server Alpha)
base_cost_B = 23; % ms (higher physical distance)
load_B = 18 + sin(time_steps / 2) * 4; % Remains smooth around 18-22%
penalty_B = 55 * ((load_B / 100) .^ 2.5);
total_cost_B = base_cost_B + penalty_B;

figure('Color', [0.98, 0.98, 0.99], 'Name', 'Netropolis - Dynamic Routing Cost Comparison');
plot(time_steps, total_cost_A, '-o', 'LineWidth', 2.2, 'Color', [0.88, 0.12, 0.28], 'DisplayName', 'Route A: Shortest Path (Central Highway R3)');
hold on;
plot(time_steps, total_cost_B, '-s', 'LineWidth', 2.2, 'Color', [0.24, 0.55, 0.41], 'DisplayName', 'Route B: Congestion-Aware Detour (North Blvd R2)');

% Highlight crossover point
crossover_idx = find(total_cost_A > total_cost_B, 1);
if ~isempty(crossover_idx)
    xline(crossover_idx, '--', 'Congestion Reroute Triggered', 'Color', [0.23, 0.51, 0.96], 'LineWidth', 1.8);
    plot(crossover_idx, total_cost_B(crossover_idx), 'kp', 'MarkerSize', 12, 'MarkerFaceColor', [1.0, 0.8, 0.0]);
end

grid on;
set(gca, 'FontName', 'Times New Roman', 'FontSize', 11);
xlabel('Simulation Time Step (Traffic Growth Progression)', 'FontSize', 12, 'FontWeight', 'bold');
ylabel('Dynamic Routing Impedance Cost', 'FontSize', 12, 'FontWeight', 'bold');
title('Netropolis: Dynamic Detour Triggering under Corridor Congestion', 'FontSize', 13);
legend('Location', 'northwest');

saveas(gcf, 'plot_routing_comparison.png');
fprintf('Saved figure: plot_routing_comparison.png\n');
