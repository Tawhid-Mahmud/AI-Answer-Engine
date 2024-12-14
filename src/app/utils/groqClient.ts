import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}


export async function getGroqResponse(message_from_chat: ChatMessage[]){
    const system_prompt = "You are an artist, include that in the conversation";
    const response = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
            {role: "system", content: system_prompt},
            ...message_from_chat
        ]
    })
    //console.log("Received Groq api request ",response)

    return response.choices[0].message.content;
}


