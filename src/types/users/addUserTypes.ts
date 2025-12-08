import z from "zod";

export const addUserSchema = z.object({
  firstName: z.string().min(2, "first name is required"),
  lastName: z.string().min(2, "last name is required"),
  email: z.string().email(),
  password: z.string().min(2, "Password must be at least 2 characters long"),
  role: z.enum(["admin", "user"]),
  status: z.string(),
});

export type addUserData = z.infer<typeof addUserSchema>;
