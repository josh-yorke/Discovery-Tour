import z from "zod";

export const addScopeSchema = z.object({
  scopeCategory: z.string().min(2, "category is required"),
  scopeType: z.string().min(2, "scope type is required"),
  scopeTitle: z.string().min(2, "scope title is required"),
  scopeDescription: z.string().min(2, "description is required"),
});

export const editScopeSchema = z.object({
  _id: z.string(),
  scopeCategory: z.string(),
  scopeType: z.string(),
  scopeTitle: z.string(),
  scopeDescription: z.string(),
});

export type addScopeData = z.infer<typeof addScopeSchema>;
export type editScopeData = z.infer<typeof editScopeSchema>;
