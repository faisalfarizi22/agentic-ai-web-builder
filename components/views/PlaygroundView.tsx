"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { 
  Copy, 
  Download, 
  CheckCircle2, 
  ChevronLeft, 
  Rocket, 
  Code2, 
  Eye, 
  Layout, 
  ExternalLink,
  Files,
  RefreshCw,
  Sparkles
} from "lucide-react"
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackCodeEditor, 
  SandpackPreview, 
  SandpackFileExplorer 
} from "@codesandbox/sandpack-react"
import { sandpackDark } from "@codesandbox/sandpack-themes"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { AiChatPanel } from "@/components/playground/AiChatPanel"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StitchTab } from "@/components/playground/StitchTab"

interface PlaygroundViewProps {
  stitchHtml: string
  stitchGuide: string
  modularFiles: Record<string, string>
  backendCode: string
  setCurrentView: (view: any) => void
  projectId: string
  onSendMessage: (msg: string) => void
  onSyncCode: () => void
  isSyncingCode: boolean
  isChatProcessing: boolean
  chatMessages: any[]
}

export function PlaygroundView({ 
  stitchHtml, 
  stitchGuide,
  modularFiles, 
  backendCode, 
  setCurrentView, 
  projectId,
  onSendMessage,
  onSyncCode,
  isSyncingCode,
  isChatProcessing,
  chatMessages
}: PlaygroundViewProps) {
  const [copied, setCopied] = React.useState(false)
  const [activeCanvasTab, setActiveCanvasTab] = React.useState<"stitch" | "code" | "live">("code")

  // Preprocess files to ensure Sandpack compatibility
  const files = React.useMemo(() => {
    const baseFiles = { ...modularFiles }
    
    // Add essential styles if missing
    if (!baseFiles["src/styles/globals.css"]) {
      baseFiles["src/styles/globals.css"] = "@tailwind base;\n@tailwind components;\n@tailwind utilities;"
    }

    // Add main.tsx entry point if it's a Vite React template and main.tsx is missing
    if (!baseFiles["src/main.tsx"] && !baseFiles["src/index.tsx"]) {
      const appPath = baseFiles["src/App.tsx"] ? "./App" : baseFiles["app/page.tsx"] ? "../app/page" : "./App"
      baseFiles["src/main.tsx"] = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '${appPath}';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    }

    // Ensure App.tsx exists at least somewhere
    if (Object.keys(baseFiles).length === 0) {
      baseFiles["src/App.tsx"] = "// No code generated yet. Click Sync to Code in the Stitch tab."
    }

    return baseFiles
  }, [modularFiles])

  const handleDownload = () => {
    if (!projectId) return
    const a = document.createElement("a")
    a.href = `/api/projects/download?id=${projectId}`
    a.click()
  }

  return (
    <div className="w-screen h-[calc(100vh-64px)] fixed bottom-0 left-0 right-0 bg-[#0B0F1A] z-50 flex flex-col overflow-hidden text-slate-100">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-white/5 bg-[#0D121F] flex items-center justify-between px-4 flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("dashboard")}
            className="text-slate-400 hover:text-white"
          >
            <ChevronLeft size={16} className="mr-1" /> Dashboard
          </Button>
          <div className="h-4 w-px bg-white/10" />
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layout size={16} className="text-emerald-400" />
            WUUS Playground <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 ml-2 uppercase">v2.0 Beta</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleDownload} size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs ring-1 ring-emerald-500/50">
            <Download size={14} className="mr-1.5" /> Download Bundle
          </Button>
        </div>
      </div>

      {/* Main Container */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        
        {/* Left: Main Canvas Area with Tabs */}
        <ResizablePanel defaultSize={70} minSize={40} className="relative bg-[#0D121F] flex flex-col border-r border-white/5">
          <Tabs value={activeCanvasTab} onValueChange={(v: any) => setActiveCanvasTab(v)} className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tab Navigation (Canvas Sub-Header) */}
            <div className="h-10 border-b border-white/5 bg-[#0D121F] flex items-center justify-between px-2 flex-shrink-0">
              <TabsList className="bg-transparent border-none gap-1 h-full p-0">
                <TabsTrigger value="stitch" className="data-[state=active]:bg-white/5 data-[state=active]:text-emerald-400 text-slate-400 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 px-4 text-xs font-semibold">
                  <Layout size={14} className="mr-2" /> Design Design
                </TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-white/5 data-[state=active]:text-emerald-400 text-slate-400 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 px-4 text-xs font-semibold">
                  <Files size={14} className="mr-2" /> IDE Code
                </TabsTrigger>
                <TabsTrigger value="live" className="data-[state=active]:bg-white/5 data-[state=active]:text-emerald-400 text-slate-400 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 px-4 text-xs font-semibold">
                  <Eye size={14} className="mr-2" /> Live Preview
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2 pr-2">
                <div className="text-[10px] text-slate-500 font-mono hidden md:block">localhost:3000</div>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 relative overflow-hidden">
              
              <TabsContent value="stitch" className="h-full m-0 p-0 border-none outline-none overflow-hidden">
                <StitchTab 
                  html={stitchHtml} 
                  guide={stitchGuide} 
                  onSync={onSyncCode} 
                  isSyncing={isSyncingCode} 
                />
              </TabsContent>

              <TabsContent value="code" className="h-full m-0 p-0 border-none outline-none">
                <SandpackProvider
                  theme={sandpackDark}
                  template="vite-react-ts"
                  files={files}
                  options={{
                    visibleFiles: Object.keys(files),
                    activeFile: "src/App.tsx",
                    recompileMode: "immediate",
                  }}
                >
                  <SandpackLayout className="h-full border-none rounded-none bg-transparent">
                    <ResizablePanelGroup direction="horizontal">
                      <ResizablePanel defaultSize={25} minSize={15} className="bg-[#090D18]">
                        <div className="h-full p-2 overflow-auto">
                          <SandpackFileExplorer />
                        </div>
                      </ResizablePanel>
                      <ResizableHandle className="w-[1px] bg-white/10 hover:bg-emerald-500/50" />
                      <ResizablePanel defaultSize={75} minSize={40}>
                        <div className="h-full custom-editor-wrapper bg-[#0D121F]">
                          <SandpackCodeEditor 
                            showLineNumbers={true} 
                            showTabs={true} 
                            closableTabs={true} 
                            showInlineErrors={true}
                            className="h-full"
                          />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </SandpackLayout>
                </SandpackProvider>
              </TabsContent>

              <TabsContent value="live" className="h-full m-0 p-0 border-none outline-none bg-white">
                <SandpackProvider
                  theme={sandpackDark}
                  template="vite-react-ts"
                  files={files}
                >
                  <SandpackLayout className="h-full border-none rounded-none">
                    <SandpackPreview 
                      showNavigator={true} 
                      showOpenInCodeSandbox={false}
                      className="h-full"
                    />
                  </SandpackLayout>
                </SandpackProvider>
              </TabsContent>

            </div>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-[#1A1F2E] hover:bg-emerald-500/50 transition-colors" />

        {/* Right: AI Chat Panel */}
        <ResizablePanel defaultSize={30} minSize={20} className="bg-[#111827]">
          <AiChatPanel 
            onSendMessage={onSendMessage}
            isProcessing={isChatProcessing}
            messages={chatMessages}
          />
        </ResizablePanel>

      </ResizablePanelGroup>

      {/* Footer Info */}
      <div className="h-6 bg-[#090D18] border-t border-white/5 flex items-center justify-between px-3 text-[10px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected to WUUS Intelligence</span>
          <span>Stack: {files["src/App.tsx"]?.includes("React") ? "Vite + React" : "Next.js Modular"}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
