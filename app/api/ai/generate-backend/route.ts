import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt, prd, frontendCode, language } = await req.json()

    if (!prd || !frontendCode) {
      return NextResponse.json({ error: "PRD and Frontend code required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openrouter("openai/gpt-4o-mini"),
      maxOutputTokens: 4000,
      maxRetries: 2,
      system: `You are an expert Backend Engineer. 
Your goal is to generate a standalone Node.js (Express.js) server.js file and an associated Prisma Schema.
Requirements:
1. Include all necessary imports (express, @prisma/client, cors, dotenv).
2. Implement the core API endpoints (CRUD) matching the entities described in the PRD.
3. Include a Prisma schema as a commented-out section at the end of the file.
4. Output ONLY the code. No markdown backticks, no explanations.
5. All comments must be in ${language === 'en' ? 'English' : 'Indonesian'}.`,
      prompt: `Website Idea: ${prompt}\n\nPRD Context:\n${prd.substring(0, 4000)}\n\nFrontend UI already generated:\n${frontendCode.substring(0, 500)}...\n\nGenerate the full backend server.js implementation.`,
    })

    // Remove fallback code if generation succeeded
    let code = text;
    if (code.startsWith("```")) {
      code = code.replace(/^```[a-z]*\n/, "").replace(/\n```$/, "");
    }

    return NextResponse.json({ backendCode: code })
  } catch (error) {
    console.error("Backend Code Generation Error:", error)
    return NextResponse.json(
      { 
        backendCode: `// Mock Backend API Generated\nconst express = require('express');\nconst app = express();\n\napp.use(express.json());\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'ok', mocked: true });\n});\n\napp.listen(3001, () => console.log('Server running on port 3001'));` 
      }, 
      { status: 200 }
    )
  }
}

