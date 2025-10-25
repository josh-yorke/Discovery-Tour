const PageLoader = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="w-full h-[10vh] bg-white rounded-lg animate-pulse duration-300"></div>
      <div className="w-full h-[10vh] bg-white rounded-lg animate-pulse duration-300"></div>
      <div className="w-full h-[10vh] bg-white rounded-lg animate-pulse duration-300"></div>
    </div>
  );
};

export default PageLoader;
