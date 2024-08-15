import { z } from "zod";

const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  iconUrl: z.string().nullable(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type Project = z.infer<typeof ProjectSchema>;
