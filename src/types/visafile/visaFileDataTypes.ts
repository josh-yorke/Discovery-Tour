import z from "zod";

export const visaFileDataSchema = z.object({
  _id: z.string(),
  fileTitle: z.string(),
  file: z.string(),
});

export type visaFileData = z.infer<typeof visaFileDataSchema>;
