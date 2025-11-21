import { useMutation, useQueryClient } from "@tanstack/react-query";
import VisaCard from "./VisaCard";
import { useState } from "react";
import type { visaData } from "../../../types/visa/visaDataTypes";
import PageLoader from "../../loader/PageLoader";
import { deleteVisa } from "../../../hooks/visa/visa/deleteVisa";
import Modal from "../../modal/Modal";

interface ParentProps {
  visas: visaData[];
  isLoading: boolean;
}

const VisaParent = ({ visas, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVisa(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["visas"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this visa?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {visas && visas.length > 0 ? (
        <div className="w-full lg:w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visas.map((visa: visaData) => (
            <VisaCard
              id={visa._id}
              onDelete={() => handleDelete(visa._id)}
              key={visa._id}
              mainDescription={visa.mainDescription}
              country={visa.country}
              type={visa.type}
              images={visa.images}
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

export default VisaParent;
