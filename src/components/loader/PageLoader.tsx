const PageLoader = () => {
  return (
    <div className="w-full flex flex-row items-center justify-center gap-4 h-[60svh] bg-transparent">
      <div
        className="p-2 bg-[#1d2087] rounded-md animate-bounce ease-in-out duration-300"
        style={{ animationDelay: "0s", animationDuration: "0.6s" }}
      ></div>
      <div
        className="p-2 bg-[#1d2087] rounded-md animate-bounce ease-in-out duration-300"
        style={{ animationDelay: "0.4s", animationDuration: "0.6s" }}
      ></div>
      <div
        className="p-2 bg-[#1d2087] rounded-md animate-bounce ease-in-out duration-300"
        style={{ animationDelay: "0.8s", animationDuration: "0.6s" }}
      ></div>
    </div>
  );
};

export default PageLoader;
