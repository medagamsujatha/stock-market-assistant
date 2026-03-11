import { Link, useLocation } from "wouter";
import { Activity, Terminal, LayoutDashboard, Cpu } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Portfolio", icon: LayoutDashboard },
    { href: "/mcp", label: "MCP Server", icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-sm">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-panel border-r border-y-0 border-l-0 flex flex-col z-10 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-display font-bold tracking-wide text-foreground">IndiaQuant</h1>
            <p className="text-[10px] text-primary uppercase tracking-widest font-mono">Terminal v4.0</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4 px-2">Navigation</div>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-all duration-200 group
                  ${isActive 
                    ? "bg-primary/10 text-primary shadow-[inset_2px_0_0_var(--ring)]" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }
                `}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded border border-border">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--profit))] animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">Market Open</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Ambient background effect */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <header className="h-14 border-b border-border/50 glass-panel flex items-center px-6 shrink-0 z-10 justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cpu className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-wider">System Operational</span>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 z-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
