import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["hello", { text: "Caua" }]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    return <div>{data.greeting}</div>;
  }

  return (
    <div id="page" className="w-screen h-screen p-24 bg-zinc-200">
      <div
        id="content"
        className="w-full h-full p-12 bg-zinc-100 shadow-lg rounded-3xl flex flex-col items-start justify-start"
      >
        <h1 className="text-zinc-800 text-3xl font-medium">Bem vindo Cauã,</h1>
        <div className="mt-8"></div>
        <p className="text-zinc-800 text-2xl font-medium">suas tarefas:</p>
        <div className="mt-4"></div>
        <div className="flex flex-row flex-wrap gap-4 items-start justify-start">
          {/* Where we will render the lists */}
          <div className="w-72 h-32 p-8 bg-zinc-100 shadow rounded-lg flex flex-col items-start justify-between duration-100 hover:scale-105">
            <div className="w-full flex flex-row items-center justify-between">
              <h1 className="text-lg text-zinc-800">qi-website</h1>
              <p className="text-xl text-zinc-700 font-bold">100%</p>
            </div>
            <div className="w-full h-1 rounded-full bg-blue-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
