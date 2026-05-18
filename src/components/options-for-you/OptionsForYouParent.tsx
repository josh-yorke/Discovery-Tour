import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageLoader from "../loader/PageLoader";
import Modal from "../modal/Modal";
import { deleteOptionBooking } from "../../hooks/options/options";
import OptionBookingCard from "../cards/OptionBookingCard";

interface OptionBooking {
  _id: string;
  fullName: string;
  email: string;
  type: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OptionsForYouParentProps {
  bookings: OptionBooking[] | undefined;
  isLoading: boolean;
}

const OptionsForYouParent = ({
  bookings,
  isLoading,
}: OptionsForYouParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{
    success: boolean;
    message: string;
  }>({ success: false, message: "" });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOptionBooking(id),
    onSuccess: (data) => {
      setDeleteResult({ success: true, message: data.message });
      showModal(true);
      queryClient.invalidateQueries({
        queryKey: ["option-bookings"],
        exact: false,
      });
    },
    onError: (error: any) => {
      setDeleteResult({ success: false, message: error.message });
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {bookings && bookings.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking: OptionBooking) => (
            <OptionBookingCard
              key={booking._id}
              _id={booking._id}
              fullName={booking.fullName}
              email={booking.email}
              type={booking.type}
              message={booking.message}
              status={booking.status}
              createdAt={booking.createdAt}
              onDelete={() => handleDelete(booking._id)}
            />
          ))}
        </div>
      ) : (
        <div className="h-[60vh] flex items-center justify-center">
          <p className="text-sm font-normal text-gray-500">No bookings found</p>
        </div>
      )}

      {modal && (
        <Modal
          success={deleteResult.success}
          message={deleteResult.message}
          action={() => showModal(false)}
        />
      )}
    </>
  );
};

export default OptionsForYouParent;
