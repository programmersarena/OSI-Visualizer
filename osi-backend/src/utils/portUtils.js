import net from "net";

export async function getPortStatus(host) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(2000);
        socket.on("connect", () => {
            resolve("Port 443 (HTTPS) Open");
            socket.destroy();
        });
        socket.on("error", () => resolve("Port 443 Closed"));
        socket.on("timeout", () => resolve("Port 443 Timeout"));
        socket.connect(443, host);
    });
}
