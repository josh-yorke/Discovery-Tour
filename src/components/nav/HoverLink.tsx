import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router";

interface NavProps {
  style: string;
  to: string;
  icon: ReactNode;
  title: string;
  options: string[];
}

const HoverLink = ({ to, style, icon, title, options }: NavProps) => {
  const { pathname } = useLocation();
  return (
    <div className="relative flex justify-center group">
      <NavLink to={""} className={style}>
        {icon}
        <p>{title}</p>
      </NavLink>
      <div className="hidden absolute top-5 group-hover:flex flex-col bg-white p-4 gap-4 rounded-lg line-clamp-1 shadow-xl shadow-black/10 items-center justify-center">
        {options.map((option: string, id) => (
          <NavLink
            key={id}
            to={`${to}/${option}`}
            className={`text-sm font-normal capitalize cursor-pointer ${
              pathname.includes(option)
                ? "text-[#1d2087] font-semibold"
                : "text-black"
            }`}
          >
            {option}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default HoverLink;
