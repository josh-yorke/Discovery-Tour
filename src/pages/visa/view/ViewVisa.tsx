import { useNavigate, useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ImageCard from "../../../components/cards/ImageCard";
import { useState } from "react";
import Modal from "../../../components/modal/Modal";
import { getVisa } from "../../../hooks/visa/visa/getVisa";
import View from "../../../components/visa/visa/view/View";
import { deleteVisa } from "../../../hooks/visa/visa/deleteVisa";
import PageHeader from "../../../components/users/PageHeader";
import SectionError from "../../../components/error/SectionError";
import SectionLoader from "../../../components/loader/SectionLoader";

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
          <SectionError action={refetch} error={error.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : null
      ) : (
        <div className="w-full flex flex-col items-center justify-center bg-gray-100 px-6">
          <PageHeader style="py-6" title="View Visa" id={data._id} />
          <div className="w-full lg:w-9/10 flex flex-col py-6 gap-6 bg-gray-100">
            <ImageCard url={data.images} style="rounded-3xl" />
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
