import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchImageFiles } from "../../utils/fetchImageFiles";
import Navbar from "../../components/nav/Navbar";
import Header from "../../components/users/Header";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import { getCareer } from "../../hooks/careers/careers";
import Edit from "../../components/careers/edit/Edit";

const EditCareer = () => {
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["careers", id],
    queryFn: () => getCareer(id),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    console.log(data?.images);
    const getImages = async () => {
      const image = await fetchImageFiles(data?.images);

      setImages(image);
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
            title="Edit Career"
            url="/careers"
            id={data._id}
          />
          <Edit
            id={data._id}
            title={data.title}
            description={data.description}
            status={data.status}
            employmentType={data.employmentType}
            images={images}
            department={data.department}
            branch={data.branch}
          />
        </div>
      )}
    </>
  );
};

export default EditCareer;
