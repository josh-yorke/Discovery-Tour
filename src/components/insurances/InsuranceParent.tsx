import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "../modal/Modal";
import SectionLoader from "../loader/SectionLoader";
import { deleteInsurance } from "../../hooks/insurances/insurance";
import InsuranceCard from "../cards/InsuranceCard";
import type { insuranceData } from "../../types/insurances/insuranceDataTypes";

interface ParentProps {
  insurances: insuranceData[];
  isLoading: boolean;
}

const InsuranceParent = ({ insurances, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInsurance(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["insurances"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this insurance policy?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <SectionLoader />;

  return (
    <>
      {insurances && insurances.length > 0 ? (
        <div className="w-full lg:w-9/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insurances.map((insurance: insuranceData) => (
            <InsuranceCard
              key={insurance._id}
              id={insurance._id}
              title={insurance.title}
              description={insurance.description}
              images={insurance.images}
              country={insurance.countryV2?.country || insurance.country}
              insurancePartner={
                insurance.insurancePartnerV2 || insurance.insurancePartner
              }
              dateAdded={insurance.dateAdded}
              onDelete={() => {
                handleDelete(insurance._id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="h-[60vh] flex items-center justify-center">
          <p className="text-sm font-normal">No Insurance Policies Found</p>
        </div>
      )}
      {modal && (
        <Modal
          success={!deleteMutation.isError}
          message={
            deleteMutation.isError
              ? deleteMutation.error.message
              : "Insurance policy deleted successfully"
          }
          action={() => showModal(false)}
        />
      )}
    </>
  );
};

export default InsuranceParent;
