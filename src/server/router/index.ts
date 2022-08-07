import * as trpc from "@trpc/server";
import { z } from "zod";

import { prisma } from "../utils/prisma";

export const appRouter = trpc
  .router()
  .query("get-lists", {
    async resolve() {
      const lists = await prisma.list.findMany();
      return {
        lists,
      };
    },
  })
  .query("get-list-by-id", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const listFromId = await prisma.list.findUnique({
        where: {
          id: input.id,
        },
      });
      return listFromId;
    },
  })
  .query("delete-list-by-id", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const listFromId = await prisma.list.delete({
        where: {
          id: input.id,
        },
      });
      return {
        success: true,
      };
    },
  })
  .mutation("create-list-of-tasks", {
    input: z.object({
      listTitle: z.string(),
      listDescription: z.string(),
      listCompletion: z.number(),
    }),
    async resolve({ input }) {
      await prisma.list.create({
        data: {
          ...input,
        },
      });
      return {
        success: true,
      };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
