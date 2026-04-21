import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import JSZip from "jszip"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
  }

  try {
    const project = await prisma.project.findUnique({ where: { id } })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Fallback: read from metadata JSON if dedicated columns are empty
    const metadata = (project.projectStructure as any) || {}
    let rawFrontendSource = project.frontendCode || metadata.frontendCode || ""
    const backendCode = project.backendCode || metadata.backendCode || ""
    const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "wuus-project"

    const zip = new JSZip()
    
    // ─── Resolve Frontend Code (Handle Modular JSON) ──────────────────────────
    let frontendFiles: Record<string, string> = {}
    const isModular = rawFrontendSource.trim().startsWith("{")
    
    if (isModular) {
      try {
        frontendFiles = JSON.parse(rawFrontendSource)
      } catch (e) {
        console.error("Failed to parse modular frontend code:", e)
        frontendFiles = { "app/page.tsx": rawFrontendSource }
      }
    } else if (rawFrontendSource.trim()) {
      if (rawFrontendSource.trim().startsWith("# ")) {
         console.warn("Detected PRD in frontendCode column, skipping as source code.")
         frontendFiles = {}
      } else {
         // Default to Next.js if ambiguous
         frontendFiles = { "app/page.tsx": rawFrontendSource }
      }
    }

    // ─── Resolve Stack (Next.js vs Vite) ─────────────────────────────────────
    // If any file path starts with 'app/', target Next.js
    // If any file path starts with 'src/', target Vite
    const hasAppDir = Object.keys(frontendFiles).some(k => k.startsWith("app/"))
    const hasSrcDir = Object.keys(frontendFiles).some(k => k.startsWith("src/"))
    const targetStack = (hasAppDir || !hasSrcDir) ? "nextjs" : "vite"

    // ─── Helper to ensure Next.js 14 compatibility ──────────────────────────
    const processCode = (path: string, code: string) => {
      if (path.endsWith(".tsx") || path.endsWith(".jsx")) {
         if ((code.includes("useState") || code.includes("useEffect") || code.includes("onClick")) 
             && !code.includes('"use client"')) {
           return '"use client"\n' + code
         }
      }
      return code
    }

    // Add modular files to zip
    Object.entries(frontendFiles).forEach(([path, code]) => {
      let targetPath = path
      // Standardization: 
      // If we are in Next.js mode but files are 'src/' based, map them.
      if (targetStack === "nextjs") {
        if (path === "src/App.tsx" || path === "src/page.tsx") targetPath = "app/page.tsx"
        else if (path.startsWith("src/components/")) targetPath = path.replace("src/", "")
        else if (path.startsWith("src/")) targetPath = path.replace("src/", "app/")
      }
      
      zip.file(targetPath, processCode(targetPath, code))
    })

    // Fallbacks
    if (targetStack === "nextjs" && !zip.file("app/page.tsx")) {
      zip.file("app/page.tsx", `"use client"
import { Rocket } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-940 text-white">
      <div className="text-center">
        <Rocket className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">${project.title.replace(/'/g, "\\'")}</h1>
        <p className="text-slate-400">Project generated via Stitch Guide</p>
      </div>
    </main>
  )
}
`)
    }

    // ─── components/ui/button.tsx ─────────────────────────────────────────────
    zip.file("components/ui/button.tsx", `import * as React from "react"
import { clsx } from "clsx"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={clsx(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-slate-900 text-white hover:bg-slate-700": variant === "default",
            "border border-slate-200 bg-white hover:bg-slate-100": variant === "outline",
            "hover:bg-slate-100 hover:text-slate-900": variant === "ghost",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
`)

    // ─── backend/server.js ────────────────────────────────────────────────────
    if (backendCode && backendCode.trim()) {
      zip.file("backend/server.js", backendCode)
      zip.file("backend/package.json", JSON.stringify({
        name: `${slug}-api`,
        version: "1.0.0",
        main: "server.js",
        scripts: {
          start: "node server.js",
          dev: "node --watch server.js"
        },
        dependencies: {
          "express": "^4.18.2",
          "cors": "^2.8.5",
          "dotenv": "^16.4.5"
        }
      }, null, 2))
      zip.file("backend/.env.example", `PORT=3001
DATABASE_URL=postgresql://...
`)
    }

    // ─── .env.example ─────────────────────────────────────────────────────────
    zip.file(".env.example", `# Copy this to .env.local
# DATABASE_URL=postgresql://...
`)

    // ─── .gitignore ───────────────────────────────────────────────────────────
    zip.file(".gitignore", `/node_modules
/.next
/out
.env
.env.local
.DS_Store
*.log
`)

    // ─── README.md ────────────────────────────────────────────────────────────
    zip.file("README.md", `# ${project.title}

> Built with **WUUS AI Builder** 🚀

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3
- **Language**: TypeScript

## Getting Started

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Info
- **Idea**: ${project.prompt.substring(0, 200)}
- **Generated**: ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
`)

    const content = await zip.generateAsync({ type: "nodebuffer" })

    return new Response(new Uint8Array(content), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${slug}-bundle.zip"`,
        "Cache-Control": "no-store"
      }
    })
  } catch (error) {
    console.error("Download Error:", error)
    return NextResponse.json({ error: "Failed to generate bundle" }, { status: 500 })
  }
}
