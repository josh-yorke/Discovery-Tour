import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { insuranceBookingData } from "../../../types/insurances/insuranceBookingDataTypes";
import PageLoader from "../../loader/PageLoader";
import Modal from "../../modal/Modal";
import { deleteInsuranceBooking } from "../../../hooks/insurances/insuranceBookings";
import InsuranceBookingCard from "../../cards/InsuranceBookingCard";

interface ParentProps {
  bookings: insuranceBookingData[];
  isLoading: boolean;
}

const InsuranceBookingParent = ({ bookings, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInsuranceBooking(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({
        queryKey: ["insuranceBookings"],
        exact: false,
      });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this insurance booking?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {bookings && bookings.length > 0 ? (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          {bookings.map((booking: insuranceBookingData) => (
            <div key={booking._id} className="w-full">
              <InsuranceBookingCard
                onDelete={() => handleDelete(booking._id)}
                _id={booking._id}
                customer={booking.customer}
                insurance={booking.insurance}
                plan={booking.plan}
                travel={booking.travel}
                status={booking.status}
                dateAdded={booking.dateAdded}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[60vh] flex items-center justify-center">
          <p className="text-sm font-normal">No Results Found</p>
        </div>
      )}
      {modal && (
        <Modal
          success={deleteMutation.isError ? false : true}
          message={
            deleteMutation.isError
              ? deleteMutation.error.message
              : deleteMutation.data
          }
          action={() => showModal(false)}
        />
      )}
    </>
  );
};

export default InsuranceBookingParent;
