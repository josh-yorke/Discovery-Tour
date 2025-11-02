import Header from "../../../components/users/Header";
import PageError from "../../../components/error/PageError";
import PageLoader from "../../../components/loader/PageLoader";
import Navbar from "../../../components/nav/Navbar";
import { useQuery } from "@tanstack/react-query";
import { getDetails } from "../../../hooks/company/getDetails";
import EditBranch from "../../../components/company/edit/EditBranch";
import { useParams } from "react-router";

const EditBranches = () => {
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
                url="/company/branches"
                title="Manage Branch"
                id={id ? id : ""}
              />
              <EditBranch id={id ? id : ""} />
            </>
          )
        )}
      </div>
    </>
  );
};

export default EditBranches;
