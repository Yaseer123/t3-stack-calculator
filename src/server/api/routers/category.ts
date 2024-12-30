import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { category, subcategory } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// Define TypeScript interfaces
interface Subcategory {
  id: number;
  name: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  categoryId: number | null;
}

interface Category {
  id: number;
  name: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  subcategories: Subcategory[];
}

export const categoryRouter = createTRPCRouter({
  // Get all categories
  getAll: publicProcedure.query(async () => {
    const rawCategories = await db
      .select({
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        subcategoryId: subcategory.id,
        subcategoryName: subcategory.name,
        subcategoryCreatedAt: subcategory.createdAt,
        subcategoryUpdatedAt: subcategory.updatedAt,
        subcategoryCategoryId: subcategory.categoryId,
      })
      .from(category)
      .leftJoin(subcategory, eq(subcategory.categoryId, category.id));

    // Aggregate subcategories under their respective categories
    const categories: Category[] = [];
    rawCategories.forEach((row) => {
      const existingCategory = categories.find((cat) => cat.id === row.id);

      const sub: Subcategory | null = row.subcategoryId
        ? {
            id: row.subcategoryId,
            name: row.subcategoryName!,
            createdAt: row.subcategoryCreatedAt,
            updatedAt: row.subcategoryUpdatedAt,
            categoryId: row.subcategoryCategoryId,
          }
        : null;

      if (existingCategory) {
        if (sub) existingCategory.subcategories.push(sub);
      } else {
        categories.push({
          id: row.id,
          name: row.name,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          subcategories: sub ? [sub] : [],
        });
      }
    });

    return categories;
  }),

  // Get a category by ID
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(category)
        .where(eq(category.id, input.id));
      return result[0];
    }),

  // Add a new category
  create: publicProcedure
    .input(
      z.object({
        name: z.string().nonempty("Category name cannot be empty"),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.insert(category).values({ name: input.name });
    }),

  // Update a category by ID
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().nonempty("Category name cannot be empty"),
      }),
    )
    .mutation(async ({ input }) => {
      return await db
        .update(category)
        .set({ name: input.name })
        .where(eq(category.id, input.id));
    }),
});
