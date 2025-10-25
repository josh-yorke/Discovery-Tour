import { RiNewsLine, RiUser4Line } from "react-icons/ri";
import LinkButton from "./LinkButton";
import LogoutButton from "../button/LogoutButton";

const Navbar = () => {
  return (
    <div className="sticky top-0 left-0 w-full flex flex-row items-center justify-between p-6 shadow-black/10 shadow-2xl bg-white">
      <img src="/logo.png" alt="/" />
      <div className="hidden lg:flex flex-row items-center justify-center gap-6">
        <LinkButton
          to="/users"
          style="flex flex-row items-center justify-center text-sm font-normal gap-2"
          icon={<RiUser4Line size={16} />}
          title="Users"
        />
        <LinkButton
          to="/news"
          style="flex flex-row items-center justify-center text-sm font-normal gap-2"
          icon={<RiNewsLine size={16} />}
          title="News"
        />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Navbar;
