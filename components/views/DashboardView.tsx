import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, FileText, Code, Rocket, ArrowRight } from "lucide-react"
import { SignInButton } from "@clerk/nextjs"

export function DashboardView({ user, isSignedIn, setCurrentView }: any) {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center animate-in fade-in zoom-in-95 duration-300 py-8">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight text-center">Halo, {user?.firstName || 'Sahabat'}!</h1>
      <h2 className="text-xl text-slate-500 dark:text-slate-400 mb-16 text-center text-[16px]">Mau bangun masa depan bisnismu hari ini?</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full px-4 mb-16">
        <Card className="bg-white dark:bg-[#233746] border-[#f59e0b] border-[1.5px] p-6 rounded-xl flex flex-col items-start min-h-[160px] shadow-sm dark:shadow-none">
          <div className="w-10 h-10 rounded-md bg-[#f59e0b]/10 dark:bg-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b] mb-4">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-slate-800 dark:text-white font-bold mb-2">1. Discovery</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed text-[12px]">Tanya jawab dengan AI untuk menggali visi dan kebutuhan website Anda.</p>
        </Card>

        <Card className="bg-white dark:bg-[#233746] border-[#f59e0b]/30 border-[1.5px] p-6 rounded-xl flex flex-col items-start min-h-[160px] shadow-sm dark:shadow-none">
          <div className="w-10 h-10 rounded-md bg-[#f59e0b]/5 dark:bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]/70 mb-4">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-slate-800 dark:text-white font-bold mb-2 text-[15px]">2. Bikin PRD</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed text-[12px]">Sistem merangkum blueprint fitur website (PRD) secara otomatis.</p>
        </Card>

        <Card className="bg-white dark:bg-[#233746] border-[#f59e0b]/30 border-[1.5px] p-6 rounded-xl flex flex-col items-start min-h-[160px] shadow-sm dark:shadow-none">
          <div className="w-10 h-10 rounded-md bg-[#f59e0b]/5 dark:bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]/70 mb-4">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="text-slate-800 dark:text-white font-bold mb-2 text-[15px]">3. AI Build</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed text-[12px]">AI Builder men-generate struktur, UI/UX, dan kode secara real-time.</p>
        </Card>

        <Card className="bg-white dark:bg-[#233746] border-[#f59e0b]/30 border-[1.5px] p-6 rounded-xl flex flex-col items-start min-h-[160px] shadow-sm dark:shadow-none">
          <div className="w-10 h-10 rounded-md bg-[#f59e0b]/5 dark:bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]/70 mb-4">
            <Rocket className="w-5 h-5" />
          </div>
          <h3 className="text-slate-800 dark:text-white font-bold mb-2 text-[15px]">4. Publish</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed text-[12px]">Tinjau dan sesuaikan hasil sebelum mendeploy website impian ke dunia.</p>
        </Card>
      </div>

      <div className="w-full flex justify-center">
        {isSignedIn ? (
          <Button 
            onClick={() => setCurrentView("discovery")}
            className="bg-[#F59E0B] hover:bg-[#d97706] text-white px-10 h-14 rounded-lg font-bold text-lg flex items-center gap-2 transition-all hover:scale-[1.02] shadow-lg border-0"
          >
            Buat websitemu sekarang <ArrowRight className="w-5 h-5" />
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button className="bg-[#F59E0B] hover:bg-[#d97706] text-white px-10 h-14 rounded-lg font-bold text-lg flex items-center gap-2 transition-all hover:scale-[1.02] shadow-lg border-0">
              Buat websitemu sekarang <ArrowRight className="w-5 h-5" />
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  )
}
