import { RiAddLine } from "react-icons/ri";
import IconButton from "../../components/button/IconButton";
import ViewBranches from "../../components/company/view/ViewBranches";
import PageError from "../../components/error/PageError";
import PageLoader from "../../components/loader/PageLoader";
import Navbar from "../../components/nav/Navbar";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getDetails } from "../../hooks/company/getDetails";

const Branches = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["company"],
    queryFn: () => getDetails(),
    enabled: true,
  });

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-[100svh] px-6 py-12 gap-12">
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <p className="text-md font-semibold text-[#1d2087]">
            Manage Branches
          </p>
          <IconButton
            action={() => navigate("/company/branches/add")}
            title="Add Branch"
            style="bg-[#1d2087] hover:bg-[#3b3eac] duration-300 text-white p-3 rounded-lg"
            icon={<RiAddLine size={16} />}
          />
        </div>
        {isError ? (
          <PageError action={refetch} title="Reload" error={error?.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : (
          data && (
            <>
              <ViewBranches branches={data.branches} />
            </>
          )
        )}
      </div>
    </>
  );
};

export default Branches;
