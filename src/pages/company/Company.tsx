import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/nav/Navbar";
import { getDetails } from "../../hooks/company/getDetails";
import PageError from "../../components/error/PageError";
import PageLoader from "../../components/loader/PageLoader";
import View from "../../components/company/view/View";

const Company = () => {
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["company"],
    queryFn: () => getDetails(),
    enabled: true,
  });

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-[100svh] px-6 py-12 gap-12">
        <p className="text-md font-semibold text-[#1d2087]">
          Manage Company Details
        </p>
        {isError ? (
          <PageError action={refetch} title="Reload" error={error?.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : (
          data && (
            <View
              _id={data._id}
              name={data.name}
              tagline={data.tagline}
              about={data.about}
              carousel={data.carousel}
              mission={data.mission}
              vision={data.vision}
              coreValues={data.coreValues}
              services={data.services}
              awards={data.awards}
              branches={data.branches}
            />
          )
        )}
      </div>
    </>
  );
};

export default Company;
