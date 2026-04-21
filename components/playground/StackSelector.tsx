import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout, Globe, Cpu, Server, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type TechStack = "html" | "nextjs" | "react" | "nodejs";

interface StackSelectorProps {
  selectedStack: TechStack;
  onSelect: (stack: TechStack) => void;
  onConfirm: () => void;
}

const stacks = [
  {
    id: "html",
    name: "Pure HTML/CSS",
    description: "Static files, vanilla CSS. Fastest loading, simplest structure.",
    icon: Globe,
    recommended: false,
  },
  {
    id: "nextjs",
    name: "Next.js + Tailwind",
    description: "Modern App Router, high performance, and best developer experience.",
    icon: Layout,
    recommended: true,
  },
  {
    id: "react",
    name: "React (Vite)",
    description: "Client-side only React application using Vite build tool.",
    icon: Cpu,
    recommended: false,
  },
  {
    id: "nodejs",
    name: "Node.js + Express",
    description: "Backend-focused with simple EJS or static frontend serving.",
    icon: Server,
    recommended: false,
  },
];

export function StackSelector({ selectedStack, onSelect, onConfirm }: StackSelectorProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Pilih Stack Teknologi</h2>
        <p className="text-slate-400">Pilih fondasi yang ingin Anda gunakan untuk proyek ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {stacks.map((stack) => {
          const Icon = stack.icon;
          const isSelected = selectedStack === stack.id;
          
          return (
            <Card 
              key={stack.id}
              className={cn(
                "relative cursor-pointer transition-all duration-300 border-2 bg-slate-900/50 hover:bg-slate-800/80 group",
                isSelected ? "border-emerald-500 ring-1 ring-emerald-500/50" : "border-slate-800 hover:border-slate-700"
              )}
              onClick={() => onSelect(stack.id as TechStack)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isSelected ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400 group-hover:text-slate-300"
                  )}>
                    <Icon size={24} />
                  </div>
                  {stack.recommended && (
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Recommended
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl mt-4 text-white">{stack.name}</CardTitle>
                <CardDescription className="text-slate-400 min-h-[40px]">
                  {stack.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-700 opacity-0 group-hover:opacity-100"
                )}>
                  {isSelected && <Check size={14} strokeWidth={4} />}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          size="lg" 
          onClick={onConfirm}
          className="px-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold py-6 h-auto"
        >
          Lanjutkan ke PRD
        </Button>
      </div>
    </div>
  );
}
