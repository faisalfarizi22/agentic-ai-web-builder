import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { 
      message, 
      currentCode, 
      stack, 
      prd, 
      language 
    } = await req.json();

    if (!message || !currentCode) {
      return NextResponse.json({ error: "Message and Current Code are required" }, { status: 400 });
    }

    const { text } = await generateText({
      model: openrouter("openai/gpt-4o-mini"),
      maxOutputTokens: 5000,
      system: `You are a professional Full-stack Engineer assisting in a modular web playground.
The user wants to refine their code across multiple files.

STRICT RULES:
1. Output ONLY a valid JSON object representing the updated file system.
2. Maintain the modular structure (src/App.tsx, src/components/*.tsx, etc.).
3. If the input is a single file, convert it into a modular structure if possible.
4. Surround the response with JSON curly braces. No conversational text.
5. All new UI elements must use Tailwind CSS.
6. If the user asks for a backend change, update relevant backend files too.`,
      prompt: `CURRENT FILES/CODE:
${currentCode}

PRD CONTEXT:
${prd || "N/A"}

USER REQUEST:
${message}

Please rewrite the relevant files. Return the entire project structure as a JSON object.`,
    });

    let jsonOutput;
    try {
      let cleanJson = text.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      jsonOutput = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Edit Code JSON Parse Error:", e);
      jsonOutput = { "src/App.tsx": text };
    }

    return NextResponse.json({ files: jsonOutput });
  } catch (error: any) {
    console.error("Edit Code Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
