import z from "zod";

export const allowedActionsSchema = z.object({
  create: z.boolean(),
  read: z.boolean(),
  update: z.boolean(),
  delete: z.boolean(),
});

export const emailReceiverSetterSchema = z.object({
  contactPage: z.boolean(),
  railPass: z.boolean(),
  transportation: z.boolean(),
  insurance: z.boolean(),
  optionsForYou: z.boolean(),
});

export const editUserSchema = z.object({
  firstName: z.string().min(2, "first name is required"),
  lastName: z.string().min(2, "last name is required"),
  email: z.string().email(),
  password: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  role: z.enum(["admin", "staff", "user"]),
  status: z.string(),
  allowedActions: allowedActionsSchema,
  receiveEmailFrom: emailReceiverSetterSchema,
});

export type editUserData = z.infer<typeof editUserSchema>;
