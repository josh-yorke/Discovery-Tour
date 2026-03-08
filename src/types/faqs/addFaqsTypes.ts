import z from "zod";

export const addFaqsSchema = z.object({
  question: z.string().min(1, "question is required"),
  answer: z.string().min(1, "answer is required"),
});

export const editFaqsSchema = z.object({
  _id: z.string().min(1, "id is required"),
  question: z.string().min(1, "question is required"),
  answer: z.string().min(1, "answer is required"),
});

export type addFaqData = z.infer<typeof addFaqsSchema>;
export type editFaqData = z.infer<typeof editFaqsSchema>;
