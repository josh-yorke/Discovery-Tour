import z from "zod";

export const careerSearchSchema = z.object({
  page: z.number(),
  limit: z.number(),
  status: z.string(),
  search: z.string(),
  employmentType: z.string(),
  branch: z.string(),
});

export type careerSearchData = z.infer<typeof careerSearchSchema>;
