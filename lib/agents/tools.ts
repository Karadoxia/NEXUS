import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";

/** Tool to search for products in the commerce database */
export const searchProductsTool = tool(
  async ({ query, limit = 5 }: { query: string; limit?: number }) => {
    try {
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } },
          ],
          stock: { gt: 0 },
        },
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          description: true,
          slug: true,
        },
        take: limit,
      });
      return JSON.stringify(products);
    } catch (e: any) {
      return `Search failed: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
  {
    name: "searchProducts",
    description: "Search the NEXUS product catalog by keyword, name, or category. Returns in-stock items.",
    schema: z.object({
      query: z.string().describe("The search term or keyword to look for"),
      limit: z.number().optional().default(5).describe("Max number of products to return"),
    }),
  }
);

// Rust tool for agent execution
export function rustTool() {
  return {
    name: 'rust',
    description: 'Execute rust-based agent',
  };
}
