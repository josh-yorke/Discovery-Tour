import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageLoader from "../loader/PageLoader";
import VisaFileCard from "./VisaFileCard";
import Modal from "../modal/Modal";
import type { visaFileData } from "../../types/visafile/visaFileDataTypes";
import { deleteVisaFile } from "../../hooks/visa/file/deleteVisaFile";

interface ParentProps {
  visaFiles: visaFileData[];
  isLoading: boolean;
}

const VisaFileParent = ({ visaFiles, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVisaFile(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["files"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this visa file?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {visaFiles && visaFiles.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visaFiles.map((visafile: visaFileData) => (
            <VisaFileCard
              key={visafile._id}
              file={visafile.file}
              fileTitle={visafile.fileTitle}
              id={visafile._id}
              onDelete={() => handleDelete(visafile._id)}
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

export default VisaFileParent;
