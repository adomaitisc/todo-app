import type { GetServerSideProps } from "next";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { prisma } from "@/server/utils/prisma";

// pscale connect list-of-tasks main
// npm run dev
// npx prisma studio

type ListType = {
  listTitle: string;
  listDescription: string;
  listCompletion: number;
  id: string;
};

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const initialValues = { listTitle: "", listDescription: "" };
  const [formData, setFormData] = useState(initialValues);

  const utils = trpc.useContext();
  const listsQuery = trpc.useQuery(["get-lists"]);
  const addList = trpc.useMutation(["create-list"], {
    async onSuccess() {
      await utils.invalidateQueries(["get-lists"]);
    },
  });

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const input = {
      listTitle: formData.listTitle,
      listDescription: formData.listDescription,
      listCompletion: 0,
    };
    try {
      await addList.mutateAsync(input);
      setFormData(initialValues);
      setModalOpen(false);
    } catch {}
  };

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div id="page" className="w-screen h-screen p-24 bg-zinc-200">
      {/* Actual content */}
      <div
        id="content"
        className="w-full h-full p-12 bg-zinc-100 shadow-lg rounded-3xl flex flex-col items-start justify-start"
      >
        <div className="w-full flex flex-row justify-between">
          <h1 className="text-zinc-800 text-3xl font-medium">bem vindo</h1>

          {/* Create new List */}
          <button
            onClick={() => setModalOpen(true)}
            className="py-2 px-4 text-blue-700 text-sm font-medium hover:text-gray-900"
          >
            Nova Lista
          </button>
        </div>
        <div className="mt-8"></div>
        <p className="text-zinc-800 text-2xl font-medium">suas listas</p>
        <div className="mt-4"></div>
        <div className="flex flex-row flex-wrap overflow-y-auto gap-4 items-start justify-start">
          {/* Rendering Lists */}
          {listsQuery.data?.lists.map((item, i) => {
            return (
              <div
                key={i}
                className="w-72 h-32 p-8 bg-zinc-100 shadow rounded-lg flex flex-col items-start justify-between duration-100 hover:scale-105"
              >
                <div className="w-full flex flex-row items-center justify-between">
                  <div className="flex flex-between">
                    <h1 className="text-lg text-zinc-800">{item.listTitle}</h1>
                  </div>
                  <p className="text-xl text-zinc-700 font-bold">
                    {item.listCompletion}%
                  </p>
                </div>
                <div className="w-full h-1 rounded-full bg-blue-500"></div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Modal to create new Lists */}
      <div
        className={`${
          !isModalOpen && `hidden`
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-10 w-full flex justify-center items-center bg-zinc-900/70`}
      >
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col w-96 px-8 py-6 bg-zinc-200 rounded-lg"
        >
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="self-end text-sm text-red-700 font-medium hover:text-gray-900"
          >
            Cancelar
          </button>
          <div className="flex-flex-col w-full">
            <label className="block mb-1 text-sm font-medium text-zinc-600">
              Título:
            </label>
            <input
              className="bg-zinc-200 border border-zinc-300 text-zinc-900 placeholder-zinc-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              name="listTitle"
              placeholder="ex: todo-app"
              onChange={handleFormChange}
              required
              value={formData.listTitle}
            />
          </div>
          <div className="mt-4"></div>
          <div className="flex-flex-col w-full">
            <label className="block mb-1 text-sm font-medium text-zinc-600">
              Descrição:
            </label>
            <input
              className="bg-zinc-200 border border-zinc-300 text-zinc-900 placeholder-zinc-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              name="listDescription"
              placeholder="ex: site para organizar tarefas"
              onChange={handleFormChange}
              required
              value={formData.listDescription}
            />
          </div>
          <div className="mt-4"></div>
          <button className="self-start text-sm text-blue-700 font-medium px-1 hover:text-gray-900">
            Criar Lista
          </button>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const listsFromDb = await prisma.list.findMany();

  return { props: { lists: listsFromDb } };
};

export default Home;
