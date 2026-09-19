import java.io.*;
import java.net.*;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Netropolis Academic Demo - TCP Server
 * 
 * Demonstrates reliable connection-oriented transport protocol (TCP)
 * using standard Java ServerSocket and Socket APIs.
 * 
 * In Netropolis, this represents a destination Data Center Server
 * (Server Alpha / Server Beta) accepting vehicle delivery connections
 * and issuing ACK confirmation receipts back to residential clients.
 */
public class TCPServer {
    private static final int PORT = 9090;

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   NETROPOLIS - TCP SERVER (Server Alpha)");
        System.out.println("   Listening on Port: " + PORT);
        System.out.println("   Representing Destination Building / Data Center");
        System.out.println("==================================================");

        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("[READY] Waiting for TCP connection from client vehicle...");

            while (true) {
                try (Socket clientSocket = serverSocket.accept()) {
                    String clientIP = clientSocket.getInetAddress().getHostAddress();
                    int clientPort = clientSocket.getPort();
                    String time = new SimpleDateFormat("HH:mm:ss.SSS").format(new Date());

                    System.out.println("\n[" + time + "] Handshake complete. Connected to Client: " + clientIP + ":" + clientPort);

                    BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                    PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);

                    String line;
                    int packetsReceived = 0;
                    while ((line = in.readLine()) != null) {
                        packetsReceived++;
                        System.out.println("  -> [RECV] Packet payload: " + line);

                        // Simulated processing delay in server queue
                        Thread.sleep(15);

                        // Respond with TCP ACK receipt
                        String ackMessage = "ACK: Seq=" + packetsReceived + " PayloadLen=" + line.length() + " Status=DELIVERED";
                        out.println(ackMessage);
                        System.out.println("  <- [SENT ACK] " + ackMessage);
                    }

                    System.out.println("[" + time + "] Connection closed cleanly. Total packets processed: " + packetsReceived);
                } catch (Exception e) {
                    System.err.println("[ERROR] Client processing error: " + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("[FATAL] Could not start TCP Server on port " + PORT + ": " + e.getMessage());
        }
    }
}
