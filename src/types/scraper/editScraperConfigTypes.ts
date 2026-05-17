import z from "zod";

// Simple regex that accepts common cron patterns
const cronRegex =
  /^(\*|(\*\/[0-9]+)|[0-9\-,L]+)(\s+(\*|(\*\/[0-9]+)|[0-9\-,]+)){4}$/;

export const editScraperConfigSchema = z.object({
  smbcInterval: z.string().regex(cronRegex, {
    message: "Invalid cron format. Example: 0 0 */6 * * *",
  }),
  frankfurterInterval: z.string().regex(cronRegex, {
    message: "Invalid cron format. Example: 0 0 */1 * * *",
  }),
  isMainSourceUSDJPY: z.boolean(),
});

export type editScraperConfigData = z.infer<typeof editScraperConfigSchema>;
