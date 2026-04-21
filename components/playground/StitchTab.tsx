"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Layout, Code2, ExternalLink } from "lucide-react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StitchTabProps {
  html: string
  guide: string
  onSync: () => void
  isSyncing: boolean
}

export function StitchTab({ html, guide, onSync, isSyncing }: StitchTabProps) {
  return (
    <div className="flex flex-col h-full bg-[#0D121F]">
      {/* Mini Toolbar */}
      <div className="h-10 border-b border-white/5 bg-[#090D18] flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Layout size={14} className="text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Stitch Design Intelligence</span>
        </div>
        
        <Button 
          size="sm" 
          onClick={onSync} 
          disabled={isSyncing}
          className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] px-3 font-bold shadow-lg shadow-emerald-500/10 border border-emerald-500/20"
        >
          {isSyncing ? (
             <RefreshCw size={12} className="mr-1.5 animate-spin" />
          ) : (
             <Code2 size={12} className="mr-1.5" />
          )}
          {isSyncing ? "Syncing Logic..." : "Sync to Modular Code"}
        </Button>
      </div>

      {/* Split View: Design & Guide */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left: Design Preview */}
          <ResizablePanel defaultSize={60} minSize={30} className="relative">
            <div className="h-full bg-white relative">
              <iframe
                srcDoc={html}
                title="Stitch Design Preview"
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              />
              {!html && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-[#0D121F]">
                  <Layout size={40} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">Layar masih kosong. Mulai generate untuk melihat desain.</p>
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle className="w-1 bg-[#1A1F2E] hover:bg-emerald-500/50 transition-colors" />

          {/* Right: Markdown Guide */}
          <ResizablePanel defaultSize={40} minSize={20} className="bg-[#090D18]">
            <div className="h-full flex flex-col">
              <div className="h-8 border-b border-white/5 bg-[#0B0F1A] px-3 flex items-center gap-2">
                <Code2 size={12} className="text-slate-500" />
                <span className="text-[9px] font-bold uppercase text-slate-500 tracking-tight">Implementation Blueprint (.md)</span>
              </div>
              <ScrollArea className="flex-1 p-4">
                <article className="prose prose-invert prose-sm max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {guide || "_Tidak ada panduan yang tersedia._"}
                  </ReactMarkdown>
                </article>
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
