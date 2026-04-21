import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <div className="w-full relative isolate overflow-hidden bg-background">
      {/* Subtle modern background accent without excessive gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 opacity-20" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#9c27b0] to-[#ce93d8] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            From Concept to Code in <span className="text-primary">Minutes</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Brainwave accelerates your web creation. Describe your idea and let AI generate the PRD, frontend design, and backend infrastructure—all downloadable and ready to deploy.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/builder">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-sm hover:shadow-md transition-all">
                Start Building Now
              </Button>
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        
        {/* Abstract mock UI rendering to show product capability visually */}
        <div className="mt-16 flow-root sm:mt-24 max-w-5xl mx-auto">
          <div className="-m-2 rounded-xl bg-secondary/30 p-2 ring-1 ring-inset ring-secondary/50 lg:-m-4 lg:rounded-2xl lg:p-4 hover:shadow-lg transition-all duration-500 ease-in-out">
            <div className="rounded-md ring-1 ring-border shadow-sm py-8 px-6 bg-card flex gap-4 h-[400px]">
              <div className="w-1/4 h-full border-r border-border pr-4 space-y-4 flex flex-col">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted/60 rounded w-full"></div>
                <div className="h-4 bg-muted/60 rounded w-5/6"></div>
                <div className="h-4 bg-muted/60 rounded w-full"></div>
                <div className="mt-auto h-10 border border-primary/20 bg-primary/5 rounded w-full flex items-center justify-center text-primary text-sm font-medium">Generating Code...</div>
              </div>
              <div className="w-3/4 h-full space-y-4">
                <div className="h-32 bg-secondary/50 rounded flex items-center justify-center">
                  <div className="h-8 bg-background rounded w-1/3"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-muted/30 rounded"></div>
                  <div className="h-24 bg-muted/30 rounded"></div>
                  <div className="h-24 bg-muted/30 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
