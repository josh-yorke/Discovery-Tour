import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchImageFiles } from "../../utils/fetchImageFiles";
import Navbar from "../../components/nav/Navbar";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import Header from "../../components/users/Header";
import { getTransport } from "../../hooks/transportation/transportation";
import Edit from "../../components/transportation/Edit";

const EditTransportation = () => {
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);
  const [isDataReady, setIsDataReady] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["transports", id],
    queryFn: () => getTransport(id),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      const getImages = async () => {
        const image = await fetchImageFiles(data?.images);
        setImages(image);
        setIsDataReady(true);
      };

      getImages();
    }
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
            title="Edit Transportation"
            url="/transport/transportation"
            id={data._id}
          />
          {isDataReady && (
            <Edit
              id={data._id}
              country={data.country}
              type={data.type}
              description={data.description}
              title={data.title}
              images={images}
            />
          )}
        </div>
      )}
    </>
  );
};

export default EditTransportation;
