import { useQuery } from "@tanstack/react-query";
import Edit from "../../../components/company/edit/Edit";
import Navbar from "../../../components/nav/Navbar";
import { getDetails } from "../../../hooks/company/getDetails";
import PageError from "../../../components/error/PageError";
import PageLoader from "../../../components/loader/PageLoader";
import { useEffect, useState } from "react";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";
import Header from "../../../components/users/Header";

const EditCompany = () => {
  const [carousel, setCarousel] = useState<File[]>([]);
  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["company"],
    queryFn: () => getDetails(),
    enabled: true,
  });

  useEffect(() => {
    console.log(carousel);
    const getCarousel = async () => {
      const image = await fetchImageFiles(data?.carousel);

      setCarousel(image);
    };

    getCarousel();
  }, [data]);

  return (
    <>
      <Navbar />
      <div className="w-full flex flex-col items-center justify-start bg-gray-100 min-h-svh">
        {isError ? (
          <PageError action={refetch} title="Reload" error={error?.message} />
        ) : isLoading ? (
          <PageLoader />
        ) : (
          data && (
            <>
              <Header
                style="p-6"
                url="/company/details"
                title="Edit Company Details"
                id="EXISTING"
              />
              <Edit
                name={data.name}
                tagline={data.tagline}
                about={data.about}
                mission={data.mission}
                vision={data.vision}
                coreValues={data.coreValues}
              />
            </>
          )
        )}
      </div>
    </>
  );
};

export default EditCompany;
