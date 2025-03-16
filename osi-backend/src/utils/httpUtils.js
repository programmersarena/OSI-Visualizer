import fetch from "node-fetch";

export async function getHttpHeaders(url) {
    try {
        const response = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
        });
        return Object.fromEntries(response.headers.entries());
    } catch (error) {
        return `Failed to fetch headers: ${error.message}`;
    }
}
