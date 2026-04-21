import { BuilderView } from "@/components/builder/builder-view"

export const metadata = {
  title: "Builder - Brainwave",
  description: "AI Website Builder Interface",
}

export default function BuilderPage() {
  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <BuilderView />
    </main>
  )
}
