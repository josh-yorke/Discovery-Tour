import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import ImageCard from "../../components/cards/ImageCard";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";
import Navbar from "../../components/nav/Navbar";
import {
  deleteInsurance,
  getInsurance,
} from "../../hooks/insurances/insurance";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import View from "../../components/insurances/view/View";

const ViewInsurance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["insurance", id],
    queryFn: () => getInsurance(id),
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInsurance(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({
        queryKey: ["insurances"],
        exact: false,
      });
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

  return (
    <>
      <Navbar />
      {isLoading || isError ? (
        isError ? (
          <SectionError
            action={refetch}
            error={error?.message || "Failed to load insurance"}
          />
        ) : isLoading ? (
          <SectionLoader />
        ) : null
      ) : (
        <>
          <div className="w-full flex flex-col items-center justify-center bg-black/6">
            <ImageCard url={data.images} style="" />
            <div className="w-full lg:w-9/10 flex flex-col p-6 pb-24 gap-6">
              <View
                onDelete={() => handleDelete(data._id)}
                _id={data._id}
                country={data.country}
                insurancePartner={data.insurancePartner}
                countryV2={data.countryV2}
                insurancePartnerV2={data.insurancePartnerV2}
                title={data.title}
                description={data.description}
                images={data.images}
                dateAdded={data.dateAdded}
              />
            </div>
          </div>
        </>
      )}
      {modal && (
        <Modal
          success={!deleteMutation.isError}
          message={
            deleteMutation.isError
              ? deleteMutation.error.message
              : "Insurance policy deleted successfully"
          }
          action={() => {
            showModal(false);
            navigate("/insurance");
          }}
        />
      )}
    </>
  );
};

export default ViewInsurance;
