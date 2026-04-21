"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"
import { Loader2, Rocket } from "lucide-react"

import { Navbar } from "@/components/shared/Navbar"
import { ProjectSidebar } from "@/components/shared/ProjectSidebar"
import { DashboardView } from "@/components/views/DashboardView"
import { DiscoveryView } from "@/components/views/DiscoveryView"
import { QuestionnaireView } from "@/components/views/QuestionnaireView"
import { PrdView } from "@/components/views/PrdView"
import { PlaygroundView } from "@/components/views/PlaygroundView"
import { StackSelector } from "@/components/playground/StackSelector"

export default function App() {
  const { isSignedIn, isLoaded, user } = useUser()
  
  const [currentView, setCurrentView] = React.useState<"dashboard" | "discovery" | "questionnaire" | "stack_selection" | "prd" | "build">("dashboard")
  const [language, setLanguage] = React.useState<"id" | "en">("id")
  const [selectedStack, setSelectedStack] = React.useState<"html" | "nextjs" | "react" | "nodejs">("html")
  
  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)

  // System States
  const [projects, setProjects] = React.useState<any[]>([])
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null)
  const [generatedCode, setGeneratedCode] = React.useState("")
  const [backendCode, setBackendCode] = React.useState("")
  const [stitchHtml, setStitchHtml] = React.useState("")
  const [stitchGuide, setStitchGuide] = React.useState("")
  const [modularFiles, setModularFiles] = React.useState<Record<string, string>>({})
  const [isGeneratingCode, setIsGeneratingCode] = React.useState(false)
  const [isAutoSaving, setIsAutoSaving] = React.useState(false)
  
  // Chat / Refinement State
  const [chatMessages, setChatMessages] = React.useState<any[]>([])
  const [isChatProcessing, setIsChatProcessing] = React.useState(false)

  const fetchProjects = React.useCallback(async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const contentType = res.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json()
          setProjects(data.projects || [])
        }
      }
    } catch(e) {
      console.error("Fetch Projects Error:", e)
    }
  }, [])

  React.useEffect(() => {
    if (isSignedIn) {
      fetchProjects()
    }
  }, [isSignedIn, fetchProjects])

  // Theme Logic
  const [theme, setTheme] = React.useState("dark")
  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  // Discovery State
  const [idea, setIdea] = React.useState("")
  const [isGeneratingQuestions, setIsGeneratingQuestions] = React.useState(false)

  // Questionnaire State
  const [questions, setQuestions] = React.useState<any[]>([])
  const [answers, setAnswers] = React.useState<Record<number, string>>({})
  const [isGeneratingPrd, setIsGeneratingPrd] = React.useState(false)

  // Output State
  const [prd, setPrd] = React.useState("")
  
  const prdHeaders = React.useMemo(() => {
    if (!prd) return [];
    const headers = [];
    const lines = prd.split('\n');
    for (const line of lines) {
      if (line.startsWith('## ')) {
        headers.push(line.replace('## ', '').trim());
      }
    }
    return headers;
  }, [prd])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#1C2733] flex items-center justify-center transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-[#F59E0B]" />
      </div>
    )
  }

  const handleStartDiscovery = async () => {
    setActiveProjectId(null)
    setPrd("")
    if (!idea.trim()) return;
    setIsGeneratingQuestions(true)
    
    try {
      // 1. Save project immediately to history
      const titleMatch = idea.substring(0, 35) + "...";
      setIsAutoSaving(true)
      const saveRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleMatch,
          prompt: idea
        })
      })
      let saveData;
      if (saveRes.ok) {
        const contentType = saveRes.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          saveData = await saveRes.json()
          if (saveData.project?.id) {
            setActiveProjectId(saveData.project.id)
            fetchProjects()
          }
        }
      }
      setIsAutoSaving(false)

      // 2. Continue with questions generation
      const res = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, language })
      })
      
      let data;
      try {
        data = await res.json()
      } catch(e) {
        throw new Error("Invalid response from server");
      }
      
      setQuestions(data?.questions || [])
      setCurrentView("questionnaire")

      // 3. Update project with questions
      if (activeProjectId || (saveData as any)?.project?.id) {
        try {
          setIsAutoSaving(true)
          await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: activeProjectId || (saveData as any)?.project?.id,
              prompt: idea,
              metadata: { 
                questions: data?.questions || [], 
                answers: {},
                language: language 
              }
            })
          })
          fetchProjects()
          setIsAutoSaving(false)
        } catch (saveErr) {
          console.error("Failed to update project questions:", saveErr)
        } finally {
          setIsAutoSaving(false)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsGeneratingQuestions(false)
    }
  }

  const handleGeneratePRD = async () => {
    setIsGeneratingPrd(true)
    try {
      const contextStr = questions.map((q, i) => `Q: ${q.question}\nA: ${answers[i] || "Tidak dijawab"}`).join("\n\n")
      const finalPrompt = `IDE UTAMA:\n${idea}\n\nKONTEKS TAMBAHAN:\n${contextStr}`

      const res = await fetch("/api/ai/generate-prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, language })
      })
      
      let data;
      try {
        data = await res.json()
      } catch(e) {
        throw new Error("Invalid response from server");
      }
      
      setPrd(data?.prd || "Gagal membuat PRD.")
      setCurrentView("prd")

      try {
        setIsAutoSaving(true)
        const titleMatch = (idea || "").substring(0, 35) + "...";
        const saveRes = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: activeProjectId,
            title: titleMatch,
            prompt: idea,
            prd: data?.prd,
            metadata: { 
              questions, 
              answers, 
              language, 
              frontendCode: generatedCode,
              backendCode: backendCode
            }
          })
        })
        if (saveRes.ok) {
          const saveData = await saveRes.json()
          if (saveData.project?.id) {
            setActiveProjectId(saveData.project.id)
            fetchProjects()
          }
        }
        setIsAutoSaving(false)
      } catch (saveErr) {
        console.error("Failed to save project state:", saveErr)
      } finally {
        setIsAutoSaving(false)
      }

    } catch (e) {
      console.error(e)
    } finally {
      setIsGeneratingPrd(false)
    }
  }

  const handleLoadProject = (project: any) => {
    const metadata = (project.projectStructure as any) || {}
    
    setActiveProjectId(project.id)
    setIdea(project.prompt)
    setQuestions(metadata.questions || [])
    setAnswers(metadata.answers || {})
    if (metadata.language) {
      setLanguage(metadata.language)
    }
    
    const feSource = project.frontendCode || metadata.frontendCode || ""
    if (feSource.startsWith("{")) {
      try {
        const files = JSON.parse(feSource)
        setModularFiles(files)
        setGeneratedCode(files["src/App.tsx"] || "")
      } catch (e) {
        setGeneratedCode(feSource)
      }
    } else {
      setGeneratedCode(feSource)
    }

    if (metadata.backendCode || project.backendCode) {
      setBackendCode(metadata.backendCode || project.backendCode || "")
    } else {
      setBackendCode("")
    }

    setStitchHtml(metadata.stitchHtml || "")
    
    if (project.prd) {
      setPrd(project.prd)
      if (feSource) {
        setCurrentView("build")
      } else {
        setCurrentView("prd")
      }
    } else if (metadata.questions && metadata.questions.length > 0) {
      setCurrentView("questionnaire")
    } else {
      setCurrentView("discovery")
    }
    
    setIsSidebarOpen(false)
  }

  const handleGenerateCode = async () => {
    if (!prd) return
    setIsGeneratingCode(true)
    setCurrentView("build")
    
    try {
      // 1. Generate Design via Google Stitch
      const stitchRes = await fetch("/api/ai/generate-stitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          projectId: activeProjectId, 
          prompt: prd 
        })
      })
      
      const stitchData = await stitchRes.json()
      if (stitchData.error) throw new Error(stitchData.error)
      
      const rawHtml = stitchData.htmlContent
      const rawGuide = stitchData.guideContent || ""
      setStitchHtml(rawHtml)
      setStitchGuide(rawGuide)

      // 2. Convert Stitch HTML + Guide to Target Stack (Modular)
      const convertRes = await fetch("/api/ai/convert-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          html: rawHtml, 
          guide: rawGuide,
          stack: selectedStack, 
          prd, 
          language 
        })
      })
      
      const convertData = await convertRes.json()
      if (convertData.error) throw new Error(convertData.error)
      
      const files = convertData.files || { "src/App.tsx": convertData.code || "" }
      setModularFiles(files)
      setGeneratedCode(files["src/App.tsx"] || "")

      // 3. Generate Backend Code
      const beRes = await fetch("/api/ai/generate-backend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: idea, 
          prd, 
          frontendCode: JSON.stringify(files), 
          language 
        })
      })

      const beData = await beRes.json()
      const finalBackendCode = beData.backendCode || ""
      setBackendCode(finalBackendCode)
      
      // 4. Save everything to DB
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeProjectId,
          frontendCode: JSON.stringify(files),
          backendCode: finalBackendCode,
          stack: selectedStack,
          metadata: { 
            questions, 
            answers, 
            language,
            frontendCode: JSON.stringify(files),
            backendCode: finalBackendCode,
            stitchHtml: rawHtml,
            stitchScreenId: stitchData.screenId,
            stitchProjectId: stitchData.projectId
          }
        })
      })
      fetchProjects()
    } catch (e: any) {
      console.error("Build Error:", e)
      alert("Error: " + e.message)
    } finally {
      setIsGeneratingCode(false)
    }
  }

  const handleSyncCode = async () => {
    if (!stitchHtml || isGeneratingCode) return;
    setIsGeneratingCode(true);

    try {
      // Re-trigger conversion from Stitch HTML/Guide to Target Stack (Modular)
      const convertRes = await fetch("/api/ai/convert-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          html: stitchHtml, 
          guide: stitchGuide,
          stack: selectedStack, 
          prd, 
          language 
        })
      })
      
      const convertData = await convertRes.json()
      if (convertData.error) throw new Error(convertData.error)
      
      const files = convertData.files || { "src/App.tsx": convertData.code || "" }
      setModularFiles(files)
      setGeneratedCode(files["src/App.tsx"] || "")

      // Update backend connection awareness
      const beRes = await fetch("/api/ai/generate-backend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: idea, 
          prd, 
          frontendCode: JSON.stringify(files), 
          language 
        })
      })
      const beData = await beRes.json()
      setBackendCode(beData.backendCode || "")

      // Save sync point to DB
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeProjectId,
          frontendCode: JSON.stringify(files),
          backendCode: beData.backendCode || "",
          metadata: { 
            ...((projects.find(p => p.id === activeProjectId)?.projectStructure as any) || {}),
            frontendCode: JSON.stringify(files),
            backendCode: beData.backendCode || "",
            stitchHtml: stitchHtml
          }
        })
      })
    } catch (e: any) {
      console.error("Sync Error:", e)
      alert("Gagal sinkronisasi: " + e.message)
    } finally {
      setIsGeneratingCode(false)
    }
  }

  const handleChatRefine = async (message: string) => {
    if (!activeProjectId || isChatProcessing) return;
    
    const newUserMsg = { role: "user", content: message };
    setChatMessages((prev) => [...prev, newUserMsg]);
    setIsChatProcessing(true);

    try {
      const res = await fetch("/api/ai/edit-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeProjectId,
          message,
          currentCode: generatedCode,
          stack: selectedStack,
          prd,
          language
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.code) {
        setGeneratedCode(data.code);
        setChatMessages((prev) => [
          ...prev, 
          { role: "assistant", content: "Selesai! Saya telah memperbarui kode sesuai permintaan Anda." }
        ]);
        
        // Auto-save updated code
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: activeProjectId,
            frontendCode: data.code,
            metadata: { 
              ...((projects.find(p => p.id === activeProjectId)?.projectStructure as any) || {}),
              frontendCode: data.code
            }
          })
        });
      }
    } catch (error: any) {
      console.error("Chat Refine Error:", error);
      setChatMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Maaf, saya gagal memperbarui kode: " + error.message }
      ]);
    } finally {
      setIsChatProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1C2733] flex flex-col text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300">
      <Navbar 
        isSignedIn={isSignedIn} 
        user={user} 
        theme={theme} 
        setTheme={setTheme} 
        isProfileOpen={isProfileOpen} 
        setIsProfileOpen={setIsProfileOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      <div className="flex-1 flex overflow-hidden relative">
        <ProjectSidebar 
          isSignedIn={isSignedIn} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          projects={projects}
          handleLoadProject={handleLoadProject}
        />

        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto z-10 w-full">
          {currentView === "dashboard" && <DashboardView user={user} isSignedIn={isSignedIn} setCurrentView={setCurrentView} />}
          {currentView === "discovery" && <DiscoveryView idea={idea} setIdea={setIdea} language={language} setLanguage={setLanguage} isGeneratingQuestions={isGeneratingQuestions} handleStartDiscovery={handleStartDiscovery} setIsSidebarOpen={setIsSidebarOpen} />}
          {currentView === "questionnaire" && (
            <QuestionnaireView 
              questions={questions} 
              answers={answers} 
              setAnswers={setAnswers} 
              handleGeneratePRD={() => setCurrentView("stack_selection")} 
              isGeneratingPrd={false} 
              setCurrentView={setCurrentView} 
            />
          )}
          {currentView === "stack_selection" && (
            <div className="w-full max-w-4xl mx-auto py-12">
              <StackSelector 
                selectedStack={selectedStack} 
                onSelect={setSelectedStack} 
                onConfirm={handleGeneratePRD} 
              />
            </div>
          )}
          {currentView === "prd" && <PrdView prd={prd} prdHeaders={prdHeaders} setCurrentView={setCurrentView} handleGenerateCode={handleGenerateCode} />}
          
          {currentView === "build" && (
            isGeneratingCode ? (
              <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500 text-center">
                <Rocket className="w-16 h-16 text-emerald-500 mb-6 animate-bounce mx-auto" />
                <h2 className="text-3xl font-bold text-white mb-4">Grup Desain Google Stitch Aktif...</h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">AI sedang merancang desain UI profesional dan mengkonversinya ke {selectedStack.toUpperCase()}.</p>
                <div className="flex gap-2 justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150" />
                </div>
              </div>
            ) : (
              <PlaygroundView 
                stitchHtml={stitchHtml}
                stitchGuide={stitchGuide}
                modularFiles={modularFiles}
                backendCode={backendCode} 
                setCurrentView={setCurrentView} 
                projectId={activeProjectId || ""}
                onSendMessage={handleChatRefine}
                onSyncCode={handleSyncCode}
                isSyncingCode={isGeneratingCode}
                isChatProcessing={isChatProcessing}
                chatMessages={chatMessages}
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}
