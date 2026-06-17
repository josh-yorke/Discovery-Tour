import { useNavigate, useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOneNews } from "../../../hooks/news/getOneNews";
import View from "../../../components/news/view/View";
import { useState } from "react";
import { deleteNews } from "../../../hooks/news/deleteNews";
import Modal from "../../../components/modal/Modal";
import SectionError from "../../../components/error/SectionError";
import SectionLoader from "../../../components/loader/SectionLoader";
import InfiniteImageCarousel from "../../../components/cards/InfiniteImageCarousel";

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
          <div className="relative aspect-5/6 md:aspect-8/3 w-full overflow-hidden">
            <InfiniteImageCarousel images={data.images} />
          </div>
          <div className="w-full lg:w-9/10 flex flex-col p-6 gap-6 bg-gray-100">
            <View
              relatedLinks={data.relatedLinks}
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
            navigate(-1);
          }}
        />
      )}
    </>
  );
};

export default ViewNews;
