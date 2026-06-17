import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deleteCareer, getCareer } from "../../hooks/careers/careers";
import Navbar from "../../components/nav/Navbar";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import Modal from "../../components/modal/Modal";
import View from "../../components/careers/view/View";
import InfiniteImageCarousel from "../../components/cards/InfiniteImageCarousel";

const ViewCareer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["career", id],
    queryFn: () => getCareer(id),
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCareer(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["careers"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this career?")) {
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
        <div className="w-full flex flex-col items-center justify-center bg-gray-100">
          <div className="relative aspect-5/6 md:aspect-8/3 w-full overflow-hidden">
            <InfiniteImageCarousel images={data.images} />
          </div>
          <div className="w-full lg:w-9/10 flex flex-col p-6 gap-6">
            <View
              onDelete={() => handleDelete(data._id)}
              title={data.title}
              description={data.description}
              status={data.status}
              employmentType={data.employmentType}
              department={data.department}
              branch={data.branch}
              savedAt={data.createdAt || data.updatedAt}
              _id={data._id}
            />
          </div>
        </div>
      )}
      {modal && (
        <Modal
          success={!deleteMutation.isError}
          message={
            deleteMutation.isError
              ? deleteMutation.error?.message || "Error deleting career"
              : "Career deleted successfully"
          }
          action={() => {
            showModal(false);
            navigate("/careers");
          }}
        />
      )}
    </>
  );
};

export default ViewCareer;
