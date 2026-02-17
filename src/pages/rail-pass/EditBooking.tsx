import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Navbar from "../../components/nav/Navbar";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import Header from "../../components/users/Header";
import { getBooking } from "../../hooks/rail-passes/passBooking";
import Edit from "../../components/rail-pass/booking/Edit";

const EditBooking = () => {
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
            title="Edit Booking"
            url="/transport/bookings"
            id={data._id}
          />
          <Edit
            id={data._id}
            railpass={data.railpass._id}
            plan={data.plan._id}
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

export default EditBooking;
