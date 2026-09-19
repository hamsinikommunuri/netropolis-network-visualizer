import java.net.*;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Netropolis Academic Demo - UDP Server
 * 
 * Demonstrates connectionless, low-overhead datagram reception using
 * standard Java DatagramSocket and DatagramPacket APIs.
 * 
 * In Netropolis, this represents Streaming Vault (Server Beta) receiving
 * fast sports courier vehicles without handshake or ACK overhead.
 */
public class UDPServer {
    private static final int PORT = 9091;
    private static final int BUFFER_SIZE = 1024;

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   NETROPOLIS - UDP SERVER (Streaming Vault / Server Beta)");
        System.out.println("   Listening on UDP Port: " + PORT);
        System.out.println("   Connectionless Datagram Receiver");
        System.out.println("==================================================");

        try (DatagramSocket socket = new DatagramSocket(PORT)) {
            byte[] buffer = new byte[BUFFER_SIZE];
            int packetsReceived = 0;

            System.out.println("[READY] Listening for UDP datagram vehicles...\n");

            while (true) {
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                socket.receive(packet); // Blocking receive

                packetsReceived++;
                String time = new SimpleDateFormat("HH:mm:ss.SSS").format(new Date());
                String message = new String(packet.getData(), 0, packet.getLength());
                String senderAddress = packet.getAddress().getHostAddress() + ":" + packet.getPort();

                System.out.println("[" + time + "] (Datagram #" + packetsReceived + ") Received from " + senderAddress);
                System.out.println("  -> Content: " + message);
                System.out.println("  -> Size: " + packet.getLength() + " bytes | No ACK sent (UDP)\n");
            }
        } catch (Exception e) {
            System.err.println("[ERROR] UDP Server error: " + e.getMessage());
        }
    }
}
