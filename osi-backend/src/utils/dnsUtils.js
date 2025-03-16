import dns from "node:dns/promises";

export async function getIPAddress(domain) {
    try {
        const { address } = await dns.lookup(domain);
        return address;
    } catch (err) {
        throw new Error(`DNS Lookup Failed: ${err.message}`);
    }
}
