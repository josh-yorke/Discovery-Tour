import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import Navbar from "../../components/nav/Navbar";
import {
  deleteTransport,
  getTransport,
} from "../../hooks/transportation/transportation";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import ImageCard from "../../components/cards/ImageCard";
import View from "../../components/transportation/View";
import { useState } from "react";
import Modal from "../../components/modal/Modal";

const ViewTransportation = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["transports", id],
    queryFn: () => getTransport(id),
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTransport(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({
        queryKey: ["transports"],
        exact: false,
      });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transportation?")) {
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
            <ImageCard url={data.images} style="" />
            <div className="w-full lg:w-9/10 flex flex-col p-6 pb-24 gap-6">
              <View
                transportData={data}
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
            navigate("/rail-passes");
          }}
        />
      )}
    </>
  );
};

export default ViewTransportation;
