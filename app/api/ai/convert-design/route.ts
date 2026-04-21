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
    const { html, guide, stack, prd, language } = await req.json();

    if (!html || !stack) {
      return NextResponse.json({ error: "HTML and Stack are required" }, { status: 400 });
    }

    // If stack is pure html, polish it
    if (stack === "html") {
      const { text: polishedHtml } = await generateText({
        model: openrouter("openai/gpt-4o-mini"),
        system: `You are a Master Web Designer. Polish this raw HTML design to be fully responsive, functional, and visually stunning using Tailwind CSS. 
Return ONLY the polished HTML code.`,
        prompt: `RAW HTML: ${html}\n\nSTITCH GUIDE: ${guide}`
      })
      return NextResponse.json({ code: polishedHtml });
    }

    const isNextJs = stack === "nextjs";

    const { text } = await generateText({
      model: openrouter("openai/gpt-4o-mini"),
      maxOutputTokens: 5000,
      system: `You are a Senior SaaS Architect specializing in Next.js 14 (App Router) and React.
Your task is to convert a Google Stitch Design (HTML + Guide) into a premium, modular codebase.

CORE ARCHITECTURE:
1. Entry Point: ${isNextJs ? '"app/page.tsx"' : '"src/App.tsx"'}
2. Components: Extract meaningful, reusable components into ${isNextJs ? '"components/ui/*.tsx"' : '"src/components/*.tsx"'}.
3. Logic: Follow the "STITCH GUIDE" religiously for functional requirements, data models, and logic flow.
4. Styling: Use Tailwind CSS with absolute fidelity to the design's aesthetics.
5. Content: Use the PRD for all copy, values, and localized text (${language === 'id' ? 'Indonesian' : 'English'}).

MODULARITY RULES:
- DON'T put everything in one file. Split into Hero, Features, Pricing, Footer, etc.
- Use clean props for components.
- For Next.js: Use "use client" ONLY where interactivity is required.

OUTPUT: Return ONLY a sharp JSON object mapping file paths to code. No markdown formatting.`,
      prompt: `CONVERT THIS DESIGN:
HTML DESIGN:
${html}

STITCH GUIDE (BLUEPRINT):
${guide}

PRD CONTEXT:
${prd || "N/A"}

TARGET STACK: ${stack} (Next.js should use App Router)`,
    });

    let jsonOutput;
    try {
      let cleanJson = text.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      jsonOutput = JSON.parse(cleanJson);
    } catch (e) {
      // Fallback if AI output is not valid JSON
      console.error("JSON Parse Error:", e);
      jsonOutput = { "src/App.tsx": text };
    }

    return NextResponse.json({ files: jsonOutput });
  } catch (error: any) {
    console.error("Conversion Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
