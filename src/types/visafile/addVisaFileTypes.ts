import z from "zod";

export const addVisaFileSchema = z.object({
  fileTitle: z.string().min(5, "file title is required"),
  file: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "At least one file is required"
    ),
});

export type addVisaFileData = z.infer<typeof addVisaFileSchema>;
