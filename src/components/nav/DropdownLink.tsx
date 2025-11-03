import { useState, type ReactNode } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { NavLink, useLocation } from "react-router";

interface NavProps {
  style: string;
  to: string;
  icon: ReactNode;
  title: string;
  options: string[];
}

const DropdownLink = ({ to, style, icon, title, options }: NavProps) => {
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();
  return (
    <div className="flex flex-col justify-center gap-4">
      <NavLink to={""} className={style} onClick={() => setOpen(!open)}>
        {icon}
        <p>{title}</p>
        {open ? <RiArrowUpSLine size={16} /> : <RiArrowDownSLine size={16} />}
      </NavLink>
      {open && (
        <div className="flex flex-col gap-4 line-clamp-1 items-center justify-center">
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
      )}
    </div>
  );
};

export default DropdownLink;
