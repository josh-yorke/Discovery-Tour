import { useNavigate, useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOneNews } from "../../../hooks/news/getOneNews";
import PageLoader from "../../../components/loader/PageLoader";
import PageError from "../../../components/error/PageError";
import ImageCard from "../../../components/cards/ImageCard";
import View from "../../../components/news/view/View";
import { useState } from "react";
import { deleteNews } from "../../../hooks/news/deleteNews";
import Modal from "../../../components/modal/Modal";

const ViewNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["news", id],
    queryFn: () => getOneNews(id),
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNews(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["news"], exact: false });
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
          <PageError title="Reload" action={refetch} error={error.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : null
      ) : (
        <>
          <Header title="View News" url="/news" id={data._id} />
          <div className="w-full flex flex-col p-6 gap-6">
            <ImageCard
              url={data.images}
              style="h-[30vh] md:h-[60vh] rounded-lg overflow-hidden"
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
            navigate("/news");
          }}
        />
      )}
    </>
  );
};

export default ViewNews;
