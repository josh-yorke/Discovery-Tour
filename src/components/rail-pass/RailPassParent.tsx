import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageLoader from "../loader/PageLoader";
import Modal from "../modal/Modal";
import RailPassCard from "../cards/RailPassCard";
import type { RailPassData } from "../../types/rail-pass/railPassDataTypes";
import { deleteRailPass } from "../../hooks/rail-pass/railPass";

interface ParentProps {
  railPasses: RailPassData[];
  isLoading: boolean;
}

const RailPassParent = ({ railPasses, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRailPass(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["railPasses"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this rail pass?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {railPasses && railPasses.length > 0 ? (
        <div className="w-full lg:w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {railPasses.map((railPass: RailPassData) => (
            <RailPassCard
              onDelete={() => handleDelete(railPass._id)}
              key={railPass._id}
              _id={railPass._id}
              title={railPass.title}
              country={railPass.country}
              description={railPass.description}
              images={railPass.images}
              category={railPass.category}
              type={railPass.typeV2}
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

export default RailPassParent;
