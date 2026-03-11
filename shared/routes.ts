import { z } from 'zod';
import { insertPositionSchema, positions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  positions: {
    list: {
      method: 'GET' as const,
      path: '/api/positions' as const,
      responses: {
        200: z.array(z.custom<typeof positions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/positions' as const,
      input: insertPositionSchema,
      responses: {
        201: z.custom<typeof positions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/positions/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type PositionResponse = z.infer<typeof api.positions.list.responses[200]>[0];
