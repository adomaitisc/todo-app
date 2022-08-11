import { trpc } from "@/utils/trpc";
import { GetServerSideProps } from "next";
import { prisma } from "@/server/utils/prisma";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Grid, Triangle } from "react-loader-spinner";

const List = (props: any) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formTaskTitle, setFormTaskTitle] = useState("");
  const [stateTasks, setStateTasks] = useState<any>([]);
  const [isChanged, setIsChanged] = useState(false);

  const utils = trpc.useContext();

  const currentList = props.list;
  const queryTasks = props.tasks;

  const createTasks = trpc.useMutation(["create-many-tasks"]);

  const updateCompletion = trpc.useMutation(["set-list-completion-by-id"]);
  const updateTasks = trpc.useMutation(["update-tasks"]);

  const deleteList = trpc.useMutation(["delete-list-by-id"], {
    async onSuccess() {
      await utils.invalidateQueries(["get-tasks-from-id"]);
    },
  });
  const deleteTasks = trpc.useMutation(["delete-tasks-from-id"]);

  useEffect(() => {
    const sortedData = queryTasks.sort(
      (a: { id: string }, b: { id: string }) =>
        parseInt(a.id.split("-")[0]) - parseInt(b.id.split("-")[0])
    );
    setStateTasks(sortedData);
  }, []);

  const handleGoBack = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await updateCompletion.mutateAsync({ id: currentList?.id });
    } catch {}
    router.push("/");
    setIsLoading(false);
  };

  const handleListDelete = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await deleteTasks.mutateAsync({ listId: currentList.id });
    } catch {}
    try {
      await deleteList.mutateAsync({ id: currentList.id });
    } catch {}
    router.push("/");
    setIsLoading(false);
  };

  const handleNewTask = (e: any) => {
    if (isLoading) return;
    if (!formTaskTitle) return;
    const input = {
      listId: currentList?.id,
      id: stateTasks.length.toString() + "-" + currentList?.id,
      taskTitle: formTaskTitle,
      isCompleted: false,
    };
    setStateTasks([...stateTasks, input]);
    setFormTaskTitle("");
    setIsChanged(true);
  };

  const handleFormChange = (e: any) => {
    const value = e.target.value;
    setFormTaskTitle(value);
  };

  const handleCheckbox = (e: any) => {
    const id = e.target.name.split("-")[0];
    const checked = e.target.checked;
    // SHALLOW COPY OF TASKS
    const tasks = [...stateTasks];
    // SHALLOW COPY OF TASK ITEM
    const task = { ...tasks[id] };
    // UPDATING ISCOMPLETED PROPERTY
    task.isCompleted = checked;
    // INSERTING BACK INTO ARRAY
    tasks[id] = task;
    // SETTING STATE WITH NEW COPY
    setStateTasks(tasks);
    setIsChanged(true);
  };

  const handleSaveChanges = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await createTasks.mutateAsync(stateTasks);
    } catch {}
    try {
      await updateTasks.mutateAsync(stateTasks);
    } catch {}
    utils.invalidateQueries(["get-tasks-from-id"]);
    setIsChanged(false);
    setIsLoading(false);
  };

  return (
    <div className="w-screen h-screen md:py-12 md:px-24 p-0 bg-gray-200">
      {/* Actual content */}
      <div className="w-full h-full md:p-12 p-8 bg-gray-100 shadow-lg md:rounded-3xl rounded-none flex flex-col items-start justify-start">
        <div className="w-full flex flex-row justify-between">
          <button
            onClick={handleGoBack}
            className="py-2 px-4 text-gray-400 md:text-sm text-base font-medium hover:text-gray-900"
          >
            Início
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="py-2 px-4 text-red-700 md:text-sm text-base font-medium hover:text-gray-900"
          >
            Deletar Lista
          </button>
        </div>
        <div className="mt-8"></div>
        <h1 className="text-gray-800 text-5xl font-medium">
          {currentList?.listTitle}
        </h1>
        <div className="mt-4"></div>
        <p className="text-gray-500 font-light text-xl">
          {currentList?.listDescription}
        </p>
        <div className="mt-8"></div>
        {/* Create Task */}
        <div className="flex flex-row flex-wrap items-center gap-4 justify-start">
          <input
            className="bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 md:text-sm text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            type="text"
            name="taskTitle"
            placeholder="ex: reformular ui"
            onChange={handleFormChange}
            required
            value={formTaskTitle}
          />
          <button
            onClick={handleNewTask}
            className="pr-4 text-blue-700 md:text-sm text-base font-medium hover:text-gray-900 whitespace-nowrap"
          >
            Adicionar
          </button>
          {isChanged && (
            <button
              onClick={handleSaveChanges}
              className="pr-4 text-gray-500 md:text-sm text-base font-medium hover:text-gray-900 whitespace-nowrap"
            >
              Salvar Alterações
            </button>
          )}
        </div>

        <div className="mt-2 mb-4 border-t border-gray-200 w-full"></div>
        {/* Render Tasks */}
        <div className="flex flex-col flex-wrap w-full overflow-y-auto gap-4 items-start justify-start">
          {stateTasks.map(
            (
              item: { id: string; isCompleted: boolean; taskTitle: string },
              i: number
            ) => {
              return (
                <div
                  key={i}
                  className="flex flex-row md:gap-2 gap-4 items-center justify-center"
                >
                  <input
                    type="checkbox"
                    name={item.id}
                    checked={item.isCompleted ? true : false}
                    onChange={(e) => handleCheckbox(e)}
                    className="bg-gray-100 border-gray-200 hover:bg-blue-300/30 cursor-pointer md:w-6 w-8 md:h-6 h-8 border checked:bg-blue-500 checked:hover:bg-blue-400 focus:outline-none rounded-md"
                  />
                  <p className="text-gray-600 font-light md:text-sm text-lg">
                    {item.taskTitle}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>
      {/* Delete modal */}
      <div
        className={`${
          !isModalOpen && `hidden`
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-10 w-full flex justify-center items-center bg-gray-900/70`}
      >
        <div className="flex flex-col w-96 px-8 py-6 bg-gray-200 rounded-lg">
          <p className="text-gray-700 font-medium md:text-base text-lg">
            Tem certeza que deseja deletar essa lista?
          </p>
          <p className="text-gray-500 md:text-sm text-base">
            (Esta ação não pode ser desfeita)
          </p>
          <div className="mt-4"></div>
          <div className="flex flex-row items-center justify-start gap-4">
            <button
              onClick={() => setModalOpen(false)}
              className="md:text-sm text-base text-gray-500 font-medium px-1 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              onClick={handleListDelete}
              className="md:text-sm text-base text-red-700 font-medium px-1 hover:text-gray-900"
            >
              Deletar
            </button>
          </div>
        </div>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const lid = context.query.lid;
  const listId = lid?.toString();
  const listFromDb = await prisma.list.findUnique({
    where: {
      id: listId,
    },
  });
  const tasksFromDb = await prisma.task.findMany({
    where: {
      listId: listId,
    },
  });

  return { props: { list: listFromDb, tasks: tasksFromDb } };
};

export default List;
