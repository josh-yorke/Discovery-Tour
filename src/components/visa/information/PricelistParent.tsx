import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PricelistCard from "./PricelistCard";
import type { pricelistData } from "../../../types/pricelist/pricelistDataTypes";
import { deleteVisaFile } from "../../../hooks/visa/file/deleteVisaFile";
import PageLoader from "../../loader/PageLoader";
import Modal from "../../modal/Modal";

interface ParentProps {
  pricelistData: pricelistData[];
  isLoading: boolean;
}

const PricelistParent = ({ pricelistData, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVisaFile(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["pricelist"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this pricelist?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {pricelistData && pricelistData.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricelistData.map((pricelist: pricelistData) => (
            <PricelistCard
              plan={pricelist.plan}
              fee={pricelist.fee}
              description={pricelist.description}
              visa={pricelist.visa}
              filesAssociated={pricelist.filesAssociated}
              id={pricelist._id}
              onDelete={() => handleDelete(pricelist._id)}
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

export default PricelistParent;
