import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db";
import { calculator } from "~/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const calculatorRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().nonempty("Calculator name cannot be empty"),
        seoTitle: z.string().nonempty("SEO title cannot be empty"),
        seoDescription: z.string().nonempty("SEO description cannot be empty"),
        keywords: z.array(z.string()), // Keywords must be an array
        content: z.object({
          html: z.string(),
          text: z.string(),
        }), // Validate JSON structure
        subcategoryId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.insert(calculator).values(input);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().nonempty("Calculator name cannot be empty"),
        seoTitle: z.string().nonempty("SEO title cannot be empty"),
        seoDescription: z.string().nonempty("SEO description cannot be empty"),
        keywords: z.array(z.string()),
        content: z.object({
          html: z.string(),
          text: z.string(),
        }),
        subcategoryId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.update(calculator).set(data).where(eq(calculator.id, id));
    }),
  getAll: publicProcedure.query(async () => {
    return await db.select().from(calculator);
  }),
});
