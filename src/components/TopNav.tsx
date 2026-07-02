import Link from "next/link";
import { Sparkles, LayoutDashboard, Users, BadgeDollarSign, HeartHandshake } from "lucide-react";

export function TopNav() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">AgencyOS AI</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-8">
              <Link href="/dashboard" className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/leads" className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Users className="h-4 w-4" />
                Leads
              </Link>
              <Link href="/deals" className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <BadgeDollarSign className="h-4 w-4" />
                Deals
              </Link>
              <Link href="/matches" className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <HeartHandshake className="h-4 w-4" />
                Matches
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              A
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
