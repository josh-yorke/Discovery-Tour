import { getDetails } from "../../../hooks/company/getDetails";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../../../components/nav/Navbar";
import PageError from "../../../components/error/PageError";
import PageLoader from "../../../components/loader/PageLoader";
import Header from "../../../components/users/Header";
import { useParams } from "react-router";
import EditAward from "../../../components/company/edit/EditAward";

const EditAwards = () => {
  const { id } = useParams();
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
              <Header
                style="p-6"
                url="/company/awards"
                title="Edit Award"
                id={id ? id : ""}
              />
              <EditAward id={id ? id : ""} />
            </>
          )
        )}
      </div>
    </>
  );
};

export default EditAwards;
