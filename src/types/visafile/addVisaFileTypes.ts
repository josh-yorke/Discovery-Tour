import z from "zod";

export const addVisaFileSchema = z.object({
  fileTitle: z.string().min(2, "file title is required").optional(),
  file: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one file is required"
    )
    .optional(),
});

export const editVisaFileSchema = z.object({
  fileTitle: z.string().min(2, "file title is required").optional(),
  file: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one file is required"
    )
    .optional(),
});

export type addVisaFileData = z.infer<typeof addVisaFileSchema>;
export type editVisaFileData = z.infer<typeof editVisaFileSchema>;
