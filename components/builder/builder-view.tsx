"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, ChevronRight, Download, Loader2, Play } from "lucide-react"

const STAGES = [
  "Prompt Input",
  "PRD Generation",
  "Frontend Generation",
  "Backend Generation",
  "Integration Testing",
  "Ready for Download",
]

export function BuilderView() {
  const [currentStage, setCurrentStage] = React.useState(0)
  const [prompt, setPrompt] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)

  const [prd, setPrd] = React.useState("")
  const [frontendCode, setFrontendCode] = React.useState("")
  const [backendCode, setBackendCode] = React.useState("")

  const handleNextStage = async () => {
    setIsProcessing(true)
    try {
      if (currentStage === 0) {
        // Mock PRD Generation call
        const response = await fetch("/api/ai/generate-prd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt })
        })
        const data = await response.json()
        setPrd(data.prd || "Mock PRD Generated because endpoint failed.")
      } else if (currentStage === 1) {
        // Mock Frontend Gen
        const response = await fetch("/api/ai/generate-frontend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, prd })
        })
        const data = await response.json()
        setFrontendCode(data.frontendCode || "<h1>Mock Frontend</h1>")
      } else if (currentStage === 2) {
        // Mock Backend Gen
        const response = await fetch("/api/ai/generate-backend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, prd, frontendCode })
        })
        const data = await response.json()
        setBackendCode(data.backendCode || "// Backend Mock")
      } else if (currentStage === 3) {
        // Mock Testing setup wait
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }
      
      setCurrentStage((prev) => Math.min(prev + 1, STAGES.length - 1))
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/projects/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, prd, frontendCode, backendCode })
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "brainwave-project.zip"
      a.click()
    } catch (e) {
      console.error("Failed to download project", e)
    }
  }

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar Timeline */}
      <div className="w-80 border-r border-border bg-card p-6 flex flex-col overflow-y-auto">
        <h2 className="text-xl font-bold mb-8 text-primary">Brainwave Builder</h2>
        <div className="space-y-6">
          {STAGES.map((stage, idx) => {
            const isActive = idx === currentStage;
            const isCompleted = idx < currentStage;
            return (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive ? 'border-primary text-primary' : isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'}`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span>{idx + 1}</span>}
                  </div>
                  {idx !== STAGES.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 transition-colors duration-300 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
                <div className="pt-1">
                  <p className={`font-medium ${isActive ? 'text-foreground' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {stage}
                  </p>
                  {isActive && <p className="text-sm text-muted-foreground animate-pulse mt-1">In Progress...</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-background p-8 overflow-y-auto flex flex-col h-full">
        <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
          {/* Stage 0: Prompt Input */}
          {currentStage === 0 && (
            <div className="flex-1 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500">
              <h1 className="text-3xl font-semibold mb-4">Describe Your Vision</h1>
              <p className="text-muted-foreground mb-6">Explain the purpose, features, and desired vibe of your application.</p>
              <Textarea
                placeholder="I want to create a SaaS application for..."
                className="flex-1 min-h-[300px] text-lg p-6 bg-card"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          )}

          {/* Stage 1: PRD */}
          {currentStage === 1 && (
            <div className="flex-1 flex flex-col animate-in fade-in duration-500">
              <h2 className="text-2xl font-semibold mb-4">Product Requirements Document</h2>
              <Card className="flex-1 overflow-hidden flex flex-col">
                <CardContent className="flex-1 p-0 overflow-y-auto w-full prose prose-sm max-w-none prose-neutral dark:prose-invert">
                  <pre className="p-6 bg-transparent whitespace-pre-wrap font-sans text-sm">{prd || "Waiting for PRD generation to complete..."}</pre>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Stage 2: Frontend */}
          {currentStage === 2 && (
            <div className="flex-1 flex flex-col animate-in fade-in duration-500">
              <h2 className="text-2xl font-semibold mb-4">Frontend Preview</h2>
              <div className="flex-1 border rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-border/50 relative">
                {frontendCode ? (
                  <iframe srcDoc={frontendCode} className="w-full h-full border-0" sandbox="allow-scripts allow-same-origin" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-card text-muted-foreground">
                    Code preview will appear here
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stage 3: Backend */}
          {currentStage === 3 && (
            <div className="flex-1 flex flex-col animate-in fade-in duration-500">
              <h2 className="text-2xl font-semibold mb-4">Backend API & Schema generation</h2>
              <Card className="flex-1 overflow-hidden flex flex-col bg-[#1e1e1e] text-[#d4d4d4] border-0">
                <CardContent className="flex-1 p-6 overflow-y-auto font-mono text-sm">
                  <pre className="whitespace-pre-wrap">{backendCode || "Generating backend schema and endpoints..."}</pre>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Stage 4: Testing */}
          {currentStage === 4 && (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500">
              <div className="rounded-full bg-accent text-primary w-24 h-24 flex items-center justify-center mb-8 shadow-sm">
                <Play className="w-10 h-10 ml-2" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Running Integration Tests</h2>
              <p className="text-muted-foreground max-w-md text-center">Verifying API bindings between the generated frontend view and Express backend models.</p>
            </div>
          )}

          {/* Stage 5: Download */}
          {currentStage === 5 && (
            <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-500">
              <div className="bg-primary/10 text-primary p-6 rounded-full inline-block mb-6 pt-7">
                <Download className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">Project Ready!</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
                Your entire source code, database scripts, and environment templates have been packaged into a single deployable ZIP.
              </p>
              <Button size="lg" className="px-10 py-6 text-lg rounded-full shrink-0" onClick={handleDownload}>
                Download ZIP
              </Button>
            </div>
          )}

          {/* Action Bar */}
          {currentStage < STAGES.length - 1 && (
            <div className="pt-6 mt-4 flex justify-end gap-4 border-t border-border shrinks-0 bg-background pb-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStage(Math.max(0, currentStage - 1))}
                disabled={currentStage === 0 || isProcessing}
              >
                Back
              </Button>
              <Button 
                onClick={handleNextStage} 
                disabled={isProcessing || (currentStage === 0 && prompt.trim().length < 10)}
                className="gap-2"
              >
                {isProcessing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <>Continue <ChevronRight className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
