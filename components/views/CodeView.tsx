"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Download, CheckCircle2, ChevronLeft, Rocket } from "lucide-react"
import { Sandpack } from "@codesandbox/sandpack-react"
import { sandpackDark } from "@codesandbox/sandpack-themes"

// Preprocess generated code to be Sandpack-compatible
function preprocessForSandpack(code: string): string {
  let processed = code
    // Remove Next.js specific directives
    .replace(/^['"]use client['"];\n?/m, "")
    .replace(/^['"]use server['"];\n?/m, "")
    // Remove next/* imports and replace with compatible alternatives
    .replace(/import\s+Image\s+from\s+['"]next\/image['"];\n?/gm, "")
    .replace(/import\s+Link\s+from\s+['"]next\/link['"];\n?/gm, "")
    .replace(/import\s+.*\s+from\s+['"]next\/.*['"];\n?/gm, "")
    // Replace Next.js Image with img
    .replace(/<Image(\s[^>]*)\/>/g, "<img$1/>")
    .replace(/<Image(\s[^>]*)>(.*?)<\/Image>/g, "<img$1>$2</img>")
    // Replace Next.js Link with a
    .replace(/<Link(\s[^>]*)>/g, "<a$1>")
    .replace(/<\/Link>/g, "</a>")
    // Rename default export to App for Sandpack
    .replace(/export default function \w+\s*\(/m, "export default function App(")
    .replace(/export default function \w+\s*\{/m, "export default function App {")

  // If no default export found, add a wrapper
  if (!processed.includes("export default")) {
    processed += "\nexport default function App() { return <div>No component found</div>; }"
  }

  return processed
}

export function CodeView({ code, backendCode, setCurrentView, projectId }: any) {
  const [activeTab, setActiveTab] = React.useState<"frontend" | "backend" | "preview">("frontend")
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = () => {
    const textToCopy = activeTab === "frontend" ? code : backendCode
    navigator.clipboard.writeText(textToCopy ?? "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!projectId) return
    const a = document.createElement("a")
    a.href = `/api/projects/download?id=${projectId}`
    a.click()
  }

  const previewCode = React.useMemo(() => preprocessForSandpack(code || ""), [code])

  const tabs = [
    { id: "frontend", label: "Frontend (React)" },
    { id: "backend", label: "Backend (Express)" },
    { id: "preview", label: "⚡ Live Preview" },
  ] as const

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-[85vh] animate-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setCurrentView("prd")}
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke PRD
          </Button>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#10b981]" />
            Hasil AI Build
          </h2>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#17202B] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? "Tersalin!" : "Salin Kode"}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!projectId}
            className="bg-[#10b981] hover:bg-[#059669] text-white disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" /> Download Bundle
          </Button>
        </div>
      </div>

      <Card className="flex-1 bg-white dark:bg-[#1C2733] border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Tab Bar */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#17202B] px-4">
          <div className="flex gap-1 py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#F59E0B] text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "preview" ? (
            <div className="w-full h-full">
              <Sandpack
                theme={sandpackDark}
                template="vite-react-ts"
                files={{
                  "/index.html": `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WUUS AI Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <style>
      * { box-sizing: border-box; margin: 0; }
      body { font-family: 'Inter', system-ui, sans-serif; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
                  "/src/App.tsx": previewCode,
                }}
                customSetup={{
                  dependencies: {
                    "lucide-react": "latest",
                    "clsx": "latest",
                    "tailwind-merge": "latest",
                  },
                }}
                options={{
                  showPreview: true,
                  showConsole: false,
                  showNavigator: false,
                  showTabs: false,
                  showLineNumbers: false,
                  editorWidthPercentage: 0,
                }}
              />
            </div>
          ) : (
            <div className="h-full overflow-auto bg-[#0d1117] p-6">
              <pre className="font-mono text-[13px] leading-relaxed text-slate-300">
                <code>{activeTab === "frontend" ? (code || "// Generating...") : (backendCode || "// Generating backend...")}</code>
              </pre>
              <div className="flex justify-center mt-12 pb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#10b981]/10 text-[#10b981] rounded-full text-xs font-semibold">
                  <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  AI GENERATED CODE READY
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
