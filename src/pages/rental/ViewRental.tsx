import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Navbar from "../../components/nav/Navbar";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import Header from "../../components/users/Header";
import { getRental } from "../../hooks/rental/rental";
import View from "../../components/rental/View";

const ViewRental = () => {
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
            title="View Rental"
            url="/transport/rental"
            id={data._id}
          />
          <View
            transport={data.transport}
            plan={data.plan}
            vehicle={data.vehicle}
            customer={data.customer}
            rental={data.rental}
            status={data.status}
          />
        </div>
      )}
    </>
  );
};

export default ViewRental;
