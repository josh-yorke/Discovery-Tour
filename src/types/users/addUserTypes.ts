import z from "zod";

export const addUserSchema = z.object({
  firstName: z.string().min(5, "first name is required"),
  lastName: z.string().min(5, "last name is required"),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
      "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  role: z.enum(["admin", "user"]),
  status: z.string(),
});

export type addUserData = z.infer<typeof addUserSchema>;
