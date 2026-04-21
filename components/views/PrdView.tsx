import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Copy, ArrowRight, CheckCircle2 } from "lucide-react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import mermaid from "mermaid"

export const MermaidBlock = ({ code }: { code: string }) => {
  const [svgStr, setSvgStr] = React.useState("")
  const [error, setError] = React.useState(false)
  const id = React.useMemo(() => 'mermaid-' + Math.random().toString(36).substr(2, 9), [])
  
  React.useEffect(() => {
    const render = async () => {
      try {
        mermaid.initialize({ startOnLoad: false, theme: 'dark', fontFamily: 'sans-serif' });
        const { svg } = await mermaid.render(id, code);
        setSvgStr(svg);
      } catch (err) {
        console.error(err)
        setError(true)
      }
    }
    render()
  }, [code, id])
  
  if (error) return <pre className="bg-red-500/10 p-2 text-red-500 rounded text-xs">{code}</pre>
  if (!svgStr) return <div className="animate-pulse h-32 bg-slate-100 dark:bg-slate-800/50 rounded-lg w-full my-4 flex items-center justify-center text-slate-500">Rendering Diagram...</div>
  return <div dangerouslySetInnerHTML={{ __html: svgStr }} className="flex justify-center my-8 bg-white dark:bg-[#17202b] shadow-sm dark:shadow-none p-6 rounded-xl border border-slate-200 dark:border-slate-800/50 overflow-x-auto w-full" />
}

export function PrdView({ prd, prdHeaders, setCurrentView, handleGenerateCode }: any) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    if (!prd) return
    navigator.clipboard.writeText(prd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-[85vh] animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
              <FileText className="w-5 h-5 text-[#F59E0B]" />
            </div>
            Blueprint PRD
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 ml-10">Hasil ekstraksi visi dan kebutuhan sistem.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCopy} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-0">
            {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Tersalin!" : "Copy"}
          </Button>
          <Button onClick={handleGenerateCode} className="bg-[#10b981] hover:bg-[#059669] text-white shadow-lg border-0 px-6 font-semibold">
            Lanjut ke AI Build <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button onClick={() => setCurrentView("dashboard")} className="bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 p-2 w-10 border-0">
            ✕
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* PRD Table of Contents Sidebar */}
        <Card className="w-64 bg-white dark:bg-[#17202b] border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col shadow-xl overflow-y-auto hidden md:flex rounded-xl">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project Requirements Document</h3>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {prdHeaders.map((header: string, idx: number) => (
              <a key={idx} href={`#${header.replace(/\s+/g, '-').toLowerCase()}`} className="text-slate-500 dark:text-slate-400 hover:text-[#f59e0b] dark:hover:text-[#f59e0b] hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg text-sm transition-colors border-b border-slate-100 dark:border-slate-800/50 block">
                {header}
              </a>
            ))}
            {prdHeaders.length === 0 && <span className="text-xs text-slate-400 dark:text-slate-500 italic px-2">Dokumen diproses...</span>}
          </div>
        </Card>

        {/* Main Content Area */}
        <Card className="flex-1 bg-white dark:bg-[#233746] border-slate-200 dark:border-slate-700 overflow-y-auto flex flex-col shadow-xl p-8 lg:px-12 scroll-smooth rounded-xl">
          {prd === "" ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-50">
              <FileText className="w-12 h-12 text-slate-500 animate-pulse mb-4" />
              <p className="text-slate-500 dark:text-slate-400">Rendering dokumen...</p>
            </div>
          ) : (
            <div className="max-w-4xl w-full mx-auto pb-20">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    if (!inline && match && match[1] === 'mermaid') {
                      return <MermaidBlock code={String(children).replace(/\n$/, '')} />
                    }
                    return (
                      <code className={`${className} bg-slate-100 dark:bg-slate-800 text-[#ea580c] dark:text-[#f59e0b] px-1 py-0.5 rounded text-sm`} {...props}>
                        {children}
                      </code>
                    )
                  },
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-10 mb-4 text-[#ea580c] dark:text-[#f59e0b] flex items-center gap-2" id={props.children?.toString().replace(/\s+/g, '-').toLowerCase()} {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-6 mb-3 text-slate-800 dark:text-white" {...props} />,
                  p: ({node, ...props}) => <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 text-[15px]" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 mb-4 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 text-slate-700 dark:text-slate-300 mb-4 space-y-2" {...props} />,
                  table: ({node, ...props}) => <div className="overflow-x-auto my-6"><table className="w-full border-collapse text-sm text-left" {...props} /></div>,
                  th: ({node, ...props}) => <th className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 font-semibold text-slate-800 dark:text-slate-200" {...props} />,
                  td: ({node, ...props}) => <td className="border border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300 bg-white dark:bg-[#233746]/50" {...props} />,
                  a: ({node, ...props}) => <a className="text-[#ea580c] dark:text-[#f59e0b] hover:underline" {...props} />,
                }}
              >
                {prd}
              </ReactMarkdown>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
