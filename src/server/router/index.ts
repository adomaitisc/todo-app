import * as trpc from "@trpc/server";
import { z } from "zod";

import { prisma } from "../utils/prisma";

export const appRouter = trpc.router().query("create-list-of-tasks", {
  input: z.object({
    listTitle: z.string(),
    listDescription: z.string(),
    listCompletion: z.number(),
  }),
  async resolve({ input }) {
    const listInDb = await prisma.list.create({
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
