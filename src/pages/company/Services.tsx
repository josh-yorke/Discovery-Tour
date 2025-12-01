import { RiAddLine } from "react-icons/ri";
import IconButton from "../../components/button/IconButton";
import Navbar from "../../components/nav/Navbar";
import ViewServices from "../../components/company/view/ViewServices";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getDetails } from "../../hooks/company/getDetails";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";

const Services = () => {
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
            Manage Services
          </p>
          <IconButton
            action={() => navigate("/company/services/add")}
            title="New Service"
            style="bg-[#1d2087] hover:bg-[#3b3eac] duration-300 text-white p-3 rounded-lg"
            icon={<RiAddLine size={16} />}
          />
        </div>
        {isError ? (
          <SectionError action={refetch} error={error?.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : (
          data && (
            <>
              <ViewServices services={data.services} />
            </>
          )
        )}
      </div>
    </>
  );
};

export default Services;
