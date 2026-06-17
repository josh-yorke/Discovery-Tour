import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import SectionLoader from "../../components/loader/SectionLoader";
import SectionError from "../../components/error/SectionError";
import Navbar from "../../components/nav/Navbar";
import View from "../../components/rail-pass/view/View";
import { deleteRailPass, getRailPass } from "../../hooks/rail-pass/railPass";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import InfiniteImageCarousel from "../../components/cards/InfiniteImageCarousel";

const ViewRailPass = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["railPass", id],
    queryFn: () => getRailPass(id),
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRailPass(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({
        queryKey: ["railPass"],
        exact: false,
      });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this pass?")) {
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
                onDelete={() => handleDelete(data._id)}
                _id={data._id}
                country={data.country}
                typeV2={data.typeV2}
                category={data.category}
                title={data.title}
                description={data.description}
                images={data.images}
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

export default ViewRailPass;
