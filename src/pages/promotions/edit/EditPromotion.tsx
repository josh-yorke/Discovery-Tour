import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getPromotion } from "../../../hooks/promotions/getPromotion";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";
import Navbar from "../../../components/nav/Navbar";
import PageError from "../../../components/error/PageError";
import PageLoader from "../../../components/loader/PageLoader";
import Header from "../../../components/users/Header";
import Edit from "../../../components/promotions/edit/Edit";

const EditPromotion = () => {
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPromotion(id),
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
        <>
          <Header title="Edit Promotion" url="/promotions" id={data._id} />
          <Edit
            status={data.status}
            id={data._id}
            images={images}
            title={data.title}
            contents={data.contents}
            tags={data.tags}
          />
        </>
      )}
    </>
  );
};

export default EditPromotion;
