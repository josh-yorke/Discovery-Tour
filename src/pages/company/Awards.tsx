import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getDetails } from "../../hooks/company/getDetails";
import { RiAddLine } from "react-icons/ri";
import ViewAwards from "../../components/company/view/ViewAwards";
import PageError from "../../components/error/PageError";
import PageLoader from "../../components/loader/PageLoader";
import IconButton from "../../components/button/IconButton";
import Navbar from "../../components/nav/Navbar";

const Awards = () => {
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
          <p className="text-md font-semibold text-[#1d2087]">Manage Awards</p>
          <IconButton
            action={() => navigate("/company/awards/add")}
            title="Add Award"
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
              <ViewAwards awards={data.awards} />
            </>
          )
        )}
      </div>
    </>
  );
};

export default Awards;
