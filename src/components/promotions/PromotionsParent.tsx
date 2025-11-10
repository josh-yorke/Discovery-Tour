import { useState } from "react";
import type { promotionData } from "../../types/promotions/promotionDataTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PageLoader from "../loader/PageLoader";
import Modal from "../modal/Modal";
import { deletePromotion } from "../../hooks/promotions/deletePromotion";
import PromotionsCard from "../cards/PromotionsCard";

interface ParentProps {
  promotions: promotionData[];
  isLoading: boolean;
}

const PromotionsParent = ({ promotions, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["promotions"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this promotion?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  console.log(promotions);

  return (
    <>
      {promotions && promotions.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promotion: promotionData) => (
            <PromotionsCard
              key={promotion._id}
              images={promotion.images}
              id={promotion._id}
              title={promotion.title}
              tags={promotion.tags}
              contents={promotion.contents}
              status={promotion.status}
              onDelete={() => {
                handleDelete(promotion._id);
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

export default PromotionsParent;
