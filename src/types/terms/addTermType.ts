import z from "zod";

export const addTermSchema = z.object({
  title: z.string().min(2, "term title is required"),
  terms: z.string().optional(),
});

export const editTermSchema = z.object({
  title: z.string().min(2, "term title is required"),
  terms: z.string().optional(),
  fileTitle: z.string().optional(),
  file: z.string().optional(),
  filesAssociated: z.string().optional(),
});

export type addTermData = z.infer<typeof addTermSchema>;
export type editTermData = z.infer<typeof editTermSchema>;
