import * as trpc from "@trpc/server";
import { z } from "zod";

export const appRouter = trpc.router().query("getListOfLists", {
  // connect to db and get list of lists
  resolve() {
    // return list of lists
    return {
      lists: ["list1", "list2", "list3"],
    };
  },
});

// export const appRouter = trpc.router().query("hello", {
//   input: z
//     .object({
//       text: z.string().nullish(),
//     })
//     .nullish(),
//   resolve({ input }) {
//     return {
//       greeting: `hello ${input?.text ?? "world"}`,
//     };
//   },
// });

// export type definition of API
export type AppRouter = typeof appRouter;
