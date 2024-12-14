import axios from "axios";
import * as cheerio from 'cheerio';

export const urlPattern = /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g;

export async function scrapeUrl(url: string) {
    try {
        console.log("Attempting to scrape URL:", url);
        const response = await axios.get(url);
        console.log("Response received:", response.status);
        const $ = cheerio.load(response.data);
        return $;
    } catch (error) {
        console.error("Error occurred while scraping URL:", error.message);
        throw new Error("Error founddddd");
    }
} 