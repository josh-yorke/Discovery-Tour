import { RiArrowLeftLine, RiArrowRightSLine } from "react-icons/ri";
import { useNavigate } from "react-router";

interface HeaderProps {
  title: string;
  id: string;
  style: string;
}

const PageHeader = ({ title, id, style }: HeaderProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={`w-full lg:w-7xl flex flex-row items-center justify-start gap-4 bg-gray-100 ${style}`}
    >
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full bg-black/10 cursor-pointer"
      >
        <RiArrowLeftLine size={16} />
      </button>
      <div className="flex flex-row gap-2 items-center justify-center">
        <p className="text-sm font-semibold truncate whitespace-nowrap max-w-30">
          {title}
        </p>
        <RiArrowRightSLine size={20} />
        <p className="text-sm font-normal text-black/80 uppercase max-w-[40vw] truncate">
          {id !== "" ? `#${id}` : "New"}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
