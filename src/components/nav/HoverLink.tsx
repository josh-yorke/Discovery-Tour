import { useState, useRef, useEffect, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

interface NavProps {
  style: string;
  to: string;
  icon: ReactNode;
  title: string;
  options: string[];
}

const HoverLink = ({ to, style, icon, title, options }: NavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex justify-center" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`${style} cursor-pointer hover:opacity-80 transition-opacity`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon}
        <span>{title}</span>
        {isOpen ? (
          <RiArrowUpSLine size={16} className="ml-0.5" />
        ) : (
          <RiArrowDownSLine size={16} className="ml-0.5" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl shadow-black/10 min-w-40 z-50 border border-gray-200">
          <div className="py-2">
            {options.map((option: string) => {
              const fullPath = `${to}/${option}`;
              const isActive =
                pathname === fullPath || pathname === `${fullPath}/`;

              return (
                <NavLink
                  key={option}
                  to={fullPath}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 text-sm capitalize transition-colors hover:bg-gray-100 ${
                    isActive
                      ? "text-[#1d2087] font-semibold bg-blue-50"
                      : "text-gray-700"
                  }`}
                >
                  {option.replace(/-/g, " ")}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverLink;
