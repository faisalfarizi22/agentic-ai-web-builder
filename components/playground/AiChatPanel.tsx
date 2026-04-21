import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Loader2, User, Bot, History } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiChatPanelProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  messages: Message[];
}

export function AiChatPanel({ onSendMessage, isProcessing, messages }: AiChatPanelProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] border-l border-slate-800 w-80 lg:w-96">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          AI Refinement
        </h3>
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
          <History className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <Bot className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-sm text-slate-500">
                Halo! Saya asisten AI Anda. Ingin mengubah desain atau menambah fitur? Ketik perintah apa saja.
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3 text-sm",
                msg.role === "assistant" ? "flex-row" : "flex-row-reverse"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border",
                msg.role === "assistant" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-400"
              )}>
                {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl max-w-[85%] leading-relaxed",
                msg.role === "assistant" ? "bg-slate-800/50 text-slate-300 rounded-tl-none" : "bg-emerald-600 text-white rounded-tr-none"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="p-3 bg-slate-800/50 text-slate-400 rounded-2xl rounded-tl-none">
                Sedang memproses permintaan Anda...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
        <form onSubmit={handleSubmit} className="relative">
          <Input
            placeholder="Contoh: 'Tampilkan hero gambar di kiri'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 pr-12 focus:ring-emerald-500/50"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isProcessing}
            className="absolute right-1 top-1 bottom-1 h-auto w-10 bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            <Send size={16} />
          </Button>
        </form>
        <p className="text-[10px] text-slate-600 mt-2 text-center">
          Powered by WUUS Design Intelligence & Stitch
        </p>
      </div>
    </div>
  );
}
