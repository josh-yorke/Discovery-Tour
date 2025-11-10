import { useNavigate, useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageLoader from "../../../components/loader/PageLoader";
import PageError from "../../../components/error/PageError";
import ImageCard from "../../../components/cards/ImageCard";
import { useState } from "react";
import Modal from "../../../components/modal/Modal";
import { getVisa } from "../../../hooks/visa/visa/getVisa";
import View from "../../../components/visa/visa/view/View";
import { deleteVisa } from "../../../hooks/visa/visa/deleteVisa";

const ViewVisa = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["visas", id],
    queryFn: () => getVisa(id),
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVisa(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["visas"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this visa?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Navbar />
      {isLoading || isError ? (
        isError ? (
          <PageError title="Reload" action={refetch} error={error.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : null
      ) : (
        <>
          <Header title="View Visa" url="/visas/visa" id={data._id} />
          <div className="w-full flex flex-col p-6 gap-6 bg-gray-100">
            <ImageCard
              url={data.images}
              style="h-[30vh] md:h-[60vh] rounded-lg overflow-hidden"
            />
            <View
              country={data.country}
              type={data.type}
              mainDescription={data.mainDescription}
              eligibleApplicants={data.eligibleApplicants}
              images={data.images}
              _id={data._id}
              savedAt={data.savedAt}
              onDelete={() => handleDelete(data._id)}
            />
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
            navigate("/visas/visa");
          }}
        />
      )}
    </>
  );
};

export default ViewVisa;
