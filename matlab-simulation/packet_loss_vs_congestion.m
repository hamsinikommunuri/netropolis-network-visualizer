%% Netropolis: Packet Loss vs Congestion (M/M/1/K Finite Queue Model)
% Demonstrates how packet vehicle drop probability escalates when
% intersection buffer capacity K is bounded.

clear; clc; close all;

fprintf('Running Experiment 2: Packet Loss vs Congestion...\n');

% Router intersection queue capacity (K packets)
K_values = [15, 30, 50]; % Different buffer sizes
rho = linspace(0.4, 1.6, 120); % Traffic intensity (offered load / capacity)

figure('Color', [0.98, 0.98, 0.99], 'Name', 'Netropolis - Packet Loss vs Congestion');
hold on;
colors = [0.88, 0.12, 0.28; 0.92, 0.53, 0.14; 0.24, 0.55, 0.41];

for idx = 1:length(K_values)
    K = K_values(idx);
    % M/M/1/K blocking probability:
    % P_loss = ( (1 - rho) * rho^K ) / ( 1 - rho^(K+1) )
    P_loss = zeros(size(rho));
    for i = 1:length(rho)
        r = rho(i);
        if abs(r - 1.0) < 1e-4
            P_loss(i) = 1 / (K + 1);
        else
            P_loss(i) = ((1 - r) * (r^K)) / (1 - (r^(K + 1)));
        end
    end
    plot(rho, P_loss * 100, 'LineWidth', 2.2, 'Color', colors(idx, :), ...
        'DisplayName', sprintf('Intersection Buffer K = %d vehicles', K));
end

grid on;
set(gca, 'FontName', 'Times New Roman', 'FontSize', 11);
xlabel('Traffic Intensity Ratio \rho = \lambda / \mu', 'FontSize', 12, 'FontWeight', 'bold');
ylabel('Packet Drop Probability (%)', 'FontSize', 12, 'FontWeight', 'bold');
title('Netropolis: Vehicle Dropping (Packet Loss) under Buffer Overflow', 'FontSize', 13);
legend('Location', 'northwest');
ylim([0, 50]);

saveas(gcf, 'plot_packet_loss_vs_congestion.png');
fprintf('Saved figure: plot_packet_loss_vs_congestion.png\n');
