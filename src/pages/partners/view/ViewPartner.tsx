import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import SectionError from "../../../components/error/SectionError";
import SectionLoader from "../../../components/loader/SectionLoader";
import ImageCard from "../../../components/cards/ImageCard";
import View from "../../../components/partners/view/View";
import { getPartner } from "../../../hooks/partners/partners";

const ViewPartner = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["partners", id],
    queryFn: () => getPartner(id),
    staleTime: 5 * 60 * 1000,
  });

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
        <>
          <div className="w-full flex flex-col items-center justify-center bg-black/6">
            <ImageCard
              tags={false}
              url={data.logoImage ? [data.logoImage] : []}
              style="h-[50vh] md:h-[70vh]"
            />
            <div className="w-full lg:w-7xl flex flex-col p-6 pb-24 gap-6">
              <View
                onDelete={() => {}}
                _id={data._id}
                partnerName={data.partnerName}
                type={data.type}
                typeV2={data.typeV2}
                websiteUrl={data.websiteUrl}
                dateAdded={data.dateAdded}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ViewPartner;
