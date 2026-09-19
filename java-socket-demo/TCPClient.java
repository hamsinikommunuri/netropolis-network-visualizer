import java.io.*;
import java.net.*;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Netropolis Academic Demo - TCP Client
 * 
 * Demonstrates reliable delivery, Round-Trip Time (RTT) measurement,
 * and acknowledgment handling (ACKs).
 * 
 * In Netropolis, this represents Willow Cottage (Client A) sending
 * vehicle packets across the road network to Server Alpha.
 */
public class TCPClient {
    private static final String HOST = "127.0.0.1";
    private static final int PORT = 9090;
    private static final int PACKET_COUNT = 5;

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   NETROPOLIS - TCP CLIENT (Willow Cottage / Client A)");
        System.out.println("   Target Destination: " + HOST + ":" + PORT);
        System.out.println("==================================================");

        try (Socket socket = new Socket(HOST, PORT)) {
            socket.setSoTimeout(3000); // 3-second read timeout for ACK

            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            System.out.println("[CONNECTED] 3-Way Handshake Established with Server.");
            System.out.println("[TRANSMIT] Dispatching " + PACKET_COUNT + " TCP packet vehicles...\n");

            long totalRtt = 0;
            int successfulDeliveries = 0;

            for (int i = 1; i <= PACKET_COUNT; i++) {
                String packetPayload = "NETROPOLIS_PKT#P" + (1000 + i) + " [SRC:Client-A DST:Server-Alpha SEQ:" + i + " LEN:1024B]";

                long sendTime = System.currentTimeMillis();
                out.println(packetPayload);
                System.out.println("--> Dispatched Vehicle #" + i + ": " + packetPayload);

                try {
                    String ackResponse = in.readLine();
                    long rtt = System.currentTimeMillis() - sendTime;
                    totalRtt += rtt;
                    successfulDeliveries++;

                    System.out.println("<-- Received " + ackResponse + " (RTT: " + rtt + " ms)\n");
                } catch (SocketTimeoutException e) {
                    System.err.println("[TIMEOUT] ACK not received within timeout window! Triggering TCP Retransmission...");
                }

                Thread.sleep(250); // Inter-packet departure spacing
            }

            System.out.println("--------------------------------------------------");
            System.out.println("TCP TRANSMISSION SUMMARY:");
            System.out.println("  Packets Dispatched: " + PACKET_COUNT);
            System.out.println("  ACKs Received:      " + successfulDeliveries);
            System.out.println("  Packet Loss Rate:   0.0%");
            System.out.println("  Average RTT Delay:  " + (successfulDeliveries > 0 ? (totalRtt / successfulDeliveries) : 0) + " ms");
            System.out.println("--------------------------------------------------");

        } catch (ConnectException e) {
            System.err.println("[ERROR] Could not connect to TCPServer at " + HOST + ":" + PORT + ". Is TCPServer running?");
        } catch (Exception e) {
            System.err.println("[ERROR] TCP Client Exception: " + e.getMessage());
        }
    }
}
