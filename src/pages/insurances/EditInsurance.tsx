import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchImageFiles } from "../../utils/fetchImageFiles";
import Navbar from "../../components/nav/Navbar";
import Header from "../../components/users/Header";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import { getInsurance } from "../../hooks/insurances/insurance";
import Edit from "../../components/insurances/Edit";

const EditInsurance = () => {
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["insurances", id],
    queryFn: () => getInsurance(id),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    console.log("Insurance data:", data);

    const getImages = async () => {
      if (data?.images && data.images.length > 0) {
        const imageFiles = await fetchImageFiles(data.images);
        setImages(imageFiles);
      }
    };

    getImages();
  }, [data]);

  return (
    <>
      <Navbar />

      {isLoading || isError ? (
        isError ? (
          <SectionError
            action={refetch}
            error={error?.message || "Failed to load insurance"}
          />
        ) : isLoading ? (
          <SectionLoader />
        ) : null
      ) : (
        <div className="w-full flex flex-col items-center justify-center bg-gray-100">
          <Header
            style="px-6 lg:px-0 py-6"
            title="Edit Insurance Policy"
            url="/insurance"
            id={data._id}
          />
          <Edit
            id={data._id}
            title={data.title}
            description={data.description}
            images={images}
            country={data.country}
            insurancePartner={data.insurancePartner}
            countryV2={data.countryV2}
            insurancePartnerV2={data.insurancePartnerV2}
          />
        </div>
      )}
    </>
  );
};

export default EditInsurance;
