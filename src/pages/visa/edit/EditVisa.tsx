import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getVisa } from "../../../hooks/visa/visa/getVisa";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";
import Navbar from "../../../components/nav/Navbar";
import PageError from "../../../components/error/PageError";
import PageLoader from "../../../components/loader/PageLoader";
import Header from "../../../components/users/Header";
import Edit from "../../../components/visa/visa/edit/Edit";

const EditVisa = () => {
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["visas", id],
    queryFn: () => getVisa(id),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    console.log(data?.images);
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
          <Header
            style="py-6"
            title="Edit Visa"
            url="/visas/visa"
            id={data._id}
          />
          <Edit
            type={data.type}
            country={data.country}
            mainDescription={data.mainDescription}
            eligibleApplicants={data.eligibleApplicants}
            images={images}
            id={data._id}
          />
        </div>
      )}
    </>
  );
};

export default EditVisa;
