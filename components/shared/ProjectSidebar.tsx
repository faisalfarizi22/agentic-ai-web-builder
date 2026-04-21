import * as React from "react"
import { FileText } from "lucide-react"

export function ProjectSidebar({ isSignedIn, isSidebarOpen, setIsSidebarOpen, projects = [], handleLoadProject }: any) {
  if (!isSidebarOpen || !isSignedIn) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <div className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-[#17202B] border-r border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-6 flex flex-col animate-in slide-in-from-left duration-300 transition-colors">
         <div className="flex justify-between items-center mb-10 pt-2">
           <div className="flex flex-col">
             <h2 className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">Project Kamu</h2>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
             ✕
           </button>
         </div>
         
         <div className="flex-1 flex flex-col overflow-y-auto mb-10 gap-3 pr-2 scroll-smooth">
           {projects.length > 0 ? (
             projects.map((proj: any, idx: number) => (
               <div 
                 key={idx}
                 onClick={() => handleLoadProject(proj)}
                 className="flex flex-col items-start gap-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800/50 hover:border-[#f59e0b] dark:hover:border-[#f59e0b]/50 hover:bg-slate-50 dark:hover:bg-[#233746]/50 cursor-pointer transition-all"
               >
                 <div className="flex items-center gap-2 w-full">
                   <FileText className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                   <h3 className="text-sm font-semibold text-slate-800 dark:text-white truncate w-full">{proj.title}</h3>
                 </div>
                 <p className="text-xs text-slate-500 dark:text-slate-400 ml-6">Terakhir update: {new Date(proj.updatedAt).toLocaleDateString('id-ID')}</p>
                 {proj.status === 'prd_generated' && (
                   <span className="ml-6 mt-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
                     PRD Tersedia
                   </span>
                 )}
               </div>
             ))
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pb-32">
               <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-4 opacity-70" />
               <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada nih, yuk bikin dulu</p>
             </div>
           )}
         </div>
      </div>
    </>
  )
}
