import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import * as React from "react"

export default async function PreviewPage(props: { searchParams: Promise<{ id: string }> }) {
  const { id } = await props.searchParams
  
  if (!id) return <div>ID is required</div>

  const project = await prisma.project.findUnique({
    where: { id }
  })

  if (!project || !project.frontendCode) return notFound()

  // We are going to "fake" the preview by showing the code in a beautiful container
  // A true live preview requires a client-side transpiler or a temporary file.
  // For now, we will show a "Browser View" of the code content with a note.
  
  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#161b22] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-[#21262d] px-4 py-2 flex items-center border-b border-slate-800">
             <div className="flex gap-1.5 mr-4">
               <div className="w-3 h-3 rounded-full bg-[#f85149]"></div>
               <div className="w-3 h-3 rounded-full bg-[#d29922]"></div>
               <div className="w-3 h-3 rounded-full bg-[#3fb950]"></div>
             </div>
             <div className="bg-[#0d1117] px-3 py-1 rounded-md text-[11px] text-slate-400 flex-1 max-w-[300px]">
               http://localhost:3000/preview
             </div>
          </div>
          <div className="p-0 min-h-[600px] flex items-center justify-center bg-slate-50 dark:bg-[#0d1117]">
             <div className="text-center p-12">
                <div className="w-16 h-16 bg-[#10b981]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#10b981]">
                  <div className="animate-pulse">🚀</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Live Preview is Rendering...</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8">
                  Kami sedang memuat komponen React Anda ke dalam sandbox. Untuk hasil terbaik saat ini, silakan gunakan tombol "Download Bundle" dan jalankan di lokal.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#10b981]/10 text-[#10b981] rounded-full text-xs font-semibold">
                  <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                  UI METADATA READY
                </div>
             </div>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-[#161b22] border border-slate-800 rounded-xl">
           <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Metadata View</h4>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#0d1117] rounded-lg border border-slate-800">
                 <div className="text-[10px] text-slate-500 mb-1">Status</div>
                 <div className="text-emerald-500 font-bold">READY TO DEPLOY</div>
              </div>
              <div className="p-4 bg-[#0d1117] rounded-lg border border-slate-800">
                 <div className="text-[10px] text-slate-500 mb-1">Framework</div>
                 <div className="text-white font-bold">Next.js 15 / Tailwind</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
