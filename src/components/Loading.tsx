type LoadingProps = {
  page: "home" | "list";
};

const Loading = ({ page }: LoadingProps) => {
  if (page === "home") {
    return (
      <div className="w-screen h-screen md:py-24 md:px-48 sm:py-12 sm:px-24 bg-gray-200">
        <div className="w-full h-full p-12 bg-gray-100 shadow-lg rounded-3xl flex flex-col items-start justify-start">
          <div className="w-full flex flex-row justify-between">
            <div className="w-48 h-4 rounded-full bg-gray-300"></div>
            <div className="w-12 h-2 rounded-full bg-gray-300"></div>
          </div>
          <div className="mt-12"></div>
          <div className="w-96 h-2 rounded-full bg-gray-300 "></div>
          <div className="mt-4"></div>
          <div className="w-36 h-2 rounded-full bg-gray-300 "></div>
          <div className="mt-12"></div>
          <div className="flex flex-row flex-wrap sm:w-full w-full gap-4 items-start justify-start">
            <div className="md:w-64 h-32 sm:w-full w-full p-8 bg-gray-300 rounded-lg"></div>
            <div className="md:w-64 h-32 sm:w-full w-full p-8 bg-gray-300 rounded-lg"></div>
            <div className="md:w-64 h-32 sm:w-full w-full p-8 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-screen h-screen md:py-24 md:px-48 sm:py-12 sm:px-24 bg-gray-200">
      <div className="w-full h-full p-12 bg-gray-100 shadow-lg rounded-3xl flex flex-col items-start justify-start">
        <div className="w-full flex flex-row justify-between">
          <div className="w-12 h-2 rounded-full bg-gray-300"></div>
          <div className="w-12 h-2 rounded-full bg-gray-300"></div>
        </div>
        <div className="mt-16"></div>
        <div className="w-48 h-6 rounded-full bg-gray-300"></div>
        <div className="mt-8"></div>
        <div className="w-full h-2 rounded-full bg-gray-300 "></div>
        <div className="mt-4"></div>
        <div className="w-36 h-2 rounded-full bg-gray-300 "></div>
        <div className="mt-8"></div>
        <div className="flex flex-row gap-4 items-center">
          <div className="w-36 h-8 bg-gray-300 rounded-lg"></div>
          <div className="w-12 h-2 bg-gray-300 rounded-full"></div>
        </div>
        <div className="mt-8"></div>
        <div className="flex flex-col sm:w-full w-full gap-6 items-start justify-start">
          <div className="w-24 h-1.5 bg-gray-300 rounded-full"></div>
          <div className="w-36 h-1.5 bg-gray-300 rounded-full"></div>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          <div className="w-48 h-1.5 bg-gray-300 rounded-full"></div>
          <div className="w-24 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
