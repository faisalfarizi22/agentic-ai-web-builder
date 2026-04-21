import { generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"
import { NextResponse } from "next/server"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { idea, language } = await req.json()

    if (!idea) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: openrouter("openai/gpt-4o-mini"),
      maxOutputTokens: 800,
      schema: z.object({
        questions: z.array(z.object({
          question: z.string(),
          options: z.array(z.string()),
          allowCustomInput: z.boolean().default(true)
        })).length(3)
      }),
      system: `You are an expert product coach helping a user refine their SaaS/website idea. 
Analyze the user's initial idea and generate exactly 3 clarifying multiple-choice questions to ask them.
The questions MUST target discovering missing key scope like target audience, core missing feature, monetization, or tech constraint.
Each question should have 3 to 4 predefined options. Make sure questions and options are in ${language === "en" ? "English" : "Indonesian"}.`,
      prompt: `User's Idea: ${idea}\n\nGenerate the 3 questions.`,
    })

    return NextResponse.json({ questions: object.questions })
  } catch (error) {
    console.error("Questions Generation Error:", error)
    return NextResponse.json(
      { 
        questions: [
          {
            question: "Siapa target pengguna utama aplikasi ini?",
            options: ["Individu/Umum", "Perusahaan/B2B", "Internal Tim"],
            allowCustomInput: true
          },
          {
            question: "Apa platform utama yang diprioritaskan?",
            options: ["Hanya Web Desktop", "Mobile Web Reponsive", "Aplikasi Mobile Asli (iOS/Android)"],
            allowCustomInput: true
          },
          {
            question: "Bagaimana cara pengguna masuk (login) ke aplikasi?",
            options: ["Email & Password", "Google/Sosmed Login", "Tidak perlu login"],
            allowCustomInput: true
          }
        ]
      }, 
      { status: 200 }
    )
  }
}
