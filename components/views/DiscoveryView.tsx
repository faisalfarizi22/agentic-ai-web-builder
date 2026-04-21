import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileText, ArrowUp, Loader2 } from "lucide-react"

export function DiscoveryView({ idea, setIdea, language, setLanguage, isGeneratingQuestions, handleStartDiscovery, setIsSidebarOpen }: any) {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight flex items-center gap-3">
        Mau bikin apa?
        <div className="w-10 h-10 rounded-md bg-[#f59e0b]/10 dark:bg-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b] ml-2">
          <FileText className="w-5 h-5" />
        </div>
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Ubah Ide usaha kamu menjadi rencana platform terstruktur.</p>

      <div className="w-full bg-white dark:bg-[#233746] border border-slate-200 dark:border-slate-700 rounded-xl p-2 relative overflow-hidden focus-within:border-[#F59E0B] dark:focus-within:border-slate-500 transition-colors shadow-sm dark:shadow-none">
        <Textarea
          className="min-h-[120px] bg-transparent border-0 focus-visible:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none text-base w-full shadow-none"
          placeholder='Contoh: "Aplikasi kasir bengkel motor keliling, teknisi bisa update stok sparepart..."'
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
        <div className="flex justify-between items-center p-2 pt-0">
          <div 
            className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300"
            onClick={() => setLanguage((lang: string) => lang === "id" ? "en" : "id")}
          >
            <span>🌐</span> {language === "id" ? "Bahasa Indonesia" : "English"} <span className="text-[10px]">▼</span>
          </div>
          <Button
            onClick={handleStartDiscovery}
            disabled={isGeneratingQuestions || !idea.trim()}
            className="bg-slate-100 dark:bg-slate-700 hover:bg-[#F59E0B] dark:hover:bg-[#F59E0B] text-slate-600 dark:text-slate-300 hover:text-white rounded-lg w-10 h-10 p-0 flex items-center justify-center transition-colors"
          >
            {isGeneratingQuestions ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <ArrowUp className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="mt-8 text-sm text-slate-500 flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        Lihat project sebelumnya
      </button>
    </div>
  )
}
