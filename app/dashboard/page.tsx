import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, FileText, Code, Rocket, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const timelineSteps = [
    {
      title: "Discovery & Analisis",
      description: "Tanya jawab dengan AI kami untuk menggali visi, kebutuhan, dan fitur yang dibutuhkan oleh bisnis Anda.",
      icon: Search,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Pembuatan PRD",
      description: "Sistem akan otomatis merangkum diskusi menjadi Product Requirements Document (PRD) yang solid sebagai Blueprint pengembangan.",
      icon: FileText,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20"
    },
    {
      title: "AI Development",
      description: "Berdasarkan PRD, AI Builder mulai men-generate struktur, UI/UX, dan kode secara real-time.",
      icon: Code,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      title: "Customization & Publish",
      description: "Anda bisa meninjau dan menyesuaikan hasil sebelum mendeploy website impian Anda ke dunia secara instan.",
      icon: Rocket,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    }
  ]

  return (
    <div className="flex-1 p-8 pt-12 bg-background min-h-[calc(100vh-2rem)] text-foreground flex flex-col items-center">
      <div className="mb-14">
        <Image 
          src="/logo.png" 
          alt="WUUS Logo" 
          width={180} 
          height={60} 
          priority
          className="object-contain"
        />
      </div>

      <div className="max-w-2xl w-full text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-primary">
          Perjalanan Menuju Website Impian
        </h1>
        <p className="text-lg text-muted-foreground">
          Berikut adalah tahapan yang akan Anda lalui bersama AI kami untuk mewujudkan website yang profesional.
        </p>
      </div>

      <div className="max-w-2xl w-full relative mb-16">
        {/* Vertical line connecting steps */}
        <div className="absolute left-[39px] md:left-1/2 top-4 bottom-4 w-px bg-border md:transform md:-translate-x-1/2"></div>

        <div className="space-y-12 relative">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="flex flex-col md:flex-row items-center md:justify-between w-full relative gap-6 md:gap-0">
                {/* Desktop alternating layout, mobile always stacking right of the icon */}
                <div className={`w-full md:w-[45%] flex ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start order-last md:order-last'} pl-[80px] md:pl-0`}>
                  <Card className={`w-full bg-card/40 backdrop-blur-sm border ${step.borderColor} hover:bg-card/80 transition-colors shadow-sm`}>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Center Icon */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center z-10 mt-1 md:mt-0">
                  <div className={`w-12 h-12 rounded-full border-[3px] border-background ${step.bgColor} flex items-center justify-center shadow-lg ring-1 ring-border/50`}>
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                </div>

                {/* Empty div for spacing on the other side */}
                <div className={`w-full md:w-[45%] hidden md:block ${index % 2 === 0 ? 'order-last' : 'order-first'}`}></div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-8 mb-12">
        <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 gap-2 rounded-full">
          Buat websitemu sekarang <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
