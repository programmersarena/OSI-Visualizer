import { exec } from "child_process";

export async function getTracerouteHops(domain) {
    return new Promise((resolve) => {
        const command = process.platform === "win32" ? `tracert -d -h 30 ${domain}` : `traceroute -n -m 30 ${domain}`;

        exec(command, (error, stdout) => {
            if (error) return resolve({ hopCount: "Traceroute failed", hopIPs: [] });

            // Match only IPv4 or IPv6 addresses, avoiding hop numbers
            const hopLines = stdout.split("\n").filter((line) => line.match(/^\s*\d+/));
            const hopIPs = hopLines.map((line) => {
                const match = line.match(/([0-9a-fA-F:.]+(?:\.[0-9a-fA-F]+)?)/g); // Matches valid IPs
                return match ? match.find(ip => ip.includes(":") || ip.includes(".")) || "Unknown" : "Unknown";
            });

            resolve({ hopCount: hopIPs.length, hopIPs });
        });
    });
}
