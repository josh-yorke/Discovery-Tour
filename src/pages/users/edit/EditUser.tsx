import { useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import Edit from "../../../components/users/edit/Edit";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../../hooks/users/getUser";
import PageError from "../../../components/error/PageError";
import PageLoader from "../../../components/loader/PageLoader";

const EditUser = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      <Navbar />
      {isLoading || isError ? (
        isError ? (
          <PageError title="Reload" action={refetch} error={error?.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : null
      ) : (
        <div className="w-full flex flex-col items-center justify-center bg-gray-100">
          <Header style="p-6" url="/users" title="Edit User" id={id ?? ""} />
          <Edit
            firstName={data.firstName}
            lastName={data.lastName}
            email={data.email}
            id={data._id}
            role={data.role}
            status={data.status}
            allowedActions={data.allowedActions}
          />
        </div>
      )}
    </>
  );
};

export default EditUser;
