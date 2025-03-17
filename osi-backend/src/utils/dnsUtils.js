import dns from "node:dns/promises";
import { URL } from "url";

export async function getIPAddress(domain) {
    try {
        const { address } = await dns.lookup(domain);
        return address;
    } catch (err) {
        throw new Error(`DNS Lookup Failed: ${err.message}`);
    }
}

export async function getDomainDetails(domainUrl) {
    try {
        // Parse the URL to get protocol, domain, and path
        const url = new URL(domainUrl.startsWith("http") ? domainUrl : `https://${domainUrl}`);
        const protocol = url.protocol.replace(":", ""); // Remove ':' from 'https:'
        const domain = url.hostname;
        const path = url.pathname || "/";

        // Perform DNS lookup
        const { address } = await dns.lookup(domain);

        return { ip: address, protocol, domain, path };
    } catch (err) {
        throw new Error(`DNS Lookup Failed: ${err.message}`);
    }
}