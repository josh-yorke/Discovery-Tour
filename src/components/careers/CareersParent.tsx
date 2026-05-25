import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PageLoader from "../loader/PageLoader";
import { deleteCareer } from "../../hooks/careers/careers";
import type { careerData } from "../../types/career/careerDataTypes";
import Modal from "../modal/Modal";
import CareersCard from "./CareersCard";

interface ParentProps {
  careers: careerData[];
  isLoading: boolean;
}

const CareersParent = ({ careers, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCareer(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["careers"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this career?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {careers && careers.length > 0 ? (
        <div className="w-full lg:w-9/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career: careerData) => (
            <CareersCard
              key={career._id}
              id={career._id}
              title={career.title}
              description={career.description}
              employmentType={career.employmentType}
              images={career.images}
              branch={career.branch}
              department={career.department}
              createdAt={career.createdAt}
              status={career.status}
              onDelete={() => {
                handleDelete(career._id);
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
              : deleteMutation.data || "Career deleted successfully"
          }
          action={() => showModal(false)}
        />
      )}
    </>
  );
};

export default CareersParent;
