import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { subcategory } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const subcategoryRouter = createTRPCRouter({
  // Get all subcategories
  getAll: publicProcedure.query(async () => {
    return await db.select().from(subcategory);
  }),

  // Get subcategories by category ID
  getByCategoryId: publicProcedure
    .input(
      z.object({
        categoryId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      return await db
        .select()
        .from(subcategory)
        .where(eq(subcategory.categoryId, input.categoryId));
    }),

  // Get subcategory by ID
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      return await db
        .select()
        .from(subcategory)
        .where(eq(subcategory.id, input.id))
        .then((results) => results[0] || null); // Return null if not found
    }),

  // Add a new subcategory
  create: publicProcedure
    .input(
      z.object({
        name: z.string().nonempty("Subcategory name cannot be empty"),
        categoryId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.insert(subcategory).values({
        name: input.name,
        categoryId: input.categoryId,
      });
    }),

  // Update a subcategory by ID
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().nonempty("Subcategory name cannot be empty"),
        categoryId: z.number(), // Allow updating categoryId
      }),
    )
    .mutation(async ({ input }) => {
      return await db
        .update(subcategory)
        .set({ name: input.name, categoryId: input.categoryId }) // Update name and categoryId
        .where(eq(subcategory.id, input.id));
    }),
});
