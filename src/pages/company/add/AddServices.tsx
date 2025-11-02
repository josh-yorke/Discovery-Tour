import { useQuery } from "@tanstack/react-query";
import { getDetails } from "../../../hooks/company/getDetails";
import Navbar from "../../../components/nav/Navbar";
import PageError from "../../../components/error/PageError";
import PageLoader from "../../../components/loader/PageLoader";
import Header from "../../../components/users/Header";
import AddService from "../../../components/company/add/AddService";

const AddServices = () => {
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["company"],
    queryFn: () => getDetails(),
    enabled: true,
  });

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-[100svh]">
        {isError ? (
          <PageError action={refetch} title="Reload" error={error?.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : (
          data && (
            <>
              <Header url="/company/services" title="Add Service" id="" />
              <AddService />
            </>
          )
        )}
      </div>
    </>
  );
};

export default AddServices;
