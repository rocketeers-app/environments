package app.rocketeers;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

/** Plain JVM HTTP server on the JDK's own httpserver, so the jar carries no dependencies. */
public class Main {
    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
        byte[] page = readPage();

        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", port), 0);

        server.createContext("/", exchange -> {
            exchange.getResponseHeaders().add("Content-Type", "text/html; charset=utf-8");
            exchange.sendResponseHeaders(200, page.length);
            try (OutputStream body = exchange.getResponseBody()) {
                body.write(page);
            }
        });

        server.start();
        System.out.println("Listening on http://127.0.0.1:" + port);
    }

    private static byte[] readPage() throws IOException {
        try (InputStream in = Main.class.getResourceAsStream("/index.html")) {
            if (in == null) {
                throw new IOException("index.html is missing from the jar");
            }
            return in.readAllBytes();
        }
    }
}
