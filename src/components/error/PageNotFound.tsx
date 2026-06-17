import { PiPawPrintFill } from "react-icons/pi";
import Navbar from "../nav/Navbar";
import IconButton from "../button/IconButton";
import { useNavigate } from "react-router";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="w-full flex lg:items-start justify-center bg-black/6 px-6">
        <div className="w-full lg:w-7xl flex flex-col items-center justify-center py-12 min-h-screen gap-6">
          <div className="w-full flex flex-row items-center justify-center gap-2 font-barlow">
            <div className="p-6 rounded-3xl bg-white shadow-xl shadow-black/6">
              <p className="text-6xl font-semibold text-[#1d2087]">4</p>
            </div>
            <div className="p-6 rounded-3xl bg-white shadow-xl shadow-black/6">
              <p className="text-6xl font-semibold text-[#1d2087]">0</p>
            </div>
            <div className="p-6 rounded-3xl bg-white shadow-xl shadow-black/6">
              <p className="text-6xl font-semibold text-[#1d2087]">4</p>
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-4xl font-semibold text-black">Page Not Found</p>
            <p className="text-sm text-black/60">
              The page you are looking for was removed, moved, renamed or might
              never existed
            </p>
          </div>
          <IconButton
            action={() => navigate("/")}
            icon={
              <PiPawPrintFill
                size={16}
                color="white"
                className="rotate-0 group-hover:rotate-360 duration-300 ease-in-out transition-transform"
              />
            }
            title="Return Home"
            style="flex flex-row gap-2 items-center justify-center bg-[#1d2087] hover:bg-[#393ca3] duration-300 px-6 py-3 text-sm text-white rounded-3xl group"
          />
        </div>
      </div>
    </>
  );
};

export default PageNotFound;
