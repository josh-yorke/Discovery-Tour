import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchImageFiles } from "../../utils/fetchImageFiles";
import { getTour } from "../../hooks/tours/getTour";
import Navbar from "../../components/nav/Navbar";
import Header from "../../components/users/Header";
import Edit from "../../components/tours/Edit";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";

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
          <SectionError action={refetch} error={error.message} />
        ) : isLoading ? (
          <SectionLoader />
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
            title={data.title}
            id={data._id}
            mainDescription={data.mainDescription}
            images={images}
            mainLocationImages={locationImages}
            country={data.country}
            type={data?.typeV2._id}
            tags={data.tags}
            mainLocationName={data.mainLocationName}
            mainLocationDescription={data.mainLocationDescription}
          />
        </div>
      )}
    </>
  );
};

export default EditTour;
