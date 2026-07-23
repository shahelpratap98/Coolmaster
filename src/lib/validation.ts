import { z } from "zod";

/** Trimmed optional text -> null when empty. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v && v.length ? v : null));

/** ISO date string or null; validated as a parseable date. */
const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length ? v : null))
  .refine((v) => v === null || !Number.isNaN(Date.parse(v)), {
    message: "Enter a valid date.",
  });

/** Promo create/update input. `.strict()` rejects unexpected fields. */
export const PromoInputSchema = z
  .object({
    title: z.string().trim().min(2, "Title is required.").max(120),
    badge: optionalText(40),
    description: z.string().trim().min(2, "Description is required.").max(2000),
    priceOrDiscount: optionalText(60),
    imagePath: optionalText(300),
    startsAt: optionalDate,
    endsAt: optionalDate,
    isActive: z.boolean().default(false),
  })
  .strict()
  .refine(
    (v) =>
      v.startsAt === null ||
      v.endsAt === null ||
      Date.parse(v.startsAt) <= Date.parse(v.endsAt),
    { message: "End date must be after the start date.", path: ["endsAt"] }
  );

export type PromoInput = z.infer<typeof PromoInputSchema>;

/** UUID guard for ids coming from the client. */
export const UuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "Invalid id."
  );
