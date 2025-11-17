import z from "zod";

export const addPaymentSchema = z.object({
  accountName: z.string().min(2, "account name is required"),
  paymentType: z.string().min(2, "payment type is required"),
  currency: z.string().min(2, "currency is required"),
  bankName: z.string().min(2, "bank name is required"),
  accountNo: z.string().min(2, "account number is required"),
  bankAddress: z.string().min(2, "bank address is required"),
  swiftCode: z.string().min(2, "swift code is required"),
});

export const editPaymentSchema = z.object({
  accountName: z.string().min(2, "account name is required"),
  type: z.string().min(2, "payment type is required"),
  currency: z.string().min(2, "currency is required"),
  bankName: z.string().min(2, "bank name is required"),
  accountNo: z.string().min(2, "account number is required"),
  bankAddress: z.string().min(2, "bank address is required"),
  swiftCode: z.string().min(2, "swift code is required"),
  fileTitle: z.string().optional(),
  file: z.string().optional(),
  filesAssociated: z.string().optional(),
});

export type addPaymentData = z.infer<typeof addPaymentSchema>;
export type editPaymentData = z.infer<typeof editPaymentSchema>;
