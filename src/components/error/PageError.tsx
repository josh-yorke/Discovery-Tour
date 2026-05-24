import { RiHome6Line } from "react-icons/ri";
import { NavLink } from "react-router";
import Navbar from "../nav/Navbar";

interface PageErrorProps {
  error?: string;
  action?: () => void;
  title?: string;
}

const PageError = ({
  error,
  action,
  title = "Return Home",
}: PageErrorProps) => {
  const handleAction = () => {
    if (action) {
      action();
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="w-full bg-center bg-cover h-screen"
        style={{ backgroundImage: `url(/Error.jpg)` }}
      >
        <div className="w-full h-full bg-linear-to-tr from-white to-white/80 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto px-6">
            <p className="text-6xl mb-4">😅</p>
            <p className="text-2xl font-semibold text-gray-900 mb-3">
              Oops! Something went wrong
            </p>
            <p className="text-gray-600 mb-6">
              {error || "Please contact the admin for more information."}
            </p>
            {action ? (
              <div
                className="flex flex-row items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-tr from-[#1d2087] to-[#6468d9] text-sm text-white font-semibold cursor-pointer hover:shadow-lg transition-all"
                onClick={handleAction}
              >
                <RiHome6Line size={16} />
                {title}
              </div>
            ) : (
              <NavLink
                to="/"
                className="flex flex-row items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-linear-to-tr from-[#1d2087] to-[#6468d9] text-sm text-white font-semibold cursor-pointer hover:shadow-lg transition-all"
              >
                <RiHome6Line size={16} />
                {title}
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PageError;
