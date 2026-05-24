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
  RiServiceLine,
  RiServiceFill,
  RiFolderSettingsFill,
  RiFolderSettingsLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import { NavLink, useLocation, useNavigate } from "react-router";
import LogoutButton from "../button/LogoutButton";
import HoverLink from "./HoverLink";
import LinkButton from "./LinkButton";
import LanguageSwitcher from "../language/LanguageSwitcher";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [nav, showNav] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const toggleMobileDropdown = (id: string) => {
    setMobileDropdown(mobileDropdown === id ? null : id);
  };

  // Mobile menu items configuration
  const mobileMenuItems = [
    {
      id: "visas",
      path: "/visas/visa",
      label: "Visa",
      icon: RiGlobeLine,
      activeIcon: RiGlobeFill,
      checkPath: "/visas/visa",
    },
    {
      id: "tours",
      path: "/tours",
      label: "Tours",
      icon: RiLandscapeAiLine,
      activeIcon: RiLandscapeAiFill,
      checkPath: "/tours",
    },
    {
      id: "mobility",
      label: "Mobility",
      icon: RiCarLine,
      activeIcon: RiCarFill,
      isDropdown: true,
      options: ["rail-passes", "vehicles", "transportation", "vehicle hire"],
      basePath: "/transport",
    },
    {
      id: "insurance",
      label: "Insurance",
      icon: RiHeartPulseLine,
      activeIcon: RiHeartPulseFill,
      isDropdown: true,
      options: ["insurances", "partners", "bookings"],
      basePath: "/insurance",
    },
    {
      id: "careers",
      path: "/careers",
      label: "Careers",
      icon: RiBriefcase2Line,
      activeIcon: RiBriefcase2Fill,
      checkPath: "/careers",
    },
    {
      id: "articles",
      label: "Articles",
      icon: RiCameraAiLine,
      activeIcon: RiCameraAiFill,
      isDropdown: true,
      options: ["blogs", "happenings"],
      basePath: "/articles",
    },
    {
      id: "categories",
      path: "/types-categories",
      label: "Categories",
      icon: RiGridLine,
      activeIcon: RiGridFill,
      checkPath: "/types-categories",
    },
    {
      id: "options-for-you",
      path: "/options-for-you",
      label: "Options For You",
      icon: RiServiceLine,
      activeIcon: RiServiceFill,
      checkPath: "/options-for-you",
    },
    {
      id: "page-configs",
      path: "/page-configs",
      label: "Page Configs",
      icon: RiFolderSettingsLine,
      activeIcon: RiFolderSettingsFill,
      checkPath: "/page-configs",
    },
    {
      id: "company",
      label: "Company",
      icon: RiAppsLine,
      activeIcon: RiAppsFill,
      isDropdown: true,
      options: [
        "details",
        "carousel",
        "services",
        "awards",
        "branches",
        "markups",
        "scraper",
      ],
      basePath: "/company",
    },
    {
      id: "users",
      path: "/users",
      label: "Users",
      icon: RiUser4Line,
      activeIcon: RiUser4Fill,
      checkPath: "/users",
    },
  ];

  // Desktop tab items
  const tabItems = [
    {
      id: "visas",
      path: "/visas/visa",
      label: "Visa",
      icon: { fill: RiGlobeFill, line: RiGlobeLine },
      checkPath: "/visas",
    },
    {
      id: "tours",
      path: "/tours",
      label: "Tours",
      icon: { fill: RiLandscapeAiFill, line: RiLandscapeAiLine },
      checkPath: "/tours",
    },
    {
      id: "mobility",
      path: "/transport",
      label: "Mobility",
      icon: { fill: RiCarFill, line: RiCarLine },
      checkPath: "/transport",
      isHover: true,
      options: [
        "vehicles",
        "transportation",
        "vehicle hire",
        "rail passes",
        "bookings",
      ],
    },
    {
      id: "insurance",
      path: "/insurance",
      label: "Insurance",
      icon: { fill: RiHeartPulseFill, line: RiHeartPulseLine },
      checkPath: "/insurance",
      isHover: true,
      options: ["partners", "insurances", "bookings"],
    },
    {
      id: "careers",
      path: "/careers",
      label: "Careers",
      icon: { fill: RiBriefcase2Fill, line: RiBriefcase2Line },
      checkPath: "/careers",
    },
    {
      id: "articles",
      path: "/articles",
      label: "Articles",
      icon: { fill: RiCameraAiFill, line: RiCameraAiLine },
      checkPath: "/articles",
      isHover: true,
      options: ["happenings", "blogs"],
    },
    {
      id: "categories",
      path: "/types-categories",
      label: "Categories",
      icon: { fill: RiGridFill, line: RiGridLine },
      checkPath: "/types-categories",
    },
    {
      id: "options-for-you",
      path: "/options-for-you",
      label: "Options For You",
      icon: { fill: RiServiceFill, line: RiServiceLine },
      checkPath: "/options-for-you",
    },
    {
      id: "page-configs",
      path: "/page-configs",
      label: "Page Configs",
      icon: { fill: RiFolderSettingsFill, line: RiFolderSettingsLine },
      checkPath: "/page-configs",
    },
    {
      id: "company",
      path: "/company",
      label: "Company",
      icon: { fill: RiAppsFill, line: RiAppsLine },
      checkPath: "/company",
      isHover: true,
      options: [
        "details",
        "carousel",
        "services",
        "awards",
        "branches",
        "markups",
        "scraper",
      ],
    },
    {
      id: "users",
      path: "/users",
      label: "Users",
      icon: { fill: RiUser4Fill, line: RiUser4Line },
      checkPath: "/users",
    },
  ];

  return (
    <>
      <div className="sticky top-0 left-0 w-full z-30 bg-white shadow-md">
        {/* Stack 1: Logo + Actions */}
        <div className="w-full px-4 sm:px-6 py-4 bg-white">
          <div className="w-full lg:w-9/10 mx-auto flex flex-row items-center justify-between">
            <div onClick={handleLogoClick} className="cursor-pointer">
              <img src="/Logo.jpeg" alt="Logo" className="h-8 sm:h-10 w-auto" />
            </div>

            <div className="hidden lg:flex flex-row items-center gap-3">
              <LanguageSwitcher />
              <LogoutButton />
            </div>

            <div className="flex lg:hidden cursor-pointer">
              {nav ? (
                <RiCloseFill
                  size={20}
                  onClick={() => showNav(!nav)}
                  color="#1d2087"
                />
              ) : (
                <RiMenuFill
                  size={20}
                  onClick={() => showNav(!nav)}
                  color="#1d2087"
                />
              )}
            </div>
          </div>
        </div>

        {/* Stack 2: Desktop Navigation Tabs - JUSTIFY BETWEEN */}
        <div className="hidden lg:block w-full bg-white border-t border-gray-100">
          <div className="w-full lg:w-9/10 mx-auto px-6">
            <div className="flex flex-row items-center justify-between gap-2 flex-wrap">
              {tabItems.map((tab) => {
                const isActive = pathname.startsWith(tab.checkPath);
                const IconComponent = isActive ? tab.icon.fill : tab.icon.line;

                if (tab.isHover) {
                  return (
                    <div key={tab.id} className="relative">
                      <HoverLink
                        options={tab.options}
                        to={tab.path}
                        style={`
                          ${
                            isActive
                              ? "font-semibold text-[#1d2087] border-b-2 border-[#1d2087]"
                              : "font-medium text-gray-600 hover:text-[#1d2087]"
                          } 
                          flex flex-row items-center justify-center gap-2 px-2 py-3 text-sm transition-colors duration-200 whitespace-nowrap
                        `}
                        icon={<IconComponent size={16} />}
                        title={tab.label}
                      />
                    </div>
                  );
                }

                return (
                  <LinkButton
                    key={tab.id}
                    to={tab.path}
                    style={`
                      ${
                        isActive
                          ? "font-semibold text-[#1d2087] border-b-2 border-[#1d2087]"
                          : "font-medium text-gray-600 hover:text-[#1d2087]"
                      } 
                      flex flex-row items-center justify-center gap-2 px-2 py-3 text-sm transition-colors duration-200 whitespace-nowrap
                    `}
                    icon={<IconComponent size={16} />}
                    title={tab.label}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        <div
          className={`${
            nav ? "translate-x-0" : "translate-x-full"
          } fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl z-40 transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div onClick={handleLogoClick} className="cursor-pointer">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
              </div>
              <button
                onClick={() => showNav(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RiCloseFill size={20} color="#1d2087" />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 py-4">
              {mobileMenuItems.map((item) => {
                const isActive = item.checkPath
                  ? pathname.startsWith(item.checkPath)
                  : item.basePath
                    ? pathname.startsWith(item.basePath)
                    : false;

                const IconComponent = isActive ? item.activeIcon : item.icon;

                if (item.isDropdown) {
                  const isOpen = mobileDropdown === item.id;

                  return (
                    <div key={item.id} className="border-b border-gray-50">
                      <button
                        onClick={() => toggleMobileDropdown(item.id)}
                        className={`w-full flex items-center justify-between px-6 py-3 transition-colors ${
                          isActive ? "text-[#1d2087]" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent size={18} />
                          <span
                            className={`text-sm ${isActive ? "font-semibold" : "font-normal"}`}
                          >
                            {item.label}
                          </span>
                        </div>
                        {isOpen ? (
                          <RiArrowUpSLine size={16} />
                        ) : (
                          <RiArrowDownSLine size={16} />
                        )}
                      </button>

                      {isOpen && (
                        <div className="bg-gray-50 py-2">
                          {item.options?.map((option) => (
                            <NavLink
                              key={option}
                              to={`${item.basePath}/${option}`}
                              onClick={() => {
                                showNav(false);
                                setMobileDropdown(null);
                              }}
                              className={({ isActive: isOptionActive }) =>
                                `block px-12 py-2 text-sm capitalize transition-colors hover:bg-gray-100 ${
                                  isOptionActive
                                    ? "text-[#1d2087] font-semibold"
                                    : "text-gray-600"
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
                }

                return (
                  <NavLink
                    key={item.id}
                    to={item.path!}
                    onClick={() => showNav(false)}
                    className={({ isActive: isLinkActive }) =>
                      `flex items-center gap-3 px-6 py-3 transition-colors border-b border-gray-50 ${
                        isLinkActive || isActive
                          ? "text-[#1d2087] font-semibold bg-blue-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    <IconComponent size={18} />
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Mobile Menu Footer */}
            <div className="border-t border-gray-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Language</span>
                <LanguageSwitcher />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account</span>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {nav && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => showNav(false)}
          />
        )}
      </div>
    </>
  );
};

export default Navbar;
