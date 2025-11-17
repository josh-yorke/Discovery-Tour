import z from "zod";

export const addProcessSchema = z.object({
  processTitle: z.string().min(5, "title is required"),
  process: z.string().min(5, "process is required"),
});

export const editProcessSchema = z.object({
  processTitle: z.string(),
  process: z.string(),
  fileTitle: z.string().optional(),
  file: z.string().optional(),
  filesAssociated: z.string().optional(),
});

export type addProcessData = z.infer<typeof addProcessSchema>;
export type editProcessData = z.infer<typeof editProcessSchema>;
