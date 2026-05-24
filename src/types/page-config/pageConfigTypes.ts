import z from "zod";

const childPageSchema = z.object({
  _id: z.string(),
  type: z.string(),
  key: z.string(),
  displayName: z.string(),
  pathLink: z.string(),
  order: z.number(),
  isUnderMaintenance: z.boolean(),
  childPages: z.array(z.any()),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number().optional(),
});

const pageConfigSchema = z.object({
  _id: z.string(),
  type: z.string(),
  key: z.string(),
  displayName: z.string(),
  pathLink: z.string(),
  order: z.number(),
  isUnderMaintenance: z.boolean(),
  childPages: z.array(childPageSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number().optional(),
});

export const editPageConfigSchema = z.object({
  type: z.enum(["maintab", "subtab", "solo"]),
  key: z.string().min(1, "Key is required"),
  displayName: z.string().min(1, "Display name is required"),
  pathLink: z.string().min(1, "Path link is required"),
  order: z.number().min(0, "Order must be a positive number"),
  isUnderMaintenance: z.union([z.boolean(), z.string()]),
  childPages: z.array(z.string()).optional(),
});

export type editPageConfigData = z.infer<typeof editPageConfigSchema>;
export type PageConfig = z.infer<typeof pageConfigSchema>;
export type ChildPage = z.infer<typeof childPageSchema>;
