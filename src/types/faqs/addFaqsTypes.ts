import z from "zod";

const formattedLinkSchema = z.object({
  title: z.string().min(1, "Link title is required"),
  link: z.string().url("Must be a valid URL").min(1, "Link URL is required"),
});

export const addFaqsSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  formattedLinks: z.array(formattedLinkSchema).default([]),
});

export const editFaqsSchema = z.object({
  _id: z.string().min(1, "id is required"),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  formattedLinks: z.array(formattedLinkSchema).default([]),
});

export type addFaqData = z.infer<typeof addFaqsSchema>;
export type editFaqData = z.infer<typeof editFaqsSchema>;
