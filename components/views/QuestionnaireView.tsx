import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export function QuestionnaireView({ questions, answers, setAnswers, handleGeneratePRD, isGeneratingPrd, setCurrentView }: any) {
  if (isGeneratingPrd) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 py-32">
        <Loader2 className="w-16 h-16 text-[#F59E0B] animate-spin mb-8" />
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 text-center">Menyusun Blueprint Sistem...</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center animate-pulse max-w-md">
          AI sedang menganalisa struktur data, merancang arsitektur, dan memikirkan alur penggunaan terbaik untuk aplikasi impian Anda.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500 pb-10">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Mari kita pertajam idemu</h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-10">Jawab pertanyaan ini agar hasil PRD lebih akurat sesuai kebutuhan.</p>

      <div className="w-full space-y-8">
        {questions.map((q: any, idx: number) => (
          <div key={idx} className="bg-white dark:bg-[#233746] border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-none">
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">
              <span className="text-[#f59e0b] mr-2">{idx + 1}.</span> {q.question}
            </h3>
            <div className="flex flex-col gap-3">
              {q.options.map((opt: string, oIdx: number) => (
                <label key={oIdx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#f59e0b]/50 cursor-pointer transition-colors bg-slate-50 dark:bg-[#1C2733]">
                  <input
                    type="radio"
                    name={`q_${idx}`}
                    value={opt}
                    checked={answers[idx] === opt}
                    onChange={() => setAnswers({ ...answers, [idx]: opt })}
                    className="text-[#F59E0B] focus:ring-[#F59E0B]"
                  />
                  <span className="text-slate-700 dark:text-slate-300">{opt}</span>
                </label>
              ))}
              {q.allowCustomInput && (
                <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer bg-slate-50 dark:bg-[#1C2733] focus-within:border-[#F59E0B]">
                  <input
                    type="radio"
                    name={`q_${idx}`}
                    value="_custom_"
                    checked={!!answers[idx]?.startsWith("_custom_:")}
                    onChange={() => setAnswers({ ...answers, [idx]: "_custom_:" })}
                    className="text-[#F59E0B] focus:ring-[#F59E0B]"
                  />
                  <Input
                    className="bg-transparent border-0 focus-visible:ring-0 text-slate-700 dark:text-slate-300 h-6 p-0 shadow-none border-transparent focus-visible:!ring-transparent"
                    placeholder="Lainnya (Ketik jawaban Anda)"
                    value={answers[idx]?.startsWith("_custom_:") ? answers[idx].replace("_custom_:", "") : ""}
                    onChange={(e) => setAnswers({ ...answers, [idx]: `_custom_:${e.target.value}` })}
                    onClick={() => {
                      if (!answers[idx]?.startsWith("_custom_:")) {
                        setAnswers({ ...answers, [idx]: "_custom_:" })
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-4">
          <Button variant="ghost" onClick={() => setCurrentView("discovery")} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border-0">
            Kembali
          </Button>
          <Button
            onClick={handleGeneratePRD}
            disabled={Object.keys(answers).length < Object.keys(questions).length}
            className="bg-[#F59E0B] hover:bg-[#d97706] text-white px-8 h-12 text-md shadow-lg border-0"
          >
            Eksekusi Buat PRD
          </Button>
        </div>
      </div>
    </div>
  )
}
