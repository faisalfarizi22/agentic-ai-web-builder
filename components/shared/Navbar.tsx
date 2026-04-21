import * as React from "react"
import { Button } from "@/components/ui/button"
import { FileText, Sun, Moon, LogOut, Settings, HelpCircle } from "lucide-react"
import Image from "next/image"
import { SignInButton, useClerk } from "@clerk/nextjs"

interface NavbarProps {
  isSignedIn: boolean;
  user: any;
  theme: string;
  setTheme: (theme: string) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  setIsSidebarOpen: (open: boolean) => void;
}

export function Navbar({ isSignedIn, user, theme, setTheme, isProfileOpen, setIsProfileOpen, setIsSidebarOpen }: NavbarProps) {
  const { signOut } = useClerk()
  
  return (
    <div className="w-full h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#17202B] transition-colors relative z-20">
      <div className="flex items-center">
        <Image src="/logo.png" alt="WUUS Logo" width={100} height={33} className="object-contain w-auto h-[33px]" />
      </div>
      
      <div className="flex items-center gap-4">
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <Button className="bg-[#F59E0B] hover:bg-[#d97706] text-white text-sm font-semibold px-6 rounded-md">Log in</Button>
          </SignInButton>
        ) : (
          <>
            <div className="hidden md:flex px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-300">Free</div>
            <Button className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-semibold h-8 px-4 rounded-md">Upgrade</Button>
            
            <div className="relative ml-2 flex items-center justify-center">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden outline-none focus:ring-2 focus:ring-[#f59e0b] shadow-sm flex items-center justify-center bg-emerald-500 text-white font-bold text-sm"
              >
                {user?.imageUrl ? <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" /> : user?.firstName?.charAt(0) || "U"}
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 top-12 w-64 bg-white dark:bg-[#1f2d3d] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 flex flex-col p-2 text-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-700/50 mb-1">
                      <div className="font-bold text-slate-800 dark:text-white truncate">{user?.username || user?.firstName}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-xs truncate">{user?.primaryEmailAddress?.emailAddress}</div>
                    </div>

                    <button onClick={() => { setIsSidebarOpen(true); setIsProfileOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg text-left text-slate-700 dark:text-slate-300 transition-colors font-medium">
                      <FileText className="w-4 h-4" /> Project Kamu
                    </button>

                    <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg text-left text-slate-700 dark:text-slate-300 transition-colors font-medium">
                      <Settings className="w-4 h-4" /> Pengaturan
                    </button>

                    <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg text-left text-slate-700 dark:text-slate-300 transition-colors font-medium">
                      <HelpCircle className="w-4 h-4" /> Bantuan
                    </button>

                    <button onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setIsProfileOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg text-left text-slate-700 dark:text-slate-300 transition-colors font-medium">
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-1"></div>

                    <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg text-left text-slate-700 dark:text-slate-300 transition-colors font-medium">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>

                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
