import { useState } from "react";
import {
  RiAppsFill,
  RiAppsLine,
  RiArrowUpSLine,
  RiCameraAiFill,
  RiCameraAiLine,
  RiCarFill,
  RiCarLine,
  RiCloseFill,
  RiGridFill,
  RiGridLine,
  RiGlobeFill,
  RiGlobeLine,
  RiLandscapeAiFill,
  RiLandscapeAiLine,
  RiMenuFill,
  RiUser4Fill,
  RiUser4Line,
  RiBriefcase2Line,
  RiBriefcase2Fill,
  RiHeartPulseLine,
  RiHeartPulseFill,
} from "react-icons/ri";
import { useLocation, useNavigate } from "react-router";
import LogoutButton from "../button/LogoutButton";
import DropdownLink from "./DropdownLink";
import HoverLink from "./HoverLink";
import LinkButton from "./LinkButton";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [nav, showNav] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // If we're already on the home page, reload the page
    if (pathname === "/") {
      window.location.reload();
    } else {
      // Otherwise navigate to home
      navigate("/");
    }
  };

  return (
    <>
      <div className="sticky top-0 left-0 w-full flex flex-col items-center justify-center z-30 bg-white shadow-black/6 shadow-2xl">
        <div className=" w-full lg:w-7xl flex flex-row items-center justify-between px-6 lg:px-2 py-4  bg-white ">
          <div onClick={handleLogoClick} className="cursor-pointer">
            <img src="/Logo.jpeg" alt="/" width={200} />
          </div>
          <div className="hidden lg:flex flex-row items-center justify-center gap-6">
            <LinkButton
              to="/visas/visa"
              style={`${
                pathname.startsWith("/visas")
                  ? "font-semibold text-[#1d2087]"
                  : "font-normal"
              } flex flex-row items-center justify-center text-sm  gap-2`}
              icon={
                pathname.startsWith("/visas") ? (
                  <RiGlobeFill size={16} />
                ) : (
                  <RiGlobeLine size={16} />
                )
              }
              title="Visa"
            />

            <LinkButton
              to="/tours"
              style={`${
                pathname.startsWith("/tours")
                  ? "font-semibold text-[#1d2087]"
                  : "font-normal"
              } flex flex-row items-center justify-center text-sm  gap-2`}
              icon={
                pathname.startsWith("/tours") ? (
                  <RiLandscapeAiFill size={16} />
                ) : (
                  <RiLandscapeAiLine size={16} />
                )
              }
              title="Tours"
            />

            <HoverLink
              options={[
                "vehicles",
                "transportation",
                "vehicle hire",
                "rail passes",
                "bookings",
              ]}
              to="/transport"
              style={`${
                pathname.startsWith("/transport")
                  ? "font-semibold text-[#1d2087]"
                  : "font-normal"
              } flex flex-row items-center justify-center text-sm  gap-2`}
              icon={
                pathname.startsWith("/transport") ? (
                  <RiCarFill size={16} />
                ) : (
                  <RiCarLine size={16} />
                )
              }
              title="Mobility"
            />

            <HoverLink
              options={["partners", "insurances", "bookings"]}
              to="/insurance"
              style={`${
                pathname.startsWith("/insurance")
                  ? "font-semibold text-[#1d2087]"
                  : "font-normal"
              } flex flex-row items-center justify-center text-sm  gap-2`}
              icon={
                pathname.startsWith("/insurance") ? (
                  <RiHeartPulseFill size={16} />
                ) : (
                  <RiHeartPulseLine size={16} />
                )
              }
              title="Insurance"
            />

            <LinkButton
              to="/careers"
              style={`${
                pathname.startsWith("/careers")
                  ? "font-semibold text-[#1d2087]"
                  : "font-normal"
              } flex flex-row items-center justify-center text-sm  gap-2`}
              icon={
                pathname.startsWith("/careers") ? (
                  <RiBriefcase2Fill size={16} />
                ) : (
                  <RiBriefcase2Line size={16} />
                )
              }
              title="Careers"
            />

            <HoverLink
              options={["happenings", "blogs"]}
              to="/articles"
              style={`${
                pathname.startsWith("/articles")
                  ? "font-semibold text-[#1d2087]"
                  : "font-normal"
              } flex flex-row items-center justify-center text-sm  gap-2`}
              icon={
                pathname.startsWith("/articles") ? (
                  <RiCameraAiFill size={16} />
                ) : (
                  <RiCameraAiLine size={16} />
                )
              }
              title="Articles"
            />

            <LinkButton
              to="/types-categories"
              style={`${
                pathname.startsWith("/types-categories")
                  ? "font-semibold text-[#1d2087]"
                  : "font-normal"
              } flex flex-row items-center justify-center text-sm  gap-2`}
              icon={
                pathname.startsWith("/types-categories") ? (
                  <RiGridFill size={16} />
                ) : (
                  <RiGridLine size={16} />
                )
              }
              title="Categories"
            />

            <HoverLink
              options={[
                "details",
                "carousel",
                "services",
                "awards",
                "branches",
                "markups",
                "scraper",
              ]}
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
            {nav ? (
              <RiCloseFill
                size={16}
                onClick={() => showNav(!nav)}
                color="#1d2087"
              />
            ) : (
              <RiMenuFill
                size={16}
                onClick={() => showNav(!nav)}
                color="#1d2087"
              />
            )}
          </div>
        </div>
        <div
          className={`${
            nav ? "top-0" : "top-full"
          } fixed top-0 h-screen bg-white w-full z-20 duration-300`}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 py-12">
            <div onClick={handleLogoClick} className="pb-6 cursor-pointer">
              <img src="/logo.png" alt="/" />
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <LinkButton
                to="/visas/visa"
                style={`${
                  pathname.startsWith("/visas/visa")
                    ? "font-semibold text-[#1d2087]"
                    : "font-normal"
                } flex flex-row items-center justify-center text-sm  gap-2`}
                icon={
                  pathname.startsWith("/visas/visa") ? (
                    <RiGlobeFill size={16} />
                  ) : (
                    <RiGlobeLine size={16} />
                  )
                }
                title="Visa"
              />

              <LinkButton
                to="/tours"
                style={`${
                  pathname.startsWith("/tours")
                    ? "font-semibold text-[#1d2087]"
                    : "font-normal"
                } flex flex-row items-center justify-center text-sm  gap-2`}
                icon={
                  pathname.startsWith("/tours") ? (
                    <RiLandscapeAiFill size={16} />
                  ) : (
                    <RiLandscapeAiLine size={16} />
                  )
                }
                title="Tours"
              />

              <DropdownLink
                options={[
                  "rail-passes",
                  "vehicles",
                  "transportation",
                  "rental",
                ]}
                to="/transport"
                style={`${
                  pathname.startsWith("/transport")
                    ? "font-semibold text-[#1d2087]"
                    : "font-normal"
                } flex flex-row items-center justify-center text-sm  gap-2`}
                icon={
                  pathname.startsWith("/transport") ? (
                    <RiCarFill size={16} />
                  ) : (
                    <RiCarLine size={16} />
                  )
                }
                title="Mobility"
              />

              <DropdownLink
                options={["insurances", "partners", "bookings"]}
                to="/insurance"
                style={`${
                  pathname.startsWith("/insurance")
                    ? "font-semibold text-[#1d2087]"
                    : "font-normal"
                } flex flex-row items-center justify-center text-sm  gap-2`}
                icon={
                  pathname.startsWith("/insurance") ? (
                    <RiHeartPulseFill size={16} />
                  ) : (
                    <RiHeartPulseLine size={16} />
                  )
                }
                title="Insurance"
              />

              <LinkButton
                to="/careers"
                style={`${
                  pathname.startsWith("/careers")
                    ? "font-semibold text-[#1d2087]"
                    : "font-normal"
                } flex flex-row items-center justify-center text-sm  gap-2`}
                icon={
                  pathname.startsWith("/careers") ? (
                    <RiBriefcase2Fill size={16} />
                  ) : (
                    <RiBriefcase2Line size={16} />
                  )
                }
                title="Careers"
              />

              <DropdownLink
                options={["blogs", "happenings"]}
                to="/articles"
                style={`${
                  pathname.startsWith("/articles")
                    ? "font-semibold text-[#1d2087]"
                    : "font-normal"
                } flex flex-row items-center justify-center text-sm  gap-2`}
                icon={
                  pathname.startsWith("/articles") ? (
                    <RiCameraAiFill size={16} />
                  ) : (
                    <RiCameraAiLine size={16} />
                  )
                }
                title="Articles"
              />

              <LinkButton
                to="/types-categories"
                style={`${
                  pathname.startsWith("/types-categories")
                    ? "font-semibold text-[#1d2087]"
                    : "font-normal"
                } flex flex-row items-center justify-center text-sm  gap-2`}
                icon={
                  pathname.startsWith("/types-categories") ? (
                    <RiGridFill size={16} />
                  ) : (
                    <RiGridLine size={16} />
                  )
                }
                title="Categories"
              />

              <DropdownLink
                options={[
                  "details",
                  "carousel",
                  "services",
                  "awards",
                  "branches",
                  "markups",
                  "scraper",
                ]}
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
            <div className="absolute bottom-6" onClick={() => showNav(!nav)}>
              <RiArrowUpSLine size={16} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
