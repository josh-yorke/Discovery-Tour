import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "../modal/Modal";
import SectionLoader from "../loader/SectionLoader";
import type { markupData } from "../../types/markups/markupDataTypes";
import { updateMarkup } from "../../hooks/markups/markups";
import MarkupCard from "../cards/MarkupCard";

interface ParentProps {
  markups: markupData[];
  isLoading: boolean;
}

const MarkupParent = ({ markups, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      const filteredMarkups = markups.filter((markup) => markup._id !== id);
      return updateMarkup(filteredMarkups);
    },
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["markups"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this markup?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <SectionLoader />;

  return (
    <>
      {markups && markups.length > 0 ? (
        <div className="w-full lg:w-9/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markups.map((markup: markupData) => (
            <MarkupCard
              key={markup._id}
              _id={markup._id}
              spread={markup.spread}
              markUp={markup.markUp}
              currencyPair={markup.currencyPair}
              onDelete={() => handleDelete(markup._id)}
            />
          ))}
        </div>
      ) : (
        <div className="h-[60vh] flex items-center justify-center">
          <p className="text-sm font-normal">No Currency Markups Found</p>
        </div>
      )}
      {modal && (
        <Modal
          success={!deleteMutation.isError}
          message={
            deleteMutation.isError
              ? deleteMutation.error.message
              : "Currency Markup deleted successfully"
          }
          action={() => showModal(false)}
        />
      )}
    </>
  );
};

export default MarkupParent;
