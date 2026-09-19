%% Netropolis: Node Failure & Network Convergence Analysis
% Simulates network response before, during, and after core router R3 failure.
% Evaluates transient packet loss, route convergence delay, and steady-state recovery.

clear; clc; close all;

fprintf('Running Experiment 5: Node Failure Recovery Analysis...\n');

time_sec = 0:0.5:60; % 60-second observation timeline
failure_time = 20;   % R3 crashes at t = 20s
recovery_time = 42;  % R3 repaired at t = 42s

% Packet delivery percentage
delivery_rate = zeros(size(time_sec));
latency_ms = zeros(size(time_sec));

for i = 1:length(time_sec)
    t = time_sec(i);
    if t < failure_time
        % Normal steady state
        delivery_rate(i) = 98 + randn() * 1.2;
        latency_ms(i) = 22 + randn() * 1.5;
    elseif t >= failure_time && t < failure_time + 3.0
        % Transient convergence interval: In-flight packets lost, Dijkstra rerunning
        delivery_rate(i) = max(20, 98 - (t - failure_time) * 28);
        latency_ms(i) = 22 + (t - failure_time) * 25;
    elseif t >= failure_time + 3.0 && t < recovery_time
        % Alternate path (Route B) converged: higher physical distance, but reliable
        delivery_rate(i) = 95 + randn() * 1.5;
        latency_ms(i) = 31 + randn() * 2.0; % Slightly higher detour latency
    elseif t >= recovery_time && t < recovery_time + 2.0
        % Recovery convergence: re-stabilizing
        delivery_rate(i) = 96 + randn() * 1.0;
        latency_ms(i) = 25 + randn() * 1.5;
    else
        % Restored to primary shortest highway
        delivery_rate(i) = 98.5 + randn() * 0.8;
        latency_ms(i) = 22 + randn() * 1.2;
    end
end

figure('Color', [0.98, 0.98, 0.99], 'Name', 'Netropolis - Node Failure Dynamics', 'Position', [100, 100, 800, 500]);

subplot(2, 1, 1);
plot(time_sec, delivery_rate, 'LineWidth', 2.2, 'Color', [0.24, 0.55, 0.41]);
grid on;
set(gca, 'FontName', 'Times New Roman', 'FontSize', 10);
ylabel('Packet Delivery (%)', 'FontWeight', 'bold');
title('Netropolis: Fault Tolerance & Convergence During Router R3 Crash', 'FontSize', 12);
xline(failure_time, '--r', 'R3 Crash', 'LineWidth', 1.5);
xline(recovery_time, '--g', 'R3 Restored', 'LineWidth', 1.5);
ylim([0, 105]);

subplot(2, 1, 2);
plot(time_sec, latency_ms, 'LineWidth', 2.2, 'Color', [0.88, 0.42, 0.18]);
grid on;
set(gca, 'FontName', 'Times New Roman', 'FontSize', 10);
xlabel('Simulation Time (seconds)', 'FontWeight', 'bold');
ylabel('Latency (ms)', 'FontWeight', 'bold');
xline(failure_time, '--r', 'R3 Crash', 'LineWidth', 1.5);
xline(recovery_time, '--g', 'R3 Restored', 'LineWidth', 1.5);

saveas(gcf, 'plot_node_failure_recovery.png');
fprintf('Saved figure: plot_node_failure_recovery.png\n');
