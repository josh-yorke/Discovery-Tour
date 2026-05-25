import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "../modal/Modal";
import SectionLoader from "../loader/SectionLoader";
import type { partnerData } from "../../types/partners/partnerDataTypes";
import { deletePartner } from "../../hooks/partners/partners";
import PartnerCard from "./PartnerCard";

interface ParentProps {
  partners: partnerData[];
  isLoading: boolean;
}

const PartnersParent = ({ partners, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePartner(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["partners"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this partner?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <SectionLoader />;

  return (
    <>
      {partners && partners.length > 0 ? (
        <div className="w-full lg:w-9/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner: partnerData) => (
            <PartnerCard
              key={partner._id}
              id={partner._id}
              partnerName={partner.partnerName}
              type={partner.typeV2?.partnerType || partner.type}
              logoImage={partner.logoImage}
              websiteUrl={partner.websiteUrl}
              dateAdded={partner.dateAdded}
              onDelete={() => {
                handleDelete(partner._id);
              }}
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

export default PartnersParent;
