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
    const { prd, language } = await req.json()

    if (!prd) {
      return NextResponse.json({ error: "PRD is required" }, { status: 400 })
    }

    // Truncate PRD if too long to avoid empty model responses
    const truncatedPrd = prd.length > 6000 ? prd.substring(0, 6000) + "..." : prd

    const { text } = await generateText({
      model: openrouter("openai/gpt-4o-mini"),
      maxOutputTokens: 4000,
      maxRetries: 2,
      system: `You are an expert Frontend Developer. Generate a COMPLETE, BEAUTIFUL React component for the UI described in the PRD.

STRICT RULES — FOLLOW EXACTLY:
1. Output ONLY TSX code. No markdown code fences (\`\`\`), no explanations, no comments.
2. Start the file with "use client"; on the first line.
3. Use React hooks (useState, useEffect) for interactivity.
4. Use Tailwind CSS utility classes for ALL styling. Make the design stunning.
5. Use lucide-react icons where appropriate (import { IconName } from 'lucide-react').
6. Design: PREMIUM, dark-themed (bg-slate-900 or bg-gray-950), modern, and fully responsive.
7. DO NOT import from 'next/image' — use plain <img> tags instead.
8. DO NOT import from 'next/link' — use plain <a> tags instead.
9. DO NOT use useRouter or any 'next/navigation' imports.
10. The component MUST export a default function named Page.
11. All text content MUST be in ${language === 'en' ? 'English' : 'Indonesian'}.
12. Include realistic placeholder data (names, prices, descriptions, etc.).
13. Make it a FULL PAGE — include hero section, features/products, and a CTA/footer.
14. You MUST produce valid, complete TSX code. Do not leave functions or JSX incomplete.`,
      prompt: `Generate the full React TSX code for this project. Be thorough and complete:\n\n${truncatedPrd}`,
    })

    // If model returned empty, throw to trigger fallback
    if (!text || text.trim().length < 50) {
      throw new Error("Model returned empty or insufficient output")
    }

    // Clean up potential markdown marks if they slipped in
    let cleanCode = text.trim();
    if (cleanCode.startsWith("```")) {
      cleanCode = cleanCode.replace(/^```(?:tsx|jsx|typescript|javascript)?\n?/, "").replace(/\n?```$/, "");
    }

    return NextResponse.json({ code: cleanCode })
  } catch (error: any) {
    console.error("Code Generation Error:", error?.message || error)
    
    // Return a meaningful fallback component instead of an error
    const fallback = `"use client";
import { useState } from 'react';
import { Rocket, AlertCircle } from 'lucide-react';

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">AI Build Gagal</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          AI tidak berhasil menghasilkan kode saat ini. Ini mungkin terjadi karena PRD terlalu panjang atau model sedang sibuk. Coba lagi beberapa saat.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-colors"
        >
          <Rocket className="inline w-4 h-4 mr-2 -mt-0.5" />
          Coba Lagi
        </button>
      </div>
    </main>
  );
}`

    return NextResponse.json({ code: fallback })
  }
}
