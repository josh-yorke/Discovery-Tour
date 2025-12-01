import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPromotion } from "../../../hooks/promotions/getPromotion";
import { useNavigate, useParams } from "react-router";
import { deletePromotion } from "../../../hooks/promotions/deletePromotion";
import Modal from "../../../components/modal/Modal";
import ImageCard from "../../../components/cards/ImageCard";
import Navbar from "../../../components/nav/Navbar";
import View from "../../../components/promotions/view/View";
import PageHeader from "../../../components/users/PageHeader";
import SectionLoader from "../../../components/loader/SectionLoader";
import SectionError from "../../../components/error/SectionError";

const ViewPromotion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["news", id],
    queryFn: () => getPromotion(id),
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["promotions"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this news?")) {
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
        <div className="w-full flex flex-col items-center justify-center bg-gray-100">
          <PageHeader
            style="py-6"
            title="View Promotion"
            url="/promotions"
            id={data._id}
          />
          <div className="w-full lg:w-7xl flex flex-col py-6 gap-6">
            <ImageCard
              url={data.images}
              style="aspect-3/2 rounded-lg overflow-hidden"
            />
            <View
              onDelete={() => handleDelete(data._id)}
              title={data.title}
              status={data.status}
              contents={data.contents}
              tags={data.tags}
              savedAt={data.savedAt}
              _id={data._id}
              images={[]}
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
            navigate("/news");
          }}
        />
      )}
    </>
  );
};

export default ViewPromotion;
