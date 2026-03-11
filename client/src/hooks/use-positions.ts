import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Parse function with logging for defensive data handling
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function usePositions() {
  return useQuery({
    queryKey: [api.positions.list.path],
    queryFn: async () => {
      const res = await fetch(api.positions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch positions");
      const data = await res.json();
      return parseWithLogging(api.positions.list.responses[200], data, "positions.list");
    },
  });
}

type CreatePositionInput = z.infer<typeof api.positions.create.input>;

export function useCreatePosition() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePositionInput) => {
      const validated = api.positions.create.input.parse(data);
      const res = await fetch(api.positions.create.path, {
        method: api.positions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create position");
      }
      
      const responseData = await res.json();
      return parseWithLogging(api.positions.create.responses[201], responseData, "positions.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.positions.list.path] });
    },
  });
}

export function useDeletePosition() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.positions.delete.path, { id });
      const res = await fetch(url, { 
        method: api.positions.delete.method,
        credentials: "include" 
      });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Position not found");
        throw new Error("Failed to delete position");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.positions.list.path] });
    },
  });
}
