import { z } from "zod";

const InsightSchema = z.object({
  id: z.number(),
  name: z.string(),
  value: z.string(),
  position: z.number(),
  icon: z.string().nullable(),
  projectId: z.string().uuid(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type Insight = z.infer<typeof InsightSchema>;
