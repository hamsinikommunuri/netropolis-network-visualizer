%% Netropolis: Latency vs Traffic Load Experiment
% Analyzes end-to-end latency as offered load increases using
% M/M/1 queuing theory (Kleinrock's formula):
%   Total Delay = Propagation Delay + Transmission Delay + Queuing Delay
%   Queuing Delay = 1 / (mu * C - lambda)

clear; clc; close all;

fprintf('Running Experiment 1: Latency vs Traffic Load...\n');

% Network link parameters (Netropolis Grand Metro Highway R1-R3)
C = 2500 * 1e6;       % Capacity in bits/sec (2500 Mbps)
avg_packet_size = 1024 * 8; % Bits per packet (1024 bytes)
mu = 1 / avg_packet_size;   % Packets per bit
prop_delay_ms = 6.0;        % Physical road propagation latency (ms)

% Offered load range (0 to 95% utilization)
utilization = linspace(0.05, 0.95, 100);
max_capacity_pps = (C * mu); % Maximum capacity in packets per second
lambda = utilization * max_capacity_pps;

% Queuing delay calculation (M/M/1 queue model)
service_rate = max_capacity_pps;
queuing_delay_sec = 1 ./ (service_rate - lambda);
queuing_delay_ms = queuing_delay_sec * 1000;

% Total nodal delay
total_delay_ms = prop_delay_ms + queuing_delay_ms;

% Generate Plot
figure('Color', [0.98, 0.98, 0.99], 'Name', 'Netropolis - Latency vs Traffic Load');
plot(utilization * 100, total_delay_ms, 'LineWidth', 2.2, 'Color', [0.29, 0.50, 0.72]);
grid on;
set(gca, 'FontName', 'Times New Roman', 'FontSize', 11);
xlabel('Network Roadway Utilization \rho (%)', 'FontSize', 12, 'FontWeight', 'bold');
ylabel('End-to-End Travel Latency (ms)', 'FontSize', 12, 'FontWeight', 'bold');
title('Netropolis: Latency Escalation under Heavy Traffic (M/M/1 Model)', 'FontSize', 13);
xlim([0, 100]);

% Annotate Knee of the Curve
xline(70, '--', 'Heavy Congestion Threshold (70%)', 'Color', [0.92, 0.53, 0.14], 'LineWidth', 1.5, 'LabelVerticalAlignment', 'bottom');
xline(90, '--', 'Gridlock Threshold (90%)', 'Color', [0.88, 0.12, 0.28], 'LineWidth', 1.5, 'LabelVerticalAlignment', 'bottom');

saveas(gcf, 'plot_latency_vs_traffic.png');
fprintf('Saved figure: plot_latency_vs_traffic.png\n');
