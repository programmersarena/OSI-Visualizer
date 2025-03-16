import { exec } from "child_process";

export async function getTracerouteHops(domain) {
    return new Promise((resolve) => {
        const command = process.platform === "win32" ? `tracert -d -h 30 ${domain}` : `traceroute -n -m 30 ${domain}`;

        exec(command, (error, stdout) => {
            if (error) return resolve({ hopCount: "Traceroute failed", hopIPs: [] });

            const hopLines = stdout.split("\n").filter((line) => line.match(/^\s*\d+/));
            const hopIPs = hopLines.map((line) => {
                const match = line.match(/(\d+\.\d+\.\d+\.\d+)/);
                return match ? match[1] : "Unknown";
            });

            resolve({ hopCount: hopIPs.length, hopIPs });
        });
    });
}
