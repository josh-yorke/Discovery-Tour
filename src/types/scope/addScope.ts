import z from "zod";

export const addScopeSchema = z.object({
  scopeCategory: z.string().min(2, "category is required"),
  scopeTitle: z.string().min(2, "scope title is required"),
  scopeDescription: z.string().optional(),
});

export const editScopeSchema = z.object({
  _id: z.string(),
  scopeCategory: z.string(),
  scopeTitle: z.string(),
  scopeDescription: z.string().optional(),
});

export type addScopeData = z.infer<typeof addScopeSchema>;
export type editScopeData = z.infer<typeof editScopeSchema>;
