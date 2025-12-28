import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchImageFiles } from "../../utils/fetchImageFiles";
import { getTour } from "../../hooks/tours/getTour";
import Navbar from "../../components/nav/Navbar";
import PageError from "../../components/error/PageError";
import PageLoader from "../../components/loader/PageLoader";
import Header from "../../components/users/Header";
import Edit from "../../components/tours/Edit";

const EditTour = () => {
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);
  const [locationImages, setLocationImages] = useState<File[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["tours", id],
    queryFn: () => getTour(id),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    console.log(data?.images);
    const getImages = async () => {
      const image = await fetchImageFiles(data?.images);
      const locationImage = await fetchImageFiles(data?.mainLocationImages);

      setImages(image);
      setLocationImages(locationImage);
    };
    console.log(data?.typeV2);
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
          <Header
            style="px-6 lg:px-0 py-6"
            title="Edit Tour"
            url="/tours"
            id={data._id}
          />
          <Edit
            id={data._id}
            mainDescription={data.mainDescription}
            images={images}
            mainLocationImages={locationImages}
            country={data.country}
            type={data?.typeV2._id}
            tags={data.tags}
            category={data.category}
            mainLocationName={data.mainLocationName}
            mainLocationDescription={data.mainLocationDescription}
          />
        </div>
      )}
    </>
  );
};

export default EditTour;
