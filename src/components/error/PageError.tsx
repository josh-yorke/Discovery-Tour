interface ErrorProps {
  error: string;
  action: () => void;
  title: string;
}

const PageError = ({ error, action, title }: ErrorProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-[60vh] gap-2">
      <p className="text-sm font-normal">{`${error}` || "An Error occured!"}</p>
      <div
        className="bg-gradient-to-b from-[#1DA337] to-[#007617] hover:from-[#1dbd3d] hover:to-[#00881b] transition-colors ease-in-out duration-500 px-4 py-2 rounded-full text-white text-xs cursor-pointer"
        onClick={action}
      >
        {title}
      </div>
    </div>
  );
};

export default PageError;
