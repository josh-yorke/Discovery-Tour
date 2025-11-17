import z from "zod";

export const addTermSchema = z.object({
  title: z.string().min(5, "plan name is required"),
  terms: z.string().min(5, "fee is required"),
});

export const editTermSchema = z.object({
  title: z.string().min(5, "plan name is required"),
  terms: z.string().min(5, "fee is required"),
  fileTitle: z.string().optional(),
  file: z.string().optional(),
  filesAssociated: z.string().optional(),
});

export type addTermData = z.infer<typeof addTermSchema>;
export type editTermData = z.infer<typeof editTermSchema>;
