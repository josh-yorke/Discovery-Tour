import z from "zod";

export const addDocumentSchema = z.object({
  docDescription: z.string().min(2, "document description is required"),
  docTitle: z.string().min(2, "document title is required"),
  formattedLinksForDocument: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        link: z.string().url("Must be a valid URL").min(1, "URL is required"),
      }),
    )
    .default([]),
});

export const editDocumentSchema = z.object({
  description: z.string().min(2, "document description is required"),
  title: z.string().min(2, "document title is required"),
  fileTitle: z.string().optional(),
  file: z.string().optional(),
  filesAssociated: z.string().optional(),
  formattedLinksForDocument: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        link: z.string().url("Must be a valid URL").min(1, "URL is required"),
      }),
    )
    .default([]),
});

export type addDocumentData = z.infer<typeof addDocumentSchema>;
export type editDocumentData = z.infer<typeof editDocumentSchema>;
