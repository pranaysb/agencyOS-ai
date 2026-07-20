import Link from "next/link";
import { Sparkles, LayoutDashboard, Users, BadgeDollarSign, HeartHandshake } from "lucide-react";

export function TopNav() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-border/50 shadow-sm transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary shadow-inner group-hover:scale-105 transition-transform">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-serif font-semibold tracking-tight text-foreground">AgencyOS AI</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-2">
              <Link href="/dashboard" className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:bg-black/5 hover:text-foreground transition-all">
                <LayoutDashboard className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                Dashboard
              </Link>
              <Link href="/leads" className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:bg-black/5 hover:text-foreground transition-all">
                <Users className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                Leads
              </Link>
              <Link href="/deals" className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:bg-black/5 hover:text-foreground transition-all">
                <BadgeDollarSign className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                Deals
              </Link>
              <Link href="/matches" className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:bg-black/5 hover:text-foreground transition-all">
                <HeartHandshake className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                Matches
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm cursor-pointer hover:bg-primary/20 transition-colors">
              A
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
