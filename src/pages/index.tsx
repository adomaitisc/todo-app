import type { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import { prisma } from "@/server/utils/prisma";
import Link from "next/link";
import Loading from "@/components/Loading";

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
  const setCompletion = trpc.useMutation(["set-lists-completion"], {
    async onSuccess() {
      await utils.invalidateQueries(["get-lists"]);
    },
  });
  const queryList = trpc.useQuery(["get-lists"]);
  const createList = trpc.useMutation(["create-list"], {
    async onSuccess() {
      await utils.invalidateQueries(["get-lists"]);
    },
  });

  useEffect(() => {
    setCompletion.mutate();
    utils.invalidateQueries(["get-lists"]);
  }, []);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const input = {
      listTitle: formData.listTitle,
      listDescription: formData.listDescription,
      listCompletion: 0,
    };
    try {
      await createList.mutateAsync(input);
      setFormData(initialValues);
      setModalOpen(false);
    } catch {}
  };

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (!queryList.data) {
    return <Loading page="home" />;
  }

  return (
    <div className="w-screen h-screen md:py-12 md:px-24 sm:p-0 bg-gray-200">
      {/* Actual content */}
      <div className="w-full h-full p-12 bg-gray-100 shadow-lg rounded-3xl flex flex-col items-start justify-start">
        <div className="w-full flex flex-col justify-between">
          {/* Create new List */}
          <button
            onClick={() => setModalOpen(true)}
            className="py-2 px-4 self-end text-blue-700 text-sm font-medium hover:text-gray-900"
          >
            Nova Lista
          </button>
        </div>
        <div className="mt-8"></div>
        <h1 className="text-gray-800 text-5xl font-medium">Bem Vindo!</h1>
        <div className="mt-4"></div>
        <p className="text-gray-400 font-light text-xl">
          Este é um app simples para organizar deveres e acompanhar seu
          progresso.
        </p>
        <div className="mt-12"></div>
        <div className="flex flex-row flex-wrap sm:w-full w-full overflow-y-auto gap-4 items-start justify-start">
          {/* Rendering Lists */}
          {queryList.data?.lists.map((item, i) => {
            return (
              <Link key={i} href={`list/${item.id}`}>
                <a className="md:w-64 h-32 sm:w-full w-full p-8 bg-gray-100 border rounded-lg flex flex-col items-start justify-between duration-100 hover:bg-gray-200/20">
                  <div className="w-full flex flex-row items-center justify-between">
                    <div className="flex flex-between">
                      <h1 className="text-lg text-gray-800">
                        {item.listTitle}
                      </h1>
                    </div>
                    <p className="text-xl text-gray-700 font-bold">
                      {item.listCompletion}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-blue-600 h-1 rounded-full"
                      style={{ width: `${item.listCompletion}%` }}
                    ></div>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Modal to create new Lists */}
      <div
        className={`${
          !isModalOpen && `hidden`
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-10 w-full flex justify-center items-center bg-gray-900/70`}
      >
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col w-96 px-8 py-6 bg-gray-200 rounded-lg"
        >
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="self-end text-sm text-red-700 font-medium hover:text-gray-900"
          >
            Cancelar
          </button>
          <div className="flex-flex-col w-full">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Título:
            </label>
            <input
              className="bg-gray-200 border border-gray-300 text-gray-900 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Descrição:
            </label>
            <input
              className="bg-gray-200 border border-gray-300 text-gray-900 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
