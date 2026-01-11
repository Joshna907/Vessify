import Link from "next/link"
import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TransactionExtractor from "@/components/TransactionExtractor"
import TransactionList from "@/components/TransactionList"
import { SiteFooter } from "@/components/SiteFooter"
import { LogOut, Sparkles } from "lucide-react"

export default async function Dashboard() {
  const session = await auth()
  // if (!session) redirect("/login")

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="spotlight-effect" />
      <div className="noise-overlay" />
      <div className="letter-side-left" />
      <div className="letter-side-right" />

      {/* Navbar */}
      {/* Floating Liquid Navbar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 h-14 w-[90%] max-w-5xl flex items-center px-6 navbar-glass transition-all duration-300 hover:bg-black/40">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-500" />
              <h1 className="text-base font-semibold tracking-tight">Vessify</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm text-foreground/80 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-sm text-foreground/80 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-sm text-foreground/80 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-sm text-foreground/80 hover:text-white transition-colors">Documentation</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <span className="text-[10px] font-bold text-green-400">
                  {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <span className="text-xs font-medium text-foreground/80 pr-1">
                {session?.user?.name || session?.user?.email?.split('@')[0] || "Dashboard"}
              </span>
            </div>
            {session && (
              <form action={async () => {
                "use server"
                await signOut()
              }}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/5 rounded-full">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pt-32 md:p-8 md:pt-36 lg:p-12 lg:pt-40 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Hero */}
          <div className="text-center space-y-8 py-20 hero-glow">
            <div className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-5 py-2 text-xs font-semibold text-green-400 backdrop-blur-sm shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)] hover:bg-green-500/20 transition-colors cursor-default">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              AI-Powered Transaction Extraction
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
              <span className="inline-block bg-gradient-to-b from-white via-white/95 to-white/60 bg-clip-text text-transparent">
                The Smarter Way
              </span>
              <br />
              <span className="inline-block bg-gradient-to-b from-white via-white/95 to-white/60 bg-clip-text text-transparent">
                to Grow Your Business
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground/80 text-lg md:text-xl font-light leading-relaxed">
              Vessify helps modern teams streamline their work with a powerful, flexible platform that scales with you.
            </p>
            <div className="flex items-center justify-center gap-4 pt-6">
              <Link href="/register">
                <Button size="lg" className="btn-liquid h-12 px-8 text-base font-medium rounded-full border-0 hover:bg-transparent">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 h-12 px-8 text-base font-medium rounded-full backdrop-blur-md">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-1" id="extraction">
              <div className="glass-card rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-2xl hover:shadow-white/5">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">New Extraction</h3>
                    <p className="text-sm text-muted-foreground/80 mt-1">Paste transaction text below</p>
                  </div>
                  <TransactionExtractor session={session} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-2xl hover:shadow-white/5">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">Recent Activity</h3>
                    <p className="text-sm text-muted-foreground/80 mt-1">Your transaction history</p>
                  </div>
                  <TransactionList session={session} />
                </div>
              </div>
            </div>
          </div>


        </div>
      </main>

      <SiteFooter />
    </div>
  )
}