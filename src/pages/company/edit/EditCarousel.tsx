import Header from "../../../components/users/Header";
import PageError from "../../../components/error/PageError";
import PageLoader from "../../../components/loader/PageLoader";
import Navbar from "../../../components/nav/Navbar";
import { useQuery } from "@tanstack/react-query";
import { getDetails } from "../../../hooks/company/getDetails";
import { useParams } from "react-router";
import EditSlider from "../../../components/company/edit/EditSlider";
import { useEffect, useState } from "react";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";

const EditCarousel = () => {
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["company"],
    queryFn: () => getDetails(),
    enabled: true,
  });

  useEffect(() => {
    console.log(images);
    const getImages = async () => {
      const image = await fetchImageFiles(data?.carousel);

      setImages(image);
    };

    getImages();
  }, [data]);

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-[100svh]">
        {isError ? (
          <PageError action={refetch} title="Reload" error={error?.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : (
          data && (
            <>
              <Header
                url="/company/carousel"
                title="Manage Carousel"
                id={id ? id : ""}
              />
              <EditSlider
                name={data.name}
                mission={data.mission}
                vision={data.vision}
                coreValues={data.coreValues}
                about={data.about}
                carousel={images}
              />
            </>
          )
        )}
      </div>
    </>
  );
};

export default EditCarousel;
