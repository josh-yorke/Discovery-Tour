import { useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOneNews } from "../../../hooks/news/getOneNews";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";
import Edit from "../../../components/news/edit/Edit";
import SectionError from "../../../components/error/SectionError";
import SectionLoader from "../../../components/loader/SectionLoader";

const EditNews = () => {
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["news", id],
    queryFn: () => getOneNews(id),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    console.log(images);
    const getImages = async () => {
      const image = await fetchImageFiles(data?.images);

      setImages(image);
    };

    getImages();
  }, [data]);

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
          <Header
            style="px-6 lg:px-0 py-6"
            title="Edit Happening"
            url="/news"
            id={data._id}
          />
          <Edit
            relatedLinks={data.relatedLinks}
            status={data.status}
            id={data._id}
            images={images}
            title={data.title}
            contents={data.contents}
            tags={data.tags}
          />
        </div>
      )}
    </>
  );
};

export default EditNews;
