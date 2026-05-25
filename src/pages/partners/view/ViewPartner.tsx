import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { deletePartner, getPartner } from "../../../hooks/partners/partners";
import { useState } from "react";
import Navbar from "../../../components/nav/Navbar";
import SectionError from "../../../components/error/SectionError";
import SectionLoader from "../../../components/loader/SectionLoader";
import ImageCard from "../../../components/cards/ImageCard";
import Modal from "../../../components/modal/Modal";
import View from "../../../components/partners/view/View";

const ViewPartner = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["partners", id],
    queryFn: () => getPartner(id),
    staleTime: 5 * 60 * 1000,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePartner(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({
        queryKey: ["partners"],
        exact: false,
      });
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

  return (
    <>
      <Navbar />
      {isLoading || isError ? (
        isError ? (
          <SectionError action={refetch} error={error.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : null
      ) : (
        <>
          <div className="w-full flex flex-col items-center justify-center bg-black/6">
            <ImageCard url={data.logoImage ? [data.logoImage] : []} style="" />
            <div className="w-full lg:w-9/10 flex flex-col p-6 pb-24 gap-6">
              <View
                _id={data._id}
                partnerName={data.partnerName}
                type={data.type}
                typeV2={data.typeV2}
                websiteUrl={data.websiteUrl}
                image={data.logoImage}
                dateAdded={data.dateAdded}
                onDelete={() => handleDelete(data._id)}
              />
            </div>
          </div>
        </>
      )}
      {modal && (
        <Modal
          success={deleteMutation.isError ? false : true}
          message={
            deleteMutation.isError
              ? deleteMutation.error.message
              : deleteMutation.data
          }
          action={() => {
            showModal(false);
            navigate("/partners");
          }}
        />
      )}
    </>
  );
};

export default ViewPartner;
