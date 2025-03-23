import fetch from "node-fetch";
import axios from "axios";

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

export const getHttpRequestHeaders = async (url) => {
    try {
        // Make a request to the given URL
        const response = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        // Build the request headers in a readable format
        return [
            `GET / HTTP/1.1`,
            `Host: ${new URL(url).hostname}`,
            `User-Agent: Mozilla/5.0`,
            `Accept: ${response.config.headers.Accept || "*/*"}`,
            `Accept-Language: en-US,en;q=0.5`,
            `Accept-Encoding: gzip, deflate, br`,
            `Connection: keep-alive`,
        ];
    } catch (error) {
        console.log("hi",error);
        throw new Error("Failed to fetch request headers");
    }
};


