import fetch from "node-fetch";
export async function getEncodingDetails(url) {
    try {
        const response = await fetch(url, { method: "GET" });
        const contentType = response.headers.get("content-type");

        if (!contentType) {
            throw new Error("No Content-Type header found.");
        }

        const match = contentType.match(/charset=([\w-]+)/);
        return match ? match[1] : "Encoding not found";

    } catch (err) {
        throw new Error(`Encoding check failed: ${err.message}`);
    }
}
