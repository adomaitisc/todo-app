import * as trpc from "@trpc/server";
import { z } from "zod";

import { prisma } from "../utils/prisma";

export const appRouter = trpc
  .router()
  //List CR(Update not coded)D
  .mutation("create-list", {
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
  })
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
  //Task CRUD
  .mutation("create-task", {
    input: z.object({
      listId: z.string(),
      taskTitle: z.string(),
      isCompleted: z.boolean(),
    }),
    async resolve({ input }) {
      await prisma.task.create({
        data: {
          ...input,
        },
      });
      return {
        success: true,
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
  .mutation("set-task-completion", {
    input: z.object({
      id: z.string(),
      isCompleted: z.boolean(),
    }),
    async resolve({ input }) {
      await prisma.task.update({
        data: {
          isCompleted: input.isCompleted,
        },
        where: {
          id: input.id,
        },
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
  .mutation("set-lists-completion", {
    async resolve() {
      const lists = await prisma.list.findMany();
      lists.forEach(async (list) => {
        const tasksFromList = await prisma.task.findMany({
          where: {
            listId: list.id,
          },
        });
        const size = tasksFromList.length;
        const completed = tasksFromList.filter((obj) => {
          if (obj.isCompleted) {
            return obj;
          }
        }).length;
        if (size > 0) {
          const completion = (completed / size) * 100;
          await prisma.list.update({
            data: {
              listCompletion: completion,
            },
            where: {
              id: list.id,
            },
          });
        }
      });
      // const tasksFromList = await prisma.task.findMany({
      //   where: {
      //     listId: input.listId,
      //   },
      // });
      // const size = tasksFromList.length;
      // const completed = tasksFromList.filter((obj) => {
      //   if (obj.isCompleted) {
      //     return obj;
      //   }
      // }).length;
      // const completion = (completed / size) * 100;
      // await prisma.list.update({
      //   data: {
      //     listCompletion: completion,
      //   },
      //   where: {
      //     id: input.listId,
      //   },
      // });
      return {
        success: true,
      };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
