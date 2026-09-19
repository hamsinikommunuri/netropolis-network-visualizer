import java.net.*;

/**
 * Netropolis Academic Demo - UDP Client
 * 
 * Demonstrates high-speed best-effort transmission without connection setup
 * or retransmissions.
 * 
 * In Netropolis, this represents Meadow Villa (Client B) dispatching
 * fast sports car packets towards Server Beta.
 */
public class UDPClient {
    private static final String HOST = "127.0.0.1";
    private static final int PORT = 9091;
    private static final int PACKET_COUNT = 5;

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   NETROPOLIS - UDP CLIENT (Meadow Villa / Client B)");
        System.out.println("   Target Destination: " + HOST + ":" + PORT);
        System.out.println("==================================================");

        try (DatagramSocket socket = new DatagramSocket()) {
            InetAddress address = InetAddress.getByName(HOST);

            System.out.println("[READY] No Handshake Needed. Dispatching UDP datagrams...\n");

            for (int i = 1; i <= PACKET_COUNT; i++) {
                String payload = "NETROPOLIS_UDP#P" + (2000 + i) + " [SRC:Client-B DST:Server-Beta SEQ:" + i + " LEN:512B VIDEO_STREAM]";
                byte[] data = payload.getBytes();

                DatagramPacket packet = new DatagramPacket(data, data.length, address, PORT);
                long sendTime = System.currentTimeMillis();
                socket.send(packet);

                System.out.println("--> Dispatched Fast UDP Datagram #" + i + " (" + data.length + " bytes) at " + sendTime + " ms");

                Thread.sleep(150); // High-frequency streaming rate
            }

            System.out.println("\n--------------------------------------------------");
            System.out.println("UDP TRANSMISSION SUMMARY:");
            System.out.println("  Packets Dispatched: " + PACKET_COUNT);
            System.out.println("  Connection State:   Connectionless (Best Effort)");
            System.out.println("  Retransmissions:    0 (None in UDP)");
            System.out.println("  Handshake Overhead: 0 ms");
            System.out.println("--------------------------------------------------");

        } catch (Exception e) {
            System.err.println("[ERROR] UDP Client error: " + e.getMessage());
        }
    }
}
