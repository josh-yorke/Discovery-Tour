import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getInsuranceBooking } from "../../../../hooks/insurances/insuranceBookings";
import Navbar from "../../../../components/nav/Navbar";
import SectionError from "../../../../components/error/SectionError";
import SectionLoader from "../../../../components/loader/SectionLoader";
import Header from "../../../../components/users/Header";
import View from "../../../../components/insurances/bookings/View";

const ViewInsuranceBooking = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["insuranceBookings", id],
    queryFn: () => getInsuranceBooking(id),
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
            title="View Insurance Booking"
            url="/insurance/bookings"
            id={data._id}
          />
          <View
            insurance={data.insurance}
            plan={data.plan}
            customer={data.customer}
            travel={data.travel}
            status={data.status}
          />
        </div>
      )}
    </>
  );
};

export default ViewInsuranceBooking;
