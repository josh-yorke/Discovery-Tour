import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageLoader from "../loader/PageLoader";
import Modal from "../modal/Modal";
import type { bookingData } from "../../types/rail-pass/bookingDataTypes";
import { deleteBooking } from "../../hooks/rail-passes/passBooking";
import BookingCard from "../cards/BookingCard";

interface ParentProps {
  bookings: bookingData[];
  isLoading: boolean;
}

const BookingParent = ({ bookings, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({
        queryKey: ["railBookings"],
        exact: false,
      });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this rail booking?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {bookings && bookings.length > 0 ? (
        <div className="w-full lg:w-7xl flex flex-wrap gap-6">
          {bookings.map((booking: bookingData) => (
            <div
              key={booking._id}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <BookingCard
                onDelete={() => handleDelete(booking._id)}
                key={booking._id}
                _id={booking._id}
                railpass={booking.railpass}
                plan={booking.plan}
                customer={booking.customer}
                travel={booking.travel}
                remarks={booking.remarks}
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

export default BookingParent;
