import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteTypesCategories } from "../../hooks/types-categories/typesCategories";
import type { typesCategoriesData } from "../../types/types-categories/typesCategoriesDataTypes";
import TypesCategoriesCard from "../cards/TypesCategoriesCard";
import PageLoader from "../loader/PageLoader";
import Modal from "../modal/Modal";

interface ParentProps {
  typeCategories: typesCategoriesData[];
  isLoading: boolean;
  type: string;
}

const TypesCategoriesParent = ({
  typeCategories,
  isLoading,
  type
}: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTypesCategories(id, type),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({
        queryKey: ["typesCategories"],
        exact: false,
      });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this type or category?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {typeCategories && typeCategories.length > 0 ? (
        <div className="w-full lg:w-7xl flex flex-wrap gap-6">
          {typeCategories.map((typeCategory: typesCategoriesData) => (
            <div
              key={typeCategory._id}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <TypesCategoriesCard
                onDelete={() => handleDelete(typeCategory._id)}
                key={typeCategory._id}
                _id={typeCategory._id}
                savedAt={typeCategory.savedAt}
                visaType={typeCategory.visaType}
                tourType={typeCategory.tourType}
                railPassType={typeCategory.railPassType}
                transportType={typeCategory.transportType}
                railPassCategory={typeCategory.railPassCategory}
                country={typeCategory.country}
                type={type}
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

export default TypesCategoriesParent;
