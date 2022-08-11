import * as trpc from "@trpc/server";
import { z } from "zod";

import { prisma } from "../utils/prisma";

export const appRouter = trpc
  .router()
  .mutation("create-list", {
    input: z.object({
      id: z.string(),
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
  })
  .query("get-lists", {
    async resolve() {
      const lists = await prisma.list.findMany();
      return {
        lists,
      };
    },
  })
  .mutation("delete-list-by-id", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      await prisma.list.delete({
        where: {
          id: input.id,
        },
      });
      return {
        success: true,
      };
    },
  })
  .mutation("create-many-tasks", {
    input: z
      .object({
        listId: z.string(),
        id: z.string(),
        taskTitle: z.string(),
        isCompleted: z.boolean(),
      })
      .array(),
    async resolve({ input }) {
      await prisma.task.createMany({
        data: [...input],
        skipDuplicates: true,
      });
      return {
        message: `tasks were created under the listId ${input[0].listId}`,
      };
    },
  })
  .query("get-tasks-from-id", {
    input: z.object({
      listId: z.string(),
    }),
    async resolve({ input }) {
      const tasks = await prisma.task.findMany({
        where: {
          listId: input.listId,
        },
      });
      return {
        tasks,
      };
    },
  })
  .mutation("update-tasks", {
    input: z
      .object({
        listId: z.string(),
        id: z.string(),
        taskTitle: z.string(),
        isCompleted: z.boolean(),
      })
      .array(),
    async resolve({ input }) {
      input.forEach(async (item, i) => {
        await prisma.task.update({
          where: {
            id: item.id,
          },
          data: {
            isCompleted: item.isCompleted,
          },
        });
      });
      return {
        success: true,
      };
    },
  })
  .mutation("delete-tasks-from-id", {
    input: z.object({
      listId: z.string(),
    }),
    async resolve({ input }) {
      await prisma.task.deleteMany({
        where: {
          listId: input.listId,
        },
      });
      return {
        success: true,
      };
    },
  })
  .mutation("set-list-completion-by-id", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const list = await prisma.list.findUnique({
        where: {
          id: input.id,
        },
      });
      const tasks = await prisma.task.findMany({
        where: {
          listId: input.id,
        },
      });
      const size = tasks.length;
      const completed = tasks.filter((obj) => {
        if (obj.isCompleted) {
          return obj;
        }
      }).length;
      if (size > 0) {
        const completion = Math.ceil((completed / size) * 100);
        await prisma.list.update({
          data: {
            listCompletion: completion,
          },
          where: {
            id: input.id,
          },
        });
      }
      return {
        success: true,
      };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
