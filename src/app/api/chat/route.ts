// TODO: Implement the chat API with Groq and web scraping with Cheerio and Puppeteer
// Refer to the Next.js Docs on how to read the Request body: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// Refer to the Groq SDK here on how to use an LLM: https://www.npmjs.com/package/groq-sdk
// Refer to the Cheerio docs here on how to parse HTML: https://cheerio.js.org/docs/basics/loading
// Refer to Puppeteer docs here: https://pptr.dev/guides/what-is-puppeteer


import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import { getGroqResponse } from "@/app/utils/groqClient";
import { scrapeUrl, urlPattern } from "@/app/utils/scraper";
import { middleware } from "@/middleware"; 
import { checkAndSaveLinkToRedis } from "@/middleware"; // Adjust the path if necessary

// Initialize Groq with API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// [ADDED] Type definition for chat messages
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// Storage for conversation history
let conversationHistory: ChatMessage[] = [];




export async function POST(req: Request) {
  // Apply rate limiting middleware
  const rateLimitResponse = await middleware(req as any);
  if (rateLimitResponse) {
    return rateLimitResponse; // Return rate limit response if limit is exceeded
  }

  try {
    const { message } = await req.json();
    console.log("Message Received: ", message)
  
    // Store user's message in history
    conversationHistory.push({
      role: "user",
      content: message
    });

    // Check if URL is in user input
    const urlMatches = message.match(urlPattern);
    if (urlMatches) {
        console.log("URLs found:", urlMatches);
        for (const url of urlMatches) {
            try {
                const scrapedData = await scrapeUrl(url);
                const htmlContent = scrapedData.html();
                console.log("Scraped data:", htmlContent); 
                

                // Call checkAndSaveLinkToRedis with the URL
                await checkAndSaveLinkToRedis(url, { html: htmlContent });

            } catch (scrapeError: any) {
                console.error("Error scraping URL:", url, scrapeError.message);
            }
        }
    } else {
        console.log("No URLs found in the message.");
    }

    const result = await getGroqResponse(conversationHistory);
    return NextResponse.json (result)

  } catch (error: any) {
    console.error("Error processing message:", error.message);
    throw new Error("Error founddddd");
  }
}
