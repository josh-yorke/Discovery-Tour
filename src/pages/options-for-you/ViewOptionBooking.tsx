import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Navbar from "../../components/nav/Navbar";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import Header from "../../components/users/Header";
import { getOneOptionBooking } from "../../hooks/options/options";
import View from "../../components/options-for-you/view/View";

const ViewOptionBooking = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["option-bookings", id],
    queryFn: () => getOneOptionBooking(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const booking = data?.booking;

  return (
    <>
      <Navbar />

      {isLoading || isError ? (
        isError ? (
          <SectionError
            action={refetch}
            error={error?.message || "Failed to load booking details"}
          />
        ) : isLoading ? (
          <SectionLoader />
        ) : null
      ) : (
        <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-screen">
          <Header
            style="px-6 lg:px-0 py-6"
            title="View Booking"
            url="/options-for-you"
            id={booking?._id}
          />
          <View booking={booking} />
        </div>
      )}
    </>
  );
};

export default ViewOptionBooking;
