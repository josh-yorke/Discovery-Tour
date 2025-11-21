import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { newsData } from "../../types/news/newsDataTypes";
import PageLoader from "../loader/PageLoader";
import { useState } from "react";
import NewsCard from "../cards/NewsCard";
import { deleteNews } from "../../hooks/news/deleteNews";
import Modal from "../modal/Modal";

interface ParentProps {
  news: newsData[];
  isLoading: boolean;
}

const NewsParent = ({ news, isLoading }: ParentProps) => {
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

  if (isLoading) return <PageLoader />;

  return (
    <>
      {news && news.length > 0 ? (
        <div className="w-full lg:w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((news: newsData) => (
            <NewsCard
              key={news._id}
              images={news.images}
              id={news._id}
              title={news.title}
              tags={news.tags}
              contents={news.contents}
              status={news.status}
              onDelete={() => {
                handleDelete(news._id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="h-[60vh] flex items-center justify-center">
          <p className="text-sm font-normal">No Results Found</p>
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
          action={() => showModal(false)}
        />
      )}
    </>
  );
};

export default NewsParent;
