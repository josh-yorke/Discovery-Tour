import type { ReactNode } from "react";

interface IconProps {
  title: string;
  action: () => void;
  icon: ReactNode;
  style: string;
}

const IconButton = ({ icon, action, title, style }: IconProps) => {
  return (
    <button
      className={`${style} flex flex-row items-center justify-center gap-2 duration-300 text-xs font-normal cursor-pointer`}
      onClick={action}
    >
      {icon}
      <p className="text-xs font-normal">{title}</p>
    </button>
  );
};

export default IconButton;
