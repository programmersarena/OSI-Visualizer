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
        const { domain } = extractUrlDetails(domainUrl);
        const { address } = await dns.lookup(domain);
        return { ip: address };
    } catch (err) {
        throw new Error(`DNS Lookup Failed: ${err.message}`);
    }
}

export function extractUrlDetails(domainUrl) {
    const url = new URL(domainUrl.startsWith("http") ? domainUrl : `https://${domainUrl}`);
    return {
        protocol: url.protocol.replace(":", ""), // Remove ":" from "https:"
        domain: url.hostname,
        path: url.pathname || "/",
    };
}