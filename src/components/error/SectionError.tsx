interface ErrorProps {
  error: string;
  action: () => void;
}
const SectionError = ({ error, action }: ErrorProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-[30vh] md:h-[40vh] gap-2">
      <p className="text-xs font-semibold">{error}</p>
      <div
        className="cursor-pointer bg-linear-to-tr from-[#1d2087] to-[#6468d9] px-4 py-2 rounded-full text-xs font-semibold text-white"
        onClick={action}
      >
        Reload
      </div>
    </div>
  );
};

export default SectionError;
