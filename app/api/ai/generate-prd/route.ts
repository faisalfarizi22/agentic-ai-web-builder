import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, language } = await req.json()
    let errorPrompt = prompt || "";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openrouter("openai/gpt-4o-mini"),
      maxOutputTokens: 4000,
      maxRetries: 2,
      system: `You are an expert Product Manager. Write a highly structured and detailed Product Requirements Document (PRD) based on the user's idea and answers. 
YOU MUST strictly format the PRD matching the exact structure below. You MUST include ALL 7 headers without fail. 
The ENTIRE PRD output (except code syntax terms) MUST be written in ${language === 'en' ? 'English' : 'Indonesian'}:

# PRD — Project Requirements Document

## 1. Overview
[Your overview based on input. State main problem and main goal]

## 2. Requirements
[High level requirements list. Accessibility, Users, Data Input, Specificity, Notifications]

## 3. Core Features
[List of key features for MVP]

## 4. User Flow
[Simple step-by-step numbered user flow]

## 5. Architecture
[Provide a simple Mermaid sequenceDiagram describing the core data flow]

## 6. Database Schema
[Provide a Mermaid erDiagram. Then provide a table explaining the tables]

## 7. Design & Technical Constraints
[High level tech constraints]
`,
      prompt: `Website Idea and Context: ${prompt}\n\nPlease generate the FULL PRD with EXACTLY 7 headers as requested. Do not skip any sections.`,
    })

    return NextResponse.json({ prd: text })
  } catch (error) {
    console.error("PRD Generation Error:", error)
    return NextResponse.json(
      { 
        prd: `# Mock PRD Generation Failed\n\nYou did not provide a valid API key or the request failed. Error mock based on: \n\n_..._` 
      }, 
      { status: 500 }
    )
  }
}

