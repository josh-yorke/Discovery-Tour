import { useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";
import PageError from "../../../components/error/PageError";
import PageLoader from "../../../components/loader/PageLoader";
import { getBlog } from "../../../hooks/blogs/getBlog";
import EditInputs from "../../../components/blogs/edit/Edit";

const EditBlog = () => {
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["blogs", id],
    queryFn: () => getBlog(id),
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
          <PageError title="Reload" action={refetch} error={error.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : null
      ) : (
        <div className="w-full flex flex-col items-center justify-center bg-gray-100">
          <Header style="p-6" title="Edit Blog" url="/blogs" id={data._id} />
          <EditInputs
            relatedLinks={data.relatedLinks}
            readingTimeUnit={data.readingTimeUnit}
            readingTimeValue={data.readingTimeValue}
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

export default EditBlog;
