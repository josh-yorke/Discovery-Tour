import {
  RiAppsFill,
  RiAppsLine,
  RiCloseLine,
  RiMenuFill,
  RiMessage3Fill,
  RiMessage3Line,
  RiMoneyDollarCircleFill,
  RiMoneyDollarCircleLine,
  RiUser4Fill,
  RiUser4Line,
} from "react-icons/ri";
import LinkButton from "./LinkButton";
import LogoutButton from "../button/LogoutButton";
import { NavLink, useLocation } from "react-router";
import { useState } from "react";
import HoverLink from "./HoverLink";

const Navbar = () => {
  const { pathname } = useLocation();
  const [nav, showNav] = useState(false);

  return (
    <>
      <div className="sticky top-0 left-0 w-full flex flex-row items-center justify-between px-6 py-4 shadow-black/10 shadow-2xl bg-white z-30">
        <NavLink to={"/dashboard"}>
          <img src="/logo.png" alt="/" />
        </NavLink>
        <div className="hidden lg:flex flex-row items-center justify-center gap-6">
          <LinkButton
            to="/news"
            style={`${
              pathname.startsWith("/news")
                ? "font-semibold text-[#1d2087]"
                : "font-normal"
            } flex flex-row items-center justify-center text-sm  gap-2`}
            icon={
              pathname.startsWith("/news") ? (
                <RiMessage3Fill size={16} />
              ) : (
                <RiMessage3Line size={16} />
              )
            }
            title="News"
          />
          <LinkButton
            to="/promotions"
            style={`${
              pathname.startsWith("/promotions")
                ? "font-semibold text-[#1d2087]"
                : "font-normal"
            } flex flex-row items-center justify-center text-sm  gap-2`}
            icon={
              pathname.startsWith("/promotions") ? (
                <RiMoneyDollarCircleFill size={16} />
              ) : (
                <RiMoneyDollarCircleLine size={16} />
              )
            }
            title="Promotions"
          />
          <HoverLink
            options={["details", "carousel", "services", "awards", "branches"]}
            to="/company"
            style={`${
              pathname.startsWith("/company")
                ? "font-semibold text-[#1d2087]"
                : "font-normal"
            } flex flex-row items-center justify-center text-sm  gap-2`}
            icon={
              pathname.startsWith("/company") ? (
                <RiAppsFill size={16} />
              ) : (
                <RiAppsLine size={16} />
              )
            }
            title="Company"
          />

          <LinkButton
            to="/users"
            style={`${
              pathname.startsWith("/users")
                ? "font-semibold text-[#1d2087]"
                : "font-normal"
            } flex flex-row items-center justify-center text-sm  gap-2`}
            icon={
              pathname.startsWith("/users") ? (
                <RiUser4Fill size={16} />
              ) : (
                <RiUser4Line size={16} />
              )
            }
            title="Users"
          />
          <LogoutButton />
        </div>
        <div className="flex lg:hidden cursor-pointer">
          <RiMenuFill size={16} onClick={() => showNav(true)} color="#1d2087" />
        </div>
      </div>

      <div
        className={`${
          nav ? "right-0" : "right-[-100%]"
        } fixed top-0 h-[100svh] bg-white w-[90vw] z-[40] duration-300`}
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
          <div
            className="absolute left-[-16px] bg-[#1d2087] hover:bg-[#3b3eac] duration-300 p-2 rounded-full cursor-pointer"
            onClick={() => showNav(false)}
          >
            <RiCloseLine size={16} color="white" />
          </div>
          <LinkButton
            to="/news"
            style={`${
              pathname.startsWith("/news")
                ? "font-semibold text-[#1d2087]"
                : "font-normal"
            } flex flex-row items-center justify-center text-sm  gap-2`}
            icon={
              pathname.startsWith("/news") ? (
                <RiMessage3Fill size={16} />
              ) : (
                <RiMessage3Line size={16} />
              )
            }
            title="News"
          />
          <LinkButton
            to="/promotions"
            style={`${
              pathname.startsWith("/promotions")
                ? "font-semibold text-[#1d2087]"
                : "font-normal"
            } flex flex-row items-center justify-center text-sm  gap-2`}
            icon={
              pathname.startsWith("/promotions") ? (
                <RiMoneyDollarCircleFill size={16} />
              ) : (
                <RiMoneyDollarCircleLine size={16} />
              )
            }
            title="Promotions"
          />
          <LinkButton
            to="/company"
            style={`${
              pathname.startsWith("/company")
                ? "font-semibold text-[#1d2087]"
                : "font-normal"
            } flex flex-row items-center justify-center text-sm  gap-2`}
            icon={
              pathname.startsWith("/company") ? (
                <RiAppsFill size={16} />
              ) : (
                <RiAppsLine size={16} />
              )
            }
            title="Company"
          />
          <LinkButton
            to="/users"
            style={`${
              pathname.startsWith("/users")
                ? "font-semibold text-[#1d2087]"
                : "font-normal"
            } flex flex-row items-center justify-center text-sm  gap-2`}
            icon={
              pathname.startsWith("/users") ? (
                <RiUser4Fill size={16} />
              ) : (
                <RiUser4Line size={16} />
              )
            }
            title="Users"
          />
          <LogoutButton />
        </div>
      </div>
    </>
  );
};

export default Navbar;
