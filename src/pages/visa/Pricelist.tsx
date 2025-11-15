import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/nav/Navbar";
import PageError from "../../components/error/PageError";
import PageLoader from "../../components/loader/PageLoader";
import VisaFileParent from "../../components/visafile/VisaFileParent";
import IconButton from "../../components/button/IconButton";
import { RiAddLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { getPricelists } from "../../hooks/visa/pricelist/getPricelists";

const Pricelist = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["pricelist"],
    queryFn: () => getPricelists(),
    enabled: true,
  });

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-[100svh] px-6 py-12 gap-12">
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <p className="text-md font-semibold text-[#1d2087]">
            Manage Pricelist
          </p>
          <div className="w-full flex flex-row gap-2 items-center justify-center">
            <IconButton
              icon={<RiAddLine size={16} />}
              title="New"
              action={() => navigate("/visas/pricelist/add")}
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-4 py-3.5 rounded-lg"
            />
          </div>
        </div>
        {isError ? (
          <PageError action={refetch} title="Reload" error={error?.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : (
          <>
            {data && <VisaFileParent visaFiles={data} isLoading={isLoading} />}
          </>
        )}
      </div>
    </>
  );
};

export default Pricelist;
