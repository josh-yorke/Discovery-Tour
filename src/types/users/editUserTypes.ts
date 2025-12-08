import z from "zod";

export const editUserSchema = z.object({
  firstName: z.string().min(2, "first name is required"),
  lastName: z.string().min(2, "last name is required"),
  email: z.string().email(),
  password: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  role: z.enum(["admin", "user"]),
  status: z.string(),
});

export type editUserData = z.infer<typeof editUserSchema>;
