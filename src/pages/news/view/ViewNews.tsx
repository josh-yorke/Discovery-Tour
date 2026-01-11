import { useNavigate, useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOneNews } from "../../../hooks/news/getOneNews";
import ImageCard from "../../../components/cards/ImageCard";
import View from "../../../components/news/view/View";
import { useState } from "react";
import { deleteNews } from "../../../hooks/news/deleteNews";
import Modal from "../../../components/modal/Modal";
import PageHeader from "../../../components/users/PageHeader";
import SectionError from "../../../components/error/SectionError";
import SectionLoader from "../../../components/loader/SectionLoader";

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
          <SectionError action={refetch} error={error.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : null
      ) : (
        <div className="w-full flex flex-col items-center justify-center bg-gray-100">
          <PageHeader style="p-6" title="View News" url="/news" id={data._id} />
          <div className="w-full lg:w-7xl flex flex-col p-6 gap-6 bg-gray-100">
            <ImageCard
              url={data.images}
              style="aspect-3/2 rounded-3xl overflow-hidden"
            />
            <View
              slug={data.slug}
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

export default ViewNews;
