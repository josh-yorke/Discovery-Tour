import { useState, type ReactNode, useEffect, useRef } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { NavLink } from "react-router";

interface NavProps {
  style: string;
  to: string;
  icon: ReactNode;
  title: string;
  options: string[];
}

const DropdownLink = ({ to, style, icon, title, options }: NavProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`${style} cursor-pointer hover:opacity-80 transition-opacity`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {icon}
        <span>{title}</span>
        {open ? <RiArrowUpSLine size={16} /> : <RiArrowDownSLine size={16} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 min-w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
          {options.map((option) => (
            <NavLink
              key={option}
              to={`${to}/${option}`}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm capitalize transition-colors hover:bg-gray-100 ${
                  isActive
                    ? "text-[#1d2087] font-semibold bg-blue-50"
                    : "text-gray-700"
                }`
              }
            >
              {option.replace(/-/g, " ")}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownLink;
