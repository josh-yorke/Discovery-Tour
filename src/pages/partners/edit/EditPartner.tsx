import { useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import Header from "../../../components/users/Header";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";
import SectionError from "../../../components/error/SectionError";
import SectionLoader from "../../../components/loader/SectionLoader";
import { getPartner } from "../../../hooks/partners/partners";
import Edit from "../../../components/partners/edit/Edit";

const EditPartner = () => {
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["partners", id],
    queryFn: () => getPartner(id),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const getImages = async () => {
      if (data?.logoImage) {
        const image = await fetchImageFiles([data.logoImage]);
        setImages(image);
      }
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
            title="Edit Partner"
            url="/partners"
            id={data._id}
          />
          <Edit
            id={data._id}
            image={images}
            type={data.type}
            websiteUrl={data.websiteUrl}
            partnerName={data.partnerName}
          />
        </div>
      )}
    </>
  );
};

export default EditPartner;
