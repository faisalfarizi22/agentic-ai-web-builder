import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 60; // Max edge duration for generation

export async function POST(req: Request) {
  try {
    const { prompt, prd } = await req.json()

    if (!prompt || !prd) {
      return NextResponse.json({ error: "Prompt and PRD are required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openrouter("openai/gpt-4o"),
      system: `You are an expert Frontend Developer and Designer. Your job is to output the FULL HTML, Tailwind CSS, and vanilla JS for the website described in the PRD.
The design MUST BE "Bright Lux": clean, bright background, very modern, no excessive box-shadows, no AI-ish visual elements, deep purple primary accents with nice radii (0.5rem).
Requirements:
1. Output ONLY valid HTML document.
2. Include <script src="https://cdn.tailwindcss.com"></script>
3. Include Lucide icons via CDN if needed.
4. DO NOT wrap with \`\`\`html or markdown. JUST the code from <!DOCTYPE html> to </html>.`,
      prompt: `User Prompt: ${prompt}\n\nPRD:\n${prd}\n\nGenerate the complete and standalone HTML file now.`,
    })

    // Clean up Markdown formatting if the model still wrapped it
    const code = text.replace(/```html/g, "").replace(/```/g, "").trim();

    return NextResponse.json({ frontendCode: code })
  } catch (error) {
    console.error("Frontend Code Generation Error:", error)
    return NextResponse.json(
      { 
        frontendCode: `<!DOCTYPE html><html lang="en"><head><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-[#fcfcfc] text-[#121212] min-h-screen flex items-center justify-center font-sans">
        <div class="max-w-xl text-center p-8 border rounded-xl shadow-sm bg-white">
          <h1 class="text-3xl font-bold mb-4 text-[#8b3dff]">Mock Frontend</h1>
          <p class="text-gray-500 mb-6 border-l-4 border-yellow-400 pl-4 text-left">The OpenRouter API failed. This is a local mock rendering.</p>
        </div></body></html>` 
      }, 
      { status: 200 }
    )
  }
}

