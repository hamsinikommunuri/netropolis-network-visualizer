%% Netropolis: Master Simulation Runner
% Executes all 5 academic computer network experiments sequentially.

clear; clc; close all;

fprintf('========================================================\n');
fprintf('   NETROPOLIS MATLAB NETWORK ANALYSIS SUITE\n');
fprintf('   "Visualizing Computer Network Traffic as an Intelligent City"\n');
fprintf('========================================================\n\n');

try
    latency_vs_traffic;
    fprintf('  [PASS] Experiment 1 Completed.\n\n');
    
    packet_loss_vs_congestion;
    fprintf('  [PASS] Experiment 2 Completed.\n\n');
    
    throughput_vs_offered_load;
    fprintf('  [PASS] Experiment 3 Completed.\n\n');
    
    congestion_aware_routing_comparison;
    fprintf('  [PASS] Experiment 4 Completed.\n\n');
    
    node_failure_recovery_analysis;
    fprintf('  [PASS] Experiment 5 Completed.\n\n');
    
    fprintf('========================================================\n');
    fprintf('   ALL SIMULATIONS SUCCESSFULLY EXECUTED\n');
    fprintf('   Generated PNG figures in current directory.\n');
    fprintf('========================================================\n');
catch ME
    fprintf('Simulation halted with error: %s\n', ME.message);
end
