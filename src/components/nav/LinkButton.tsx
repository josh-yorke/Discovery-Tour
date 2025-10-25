import type { ReactNode } from "react";
import { NavLink } from "react-router";

interface NavProps {
  style: string;
  to: string;
  icon: ReactNode;
  title: string;
}

const LinkButton = ({ to, style, icon, title }: NavProps) => {
  return (
    <NavLink to={to} className={style}>
      {icon}
      <p>{title}</p>
    </NavLink>
  );
};

export default LinkButton;
