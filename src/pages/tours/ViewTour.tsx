import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import Navbar from "../../components/nav/Navbar";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import { getTour } from "../../hooks/tours/getTour";
import View from "../../components/tours/View";
import { deleteTour } from "../../hooks/tours/deleteTour";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import InfiniteImageCarousel from "../../components/cards/InfiniteImageCarousel";

const ViewTour = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["tours", id],
    queryFn: () => getTour(id),
    staleTime: 5 * 60 * 1000,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTour(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({
        queryKey: ["tours"],
        exact: false,
      });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tour?")) {
      deleteMutation.mutate(id);
    }
  };

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
            <div className="relative aspect-5/6 md:aspect-8/3 w-full overflow-hidden">
              <InfiniteImageCarousel images={data.images} />
            </div>
            <div className="w-full lg:w-9/10 flex flex-col p-6 pb-24 gap-6">
              <View
                title={data.title}
                _id={data._id}
                country={data.country}
                typeV2={data.typeV2}
                category={data.category}
                tags={data.tags}
                mainDescription={data.mainDescription}
                images={data.images}
                mainLocationImages={data.mainLocationImages}
                mainLocationName={data.mainLocationName}
                mainLocationDescription={data.mainLocationDescription}
                dateAdded={data.dateAdded}
                countryV2={data.countryV2}
                onDelete={() => handleDelete(data._id)}
              />
            </div>
          </div>
        </>
      )}
      {modal && (
        <Modal
          success={deleteMutation.isError ? false : true}
          message={
            deleteMutation.isError
              ? deleteMutation.error.message
              : deleteMutation.data
          }
          action={() => {
            showModal(false);
            navigate("/rail-passes");
          }}
        />
      )}
    </>
  );
};

export default ViewTour;
