import { usePositions, useDeletePosition } from "@/hooks/use-positions";
import { AddPositionDialog } from "@/components/add-position-dialog";
import { Layout } from "@/components/layout";
import { Trash2, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Portfolio() {
  const { data: positions, isLoading, isError, refetch } = usePositions();
  const deletePosition = useDeletePosition();
  const { toast } = useToast();

  const formatCurrency = (val: string | number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(Number(val));
  };

  const handleDelete = (id: number, symbol: string) => {
    if (confirm(`Are you sure you want to close position: ${symbol}?`)) {
      deletePosition.mutate(id, {
        onSuccess: () => {
          toast({ title: "Position Closed", description: `${symbol} removed from portfolio.` });
        }
      });
    }
  };

  // Calculate metrics
  const totalPositions = positions?.length || 0;
  const totalValue = positions?.reduce((acc, pos) => acc + (pos.quantity * Number(pos.averagePrice)), 0) || 0;

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient">Live Portfolio</h1>
            <p className="text-muted-foreground mt-1 text-sm">Real-time tracking of current holdings and exposure.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => refetch()} 
              disabled={isLoading}
              className="bg-secondary/50 border-border hover:bg-secondary hover:text-primary transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <AddPositionDialog />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-xl border border-border/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Gross Exposure</div>
            <div className="text-2xl font-mono text-foreground">{formatCurrency(totalValue)}</div>
          </div>
          <div className="glass-panel p-5 rounded-xl border border-border/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Open Positions</div>
            <div className="text-2xl font-mono text-foreground">{totalPositions}</div>
          </div>
          <div className="glass-panel p-5 rounded-xl border border-border/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--profit))]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
              System Status <span className="flex h-2 w-2 rounded-full bg-[hsl(var(--profit))]"></span>
            </div>
            <div className="text-lg font-mono text-[hsl(var(--profit))]">ONLINE & SYNCED</div>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-panel rounded-xl overflow-hidden border border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs font-mono uppercase tracking-wider text-muted-foreground bg-secondary/30 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Instrument</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium text-right">Qty</th>
                  <th className="px-6 py-4 font-medium text-right">Avg Px</th>
                  <th className="px-6 py-4 font-medium text-right">Value</th>
                  <th className="px-6 py-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="font-mono divide-y divide-border/50">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24 bg-border" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16 bg-border" /></td>
                      <td className="px-6 py-4 flex justify-end"><Skeleton className="h-4 w-12 bg-border" /></td>
                      <td className="px-6 py-4 flex justify-end"><Skeleton className="h-4 w-20 bg-border" /></td>
                      <td className="px-6 py-4 flex justify-end"><Skeleton className="h-4 w-24 bg-border" /></td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-8 h-8 text-destructive/70" />
                        <span>Connection error. Failed to retrieve positions.</span>
                      </div>
                    </td>
                  </tr>
                ) : positions?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <TrendingUp className="w-8 h-8 opacity-20" />
                        <span className="font-sans">No active positions found.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  positions?.map((pos) => (
                    <tr key={pos.id} className="hover:bg-secondary/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors uppercase">
                          {pos.symbol}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider ${
                          pos.type === 'equity' 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {pos.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">{pos.quantity}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(pos.averagePrice)}</td>
                      <td className="px-6 py-4 text-right font-medium">
                        {formatCurrency(pos.quantity * Number(pos.averagePrice))}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(pos.id, pos.symbol)}
                          className="w-8 h-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
