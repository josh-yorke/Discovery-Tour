import { RiArrowLeftLine, RiArrowRightSLine } from "react-icons/ri";
import { NavLink } from "react-router";

interface HeaderProps {
  url: string;
  title: string;
  id: string;
  style: string;
}

const Header = ({ url, title, id, style }: HeaderProps) => {
  return (
    <div
      className={`w-full lg:w-2xl flex flex-row items-center justify-start gap-4 bg-gray-100 ${style}`}
    >
      <NavLink to={url} className="p-2 rounded-full bg-black/10 cursor-pointer">
        <RiArrowLeftLine size={16} />
      </NavLink>
      <div className="flex flex-row gap-2 items-center justify-center">
        <p className="text-sm font-semibold truncate whitespace-nowrap max-w-[120px]">
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

export default Header;
