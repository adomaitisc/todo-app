import type { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import { prisma } from "@/server/utils/prisma";
import Link from "next/link";
import { Triangle } from "react-loader-spinner";

// pscale connect list-of-tasks main
// npm run dev
// npx prisma studio

const Home = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [stateLists, setStateLists] = useState<any>([]);
  const initialValues = { listTitle: "", listDescription: "" };
  const [formData, setFormData] = useState(initialValues);

  const utils = trpc.useContext();
  const createList = trpc.useMutation(["create-list"]);

  useEffect(() => {
    setStateLists(props.lists);
    utils.invalidateQueries(["get-lists"]);
  }, []);

  const handleFormSubmit = async (e: any) => {
    if (isLoading) return;
    setIsLoading(true);
    e.preventDefault();
    const input = {
      id: stateLists.length.toString(),
      listTitle: formData.listTitle,
      listDescription: formData.listDescription,
      listCompletion: 0,
    };
    try {
      await createList.mutateAsync(input);
    } catch {}
    setStateLists([...stateLists, input]);
    setFormData(initialValues);
    setModalOpen(false);
    setIsLoading(false);
  };

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="w-screen h-screen md:py-12 md:px-24 p-0 bg-gray-200">
      {/* Actual content */}
      <div className="w-full h-full md:p-12 p-8 bg-gray-100 shadow-lg md:rounded-3xl flex flex-col items-start justify-start">
        <div className="w-full flex flex-col justify-between">
          {/* Create new List */}
          <button
            onClick={() => setModalOpen(true)}
            className="py-2 px-4 self-end text-blue-700 md:text-sm text-base font-medium hover:text-gray-900"
          >
            Nova Lista
          </button>
        </div>
        <div className="mt-8"></div>
        <h1 className="text-gray-800 text-5xl font-medium">Bem Vindo!</h1>
        <div className="mt-4"></div>
        <p className="text-gray-500 font-light text-xl">
          Este ?? um app simples para organizar deveres e acompanhar seu
          progresso.
        </p>
        <div className="mt-12"></div>
        <div className="flex flex-row flex-wrap md:pb-0 sm:pb-0 pb-16 w-full overflow-y-auto gap-4 items-start justify-start">
          {/* Rendering Lists */}
          {stateLists.map(
            (
              item: {
                id: any;
                listTitle: string;
                listDescription: string;
                listCompletion: number;
              },
              i: number
            ) => {
              return (
                <Link key={i} href={`list/${item.id}`}>
                  <a
                    onClick={() => setIsLoading(true)}
                    className="md:w-72 w-full h-36 md:p-8 p-4 bg-gray-100 border rounded-lg flex flex-col items-start justify-between duration-100 hover:bg-gray-200/20"
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex flex-row items center justify-between">
                        <h1 className="md:text-lg text-2xl text-gray-800 text-ellipsis whitespace-nowrap overflow-hidden pr-4">
                          {item.listTitle}
                        </h1>
                        <h1 className="md:text-lg text-2xl text-gray-800 font-bold">
                          {item.listCompletion}%
                        </h1>
                      </div>
                      <div className="mt-1"></div>
                      <p className="md:text-xs text-lg font-light text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden">
                        {item.listDescription}
                      </p>
                    </div>
                    <div className="w-full md:mb-0 mb-4 bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-blue-600 h-1 rounded-full"
                        style={{ width: `${item.listCompletion}%` }}
                      ></div>
                    </div>
                  </a>
                </Link>
              );
            }
          )}
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
          className="flex flex-col w-96 px-8 py-6 md:gap-0 gap-2 bg-gray-200 rounded-lg"
        >
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="self-end md:text-sm text-base text-red-700 font-medium hover:text-gray-900"
          >
            Cancelar
          </button>
          <div className="flex-flex-col w-full">
            <label className="block mb-1 md:text-sm text-lg font-medium text-gray-600">
              T??tulo:
            </label>
            <input
              className="bg-gray-200 border border-gray-300 text-gray-900 placeholder-gray-400 md:text-sm text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
            <label className="block mb-1 md:text-sm text-lg font-medium text-gray-600">
              Descri????o:
            </label>
            <input
              className="bg-gray-200 border border-gray-300 text-gray-900 placeholder-gray-400 md:text-sm text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              name="listDescription"
              placeholder="ex: site para organizar tarefas"
              onChange={handleFormChange}
              required
              value={formData.listDescription}
            />
          </div>
          <div className="mt-4"></div>
          <button className="self-start md:text-sm text-base text-blue-700 font-medium px-1 hover:text-gray-900">
            Criar Lista
          </button>
        </form>
      </div>
      {isLoading && (
        <div className="absolute right-0 bottom-0 md:mb-16 mb-4 md:mr-28 mr-4 z-10 rounded-md w-12 h-12 bg-black flex items-center justify-center">
          <Triangle
            height="30"
            width="30"
            color="#ffffff"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            visible={true}
          />
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const listsFromDb = await prisma.list.findMany();
  return { props: { lists: listsFromDb } };
};

export default Home;
