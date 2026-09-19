%% Netropolis: Throughput vs Offered Load (TCP Reno vs UDP)
% Compares TCP flow-controlled goodput against UDP raw load,
% demonstrating how TCP backs off under congestion while UDP causes
% buffer exhaustion and throughput degradation.

clear; clc; close all;

fprintf('Running Experiment 3: Throughput vs Offered Load...\n');

offered_load_mbps = linspace(10, 500, 100);
bottleneck_capacity = 250; % Mbps bottleneck link capacity

% UDP: Transmits without backoff; once load > capacity, delivered = capacity - drops
udp_throughput = zeros(size(offered_load_mbps));
for i = 1:length(offered_load_mbps)
    load = offered_load_mbps(i);
    if load <= bottleneck_capacity
        udp_throughput(i) = load;
    else
        % Overload causes severe queue drops and collision-like collapse
        udp_throughput(i) = bottleneck_capacity * (bottleneck_capacity / load)^0.3;
    end
end

% TCP Reno: Additive Increase Multiplicative Decrease (AIMD)
% Stabilizes right at bottleneck capacity without uncontrolled queue drop
tcp_throughput = zeros(size(offered_load_mbps));
for i = 1:length(offered_load_mbps)
    load = offered_load_mbps(i);
    if load <= bottleneck_capacity * 0.9
        tcp_throughput(i) = load * 0.95; % Protocol ACK overhead
    else
        % AIMD hovers efficiently around link capacity
        tcp_throughput(i) = bottleneck_capacity * 0.92;
    end
end

figure('Color', [0.98, 0.98, 0.99], 'Name', 'Netropolis - Throughput Comparison');
plot(offered_load_mbps, udp_throughput, '--', 'LineWidth', 2.2, 'Color', [0.88, 0.12, 0.28], 'DisplayName', 'UDP (Best Effort / No Flow Control)');
hold on;
plot(offered_load_mbps, tcp_throughput, '-', 'LineWidth', 2.4, 'Color', [0.23, 0.51, 0.96], 'DisplayName', 'TCP Reno (Congestion Control / AIMD)');
yline(bottleneck_capacity, ':', 'Bottleneck Link Capacity (250 Mbps)', 'Color', [0.4, 0.4, 0.4], 'LineWidth', 1.5);

grid on;
set(gca, 'FontName', 'Times New Roman', 'FontSize', 11);
xlabel('Offered Traffic Load (Mbps)', 'FontSize', 12, 'FontWeight', 'bold');
ylabel('Delivered Network Goodput (Mbps)', 'FontSize', 12, 'FontWeight', 'bold');
title('Netropolis: Transport Protocol Performance Under Load', 'FontSize', 13);
legend('Location', 'southeast');

saveas(gcf, 'plot_throughput_vs_load.png');
fprintf('Saved figure: plot_throughput_vs_load.png\n');
