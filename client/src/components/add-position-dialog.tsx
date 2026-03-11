import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertPositionSchema } from "@shared/schema";
import { useCreatePosition } from "@/hooks/use-positions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";

// Extend schema for the form to handle HTML string inputs natively
const formSchema = insertPositionSchema.extend({
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  averagePrice: z.coerce.string().min(1, "Price is required"), 
});

type FormValues = z.infer<typeof formSchema>;

export function AddPositionDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createPosition = useCreatePosition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      quantity: 1,
      averagePrice: "",
      type: "equity",
    },
  });

  const onSubmit = (data: FormValues) => {
    createPosition.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast({
          title: "Position Added",
          description: `Successfully added ${data.quantity} shares of ${data.symbol.toUpperCase()}`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono uppercase tracking-wider text-xs px-4 h-9">
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border shadow-2xl glass-panel">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Execute Trade Entry
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="symbol" className="text-xs uppercase font-mono text-muted-foreground tracking-wider">Symbol</Label>
            <Input
              id="symbol"
              placeholder="e.g. RELIANCE"
              className="font-mono uppercase bg-secondary/50 border-border focus:border-primary transition-colors"
              {...form.register("symbol")}
            />
            {form.formState.errors.symbol && (
              <p className="text-destructive text-xs font-mono">{form.formState.errors.symbol.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-xs uppercase font-mono text-muted-foreground tracking-wider">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                className="font-mono bg-secondary/50 border-border focus:border-primary transition-colors"
                {...form.register("quantity")}
              />
              {form.formState.errors.quantity && (
                <p className="text-destructive text-xs font-mono">{form.formState.errors.quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="averagePrice" className="text-xs uppercase font-mono text-muted-foreground tracking-wider">Avg Price (₹)</Label>
              <Input
                id="averagePrice"
                type="number"
                step="0.05"
                placeholder="0.00"
                className="font-mono bg-secondary/50 border-border focus:border-primary transition-colors"
                {...form.register("averagePrice")}
              />
              {form.formState.errors.averagePrice && (
                <p className="text-destructive text-xs font-mono">{form.formState.errors.averagePrice.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-xs uppercase font-mono text-muted-foreground tracking-wider">Instrument Type</Label>
            <Select 
              onValueChange={(val) => form.setValue("type", val)} 
              defaultValue={form.getValues("type")}
            >
              <SelectTrigger className="font-mono bg-secondary/50 border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border font-mono">
                <SelectItem value="equity">EQUITY</SelectItem>
                <SelectItem value="option">OPTION</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-destructive text-xs font-mono">{form.formState.errors.type.message}</p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-border">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="font-mono text-xs uppercase hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createPosition.isPending}
              className="font-mono text-xs uppercase bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {createPosition.isPending ? (
                <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Transmitting...</>
              ) : (
                "Confirm Entry"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
