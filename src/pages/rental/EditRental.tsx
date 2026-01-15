import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Navbar from "../../components/nav/Navbar";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import Header from "../../components/users/Header";
import { getRental } from "../../hooks/rental/rental";
import Edit from "../../components/rental/Edit";

const EditRental = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["rentals", id],
    queryFn: () => getRental(id),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      <Navbar />

      {isLoading || isError ? (
        isError ? (
          <SectionError action={refetch} error={error.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : null
      ) : (
        <div className="w-full flex flex-col items-center justify-center bg-gray-100">
          <Header
            style="px-6 lg:px-0 py-6"
            title="Edit Rental"
            url="/transport/rental"
            id={data._id}
          />
          <Edit
            id={data._id}
            rental={data.rental}
            transport={data.transport}
            vehicle={data.vehicle}
            customer={data.customer}
            plan={data.plan}
            status={data.status}
          />
        </div>
      )}
    </>
  );
};

export default EditRental;
