import z from "zod";

const userDataSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  status: z.string(),
  email: z.string(),
});

export type userData = z.infer<typeof userDataSchema>;
