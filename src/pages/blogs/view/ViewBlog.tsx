import { useNavigate, useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "../../../components/modal/Modal";
import SectionError from "../../../components/error/SectionError";
import SectionLoader from "../../../components/loader/SectionLoader";
import { deleteBlog } from "../../../hooks/blogs/deleteBlog";
import { getBlog } from "../../../hooks/blogs/getBlog";
import View from "../../../components/blogs/view/View";
import InfiniteImageCarousel from "../../../components/cards/InfiniteImageCarousel";

const ViewBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["blogs", id],
    queryFn: () => getBlog(id),
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["blogs"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
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
              onDelete={() => handleDelete(data._id)}
              title={data.title}
              status={data.status}
              contents={data.contents}
              tags={data.tags}
              savedAt={data.savedAt}
              _id={data._id}
              images={[]}
              readingTimeUnit={data.readingTimeUnit}
              readingTimeValue={data.readingTimeValue}
              relatedLinks={data.relatedLinks}
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

export default ViewBlog;
