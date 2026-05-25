import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageLoader from "../loader/PageLoader";
import Modal from "../modal/Modal";
import { deleteRental } from "../../hooks/rental/rental";
import RentalCard from "../cards/RentalCard";
import type { rentalData } from "../../types/rental/rentalDataTypes";

interface ParentProps {
  rentals: rentalData[];
  isLoading: boolean;
}

const RentalParent = ({ rentals, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRental(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({
        queryKey: ["rentals"],
        exact: false,
      });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this rental?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {rentals && rentals.length > 0 ? (
        <div className="w-full lg:w-9/10 flex flex-col gap-6">
          {rentals.map((rental: rentalData) => (
            <div key={rental._id} className="w-full">
              <RentalCard
                onDelete={() => handleDelete(rental._id)}
                key={rental._id}
                _id={rental._id}
                status={rental.status}
                customer={rental.customer}
                dateAdded={rental.dateAdded}
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

export default RentalParent;
