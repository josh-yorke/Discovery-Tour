import z from "zod";

export const addDocumentSchema = z.object({
  docDescription: z.string().min(2, "document description is required"),
  docTitle: z.string().min(2, "document title is required"),
});

export const editDocumentSchema = z.object({
  description: z.string().min(2, "document description is required"),
  title: z.string().min(2, "document title is required"),
  fileTitle: z.string().optional(),
  file: z.string().optional(),
  filesAssociated: z.string().optional(),
});

export type addDocumentData = z.infer<typeof addDocumentSchema>;
export type editDocumentData = z.infer<typeof editDocumentSchema>;
