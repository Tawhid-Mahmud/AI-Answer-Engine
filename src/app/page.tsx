"use client";

import { useState } from "react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! How can I help you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message to the conversation
    const userMessage = { role: "user" as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);



    //handleScrape("https://webscraper.io/test-sites");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      // Check if the message contains a URL before calling handleScrape
      const urlPattern = /https?:\/\/[^\s]+/;
      if (urlPattern.test(message)) {
        const url = message.match(urlPattern)![0];
        //handleScrape(url);
      }

      // TODO: Handle the response from the chat API to display the AI response in the UI

      //@@NEWW Create an initial empty AI message to show where the response will appear
      setMessages(prev => [...prev, { role: "ai", content: "" }]);

      //NEWW Get a reader to handle the streaming response
      const reader = response.body?.getReader();
      if (!reader) return;

      //@@NEWW Setup decoder and response accumulator
      const decoder = new TextDecoder();
      let currentResponse = '';

      //@@NEWW Read and process the stream chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        //@@NEWW Convert chunk to text and accumulate
        const chunk = decoder.decode(value);
        currentResponse += chunk;

        //@@NEWW Update the AI message with accumulated response
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "ai",
            content: currentResponse
          };
          return newMessages;
        });
      }

//changes
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleScrape = async (urlToScrape: string) => {
  //   setIsLoading(true);
  //   console.log('Starting to scrape:', urlToScrape); // Debug log
  //   try {
  //     const response = await fetch("/api/webscraper", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ url: urlToScrape }),
  //     });

  //     const data = await response.json();
  //     console.log('Scraped data:', data); // Debug log

  //     setMessages(prev => [...prev, {
  //       role: "ai",
  //       content: `Scraped content from ${urlToScrape}: ${data.data}`
  //     }]);

  //   } catch (error: any) {
  //     console.error("Scraping error:", error);
  //     // Add error message to chat
  //     setMessages(prev => [...prev, {
  //       role: "ai",
  //       content: `Failed to scrape ${urlToScrape}: ${error.message}`
  //     }]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // TODO: Modify the color schemes, fonts, and UI as needed for a good user experience
  // Refer to the Tailwind CSS docs here: https://tailwindcss.com/docs/customizing-colors, and here: https://tailwindcss.com/docs/hover-focus-and-other-states
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="w-full bg-violet-950 border-b border-violet-100 p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold text-white">AI Answer Engine</h1>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto pb-32 pt-4">
        <div className="max-w-3xl mx-auto px-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-4 mb-4 ${
                msg.role === "ai"
                  ? "justify-start"
                  : "justify-end flex-row-reverse"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                  msg.role === "ai"
                    ? "bg-violet-950 border border-gray-600 text-gray-100"
                    : "bg-blue-500 text-white ml-auto"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4-8c.79 0 1.5-.71 1.5-1.5S8.79 9 8 9s-1.5.71-1.5 1.5S7.21 11 8 11zm8 0c.79 0 1.5-.71 1.5-1.5S16.79 9 16 9s-1.5.71-1.5 1.5.71 1.5 1.5 1.5zm-4 4c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z" />
                </svg>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-gray-800 border border-gray-700 text-gray-100">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 w-full bg-violet-950 border-t border-gray-700 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={e => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-500 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-all disabled:bg-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
