import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageLoader from "../loader/PageLoader";
import Modal from "../modal/Modal";
import type { transportationData } from "../../types/transportation/transportationDataTypes";
import { deleteTransport } from "../../hooks/transportation/transportation";
import TransportationCard from "../cards/TransportationCard";

interface ParentProps {
  transportations: transportationData[];
  isLoading: boolean;
}

const TransportationParent = ({ transportations, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTransport(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({
        queryKey: ["transports"],
        exact: false,
      });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transportation?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {transportations && transportations.length > 0 ? (
        <div className="w-full lg:w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transportations.map((transportation: transportationData) => (
            <TransportationCard
              onDelete={() => handleDelete(transportation._id)}
              key={transportation._id}
              _id={transportation._id}
              title={transportation.title}
              country={transportation.country}
              description={transportation.description}
              images={transportation.images}
              type={transportation.typeV2}
            />
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

export default TransportationParent;
