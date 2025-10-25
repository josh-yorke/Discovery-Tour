import z from "zod";

export const editUserSchema = z.object({
  firstName: z.string().min(2, "first name is required"),
  lastName: z.string().min(5, "last name is required"),
  email: z.string().email(),
  password: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(val),
      {
        message:
          "Password must be at least 8 characters long and include one uppercase, one lowercase, one digit, and one special character",
      }
    ),
  role: z.enum(["admin", "user"]),
  status: z.string(),
});

export type editUserData = z.infer<typeof editUserSchema>;
