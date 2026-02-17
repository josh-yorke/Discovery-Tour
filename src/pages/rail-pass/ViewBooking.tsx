import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Navbar from "../../components/nav/Navbar";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import Header from "../../components/users/Header";
import { getBooking } from "../../hooks/rail-passes/passBooking";
import View from "../../components/rail-pass/booking/View";

const ViewBooking = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["railBookings", id],
    queryFn: () => getBooking(id),
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
            title="View Booking"
            url="/transport/booking"
            id={data._id}
          />
          <View
            railpass={data.railpass}
            plan={data.plan}
            customer={data.customer}
            travel={data.travel}
            remarks={data.remarks}
            status={data.status}
          />
        </div>
      )}
    </>
  );
};

export default ViewBooking;
