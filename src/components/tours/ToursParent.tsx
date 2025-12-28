import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageLoader from "../loader/PageLoader";
import Modal from "../modal/Modal";
import { deleteTour } from "../../hooks/tours/deleteTour";
import type { tourData } from "../../types/tours/tourDataTypes";
import TourCard from "./TourCard";

interface ParentProps {
  tours: tourData[];
  isLoading: boolean;
}

const ToursParent = ({ tours, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTour(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["tours"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tour?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {tours && tours.length > 0 ? (
        <div className="w-full lg:w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour: tourData) => (
            <TourCard
              onDelete={() => handleDelete(tour._id)}
              key={tour._id}
              id={tour._id}
              country={tour.country}
              mainLocationName={tour.mainLocationName}
              mainDescription={tour.mainDescription}
              images={tour.images}
              tags={tour.tags}
              category={tour.category}
              type={tour.typeV2}
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

export default ToursParent;
