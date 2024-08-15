import { z } from "zod";

const ProjectTokenSchema = z.object({
  id: z.number(),
  projectId: z.string().uuid(),
  tokenId: z.string().uuid(),
  createdBy: z.string().uuid(),
  createdAt: z.string(),
});

export type ProjectToken = z.infer<typeof ProjectTokenSchema>;
