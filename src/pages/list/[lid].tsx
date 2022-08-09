import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const List = () => {
  const router = useRouter();
  const { lid } = router.query;

  const [isModalOpen, setModalOpen] = useState(false);
  const [formTaskTitle, setFormTaskTitle] = useState("");
  //   trpc List
  const queryList = trpc.useQuery(["get-list-by-id", { id: lid!.toString() }]);
  const deleteList = trpc.useMutation(["delete-list-by-id"]);
  const currentList = queryList.data!;

  //   trpc Task
  const utils = trpc.useContext();
  const queryTasks = trpc.useQuery([
    "get-tasks-from-id",
    { listId: lid!.toString() },
  ]);
  const createTask = trpc.useMutation(["create-task"], {
    async onSuccess() {
      await utils.invalidateQueries(["get-tasks-from-id"]);
    },
  });
  const setTaskCompletion = trpc.useMutation(["set-task-completion"], {
    async onSuccess() {
      await utils.invalidateQueries(["get-tasks-from-id"]);
    },
  });
  const deleteTasks = trpc.useMutation(["delete-tasks-from-id"]);
  const updateCompletion = trpc.useMutation(["set-list-completion-by-id"]);

  const handleGoBack = () => {
    try {
      updateCompletion.mutate({ id: lid!.toString() });
    } catch {}
    router.push("/");
  };

  const handleListDelete = () => {
    try {
      deleteList.mutate({ id: lid!.toString() });
      deleteTasks.mutate({ listId: lid!.toString() });
    } catch {}
    router.push("/");
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const input = {
      listId: lid!.toString(),
      taskTitle: formTaskTitle,
      isCompleted: false,
    };
    try {
      await createTask.mutateAsync(input);
      setFormTaskTitle("");
    } catch {}
  };

  const handleFormChange = (e: any) => {
    const value = e.target.value;
    console.log(value);
    setFormTaskTitle(value);
  };

  const handleCheckbox = async (e: any) => {
    const input = {
      id: e.target.name,
      isCompleted: e.target.checked,
    };
    try {
      await setTaskCompletion.mutateAsync(input);
    } catch {}
  };

  return (
    <div className="w-screen h-screen md:py-24 md:px-48 sm:py-12 sm:px-24 bg-gray-200">
      {/* Actual content */}
      <div className="w-full h-full p-12 bg-gray-100 shadow-lg rounded-3xl flex flex-col items-start justify-start">
        <div className="w-full flex flex-row justify-between">
          <button
            onClick={handleGoBack}
            className="py-2 px-4 text-gray-400 text-sm font-medium hover:text-gray-900"
          >
            Início
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="py-2 px-4 text-red-700 text-sm font-medium hover:text-gray-900"
          >
            Deletar
          </button>
        </div>
        <div className="mt-8"></div>
        <h1 className="text-gray-800 text-5xl font-medium">
          {currentList?.listTitle}
        </h1>
        <div className="mt-4"></div>
        <p className="text-gray-400 font-light text-xl">
          {currentList?.listDescription}
        </p>
        <div className="mt-8"></div>
        {/* Create Task */}
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-row items-center gap-4 justify-center"
        >
          <input
            className="bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="text"
            name="taskTitle"
            placeholder="ex: reformular ui"
            onChange={handleFormChange}
            required
            value={formTaskTitle}
          />
          <button className="pr-4 text-blue-700 text-base font-medium hover:text-gray-900 whitespace-nowrap">
            Adicionar
          </button>
        </form>
        <div className="mt-2 mb-4 border-t border-gray-200 w-full"></div>
        {/* Render Tasks */}
        <div className="flex flex-col w-full overflow-y-auto gap-4 items-start justify-start">
          {queryTasks.data?.tasks.map((item, i) => {
            return (
              <div
                key={i}
                className="flex flex-row gap-2 items-center justify-center"
              >
                <input
                  type="checkbox"
                  name={item.id}
                  checked={item.isCompleted ? true : false}
                  onClick={(e) => handleCheckbox(e)}
                  className="bg-gray-100 border-gray-200 hover:bg-blue-300/30 cursor-pointer w-6 h-6 border checked:bg-blue-500 checked:hover:bg-blue-400 focus:outline-none rounded-md"
                />
                <p className="text-gray-600 font-light text-sm">
                  {item.taskTitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      {/* Delete modal */}
      <div
        className={`${
          !isModalOpen && `hidden`
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-10 w-full flex justify-center items-center bg-gray-900/70`}
      >
        <div className="flex flex-col w-96 px-8 py-6 bg-gray-200 rounded-lg">
          <p className="text-gray-700 font-medium">
            Tem certeza que deseja deletar essa lista?
          </p>
          <p className="text-gray-500 text-sm">
            (Esta ação não pode ser desfeita)
          </p>
          <div className="mt-4"></div>
          <div className="flex flex-row items-center justify-start gap-4">
            <button
              onClick={() => setModalOpen(false)}
              className="text-sm text-gray-500 font-medium px-1 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              onClick={handleListDelete}
              className="text-sm text-red-700 font-medium px-1 hover:text-gray-900"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
