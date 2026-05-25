import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "../modal/Modal";
import SectionLoader from "../loader/SectionLoader";
import { deletePageConfig } from "../../hooks/page-config/pageConfig";
import type { PageConfig } from "../../types/page-config/pageConfigTypes";
import PageConfigCard from "../cards/PageConfigCard";

interface ParentProps {
  configs: PageConfig[];
  isLoading: boolean;
}

const PageConfigsParent = ({ configs, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePageConfig(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({
        queryKey: ["pageConfigs"],
        exact: false,
      });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this page config?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <SectionLoader />;

  return (
    <>
      {configs && configs.length > 0 ? (
        <div className="w-full lg:w-9/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configs.map((config: PageConfig) => (
            <PageConfigCard
              key={config._id}
              _id={config._id}
              type={config.type}
              keyName={config.key}
              displayName={config.displayName}
              pathLink={config.pathLink}
              order={config.order}
              isUnderMaintenance={config.isUnderMaintenance}
              childPages={config.childPages}
              onDelete={() => {
                handleDelete(config._id);
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

export default PageConfigsParent;
