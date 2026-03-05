import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deleteCareer, getCareer } from "../../hooks/careers/careers";
import Navbar from "../../components/nav/Navbar";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import ImageCard from "../../components/cards/ImageCard";
import PageHeader from "../../components/users/PageHeader";
import Modal from "../../components/modal/Modal";
import View from "../../components/careers/view/View";

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
          <PageHeader
            style="p-6"
            title="View Career"
            url="/careers"
            id={data._id}
          />
          <div className="w-full lg:w-7xl flex flex-col p-6 gap-6">
            {data.images && data.images.length > 0 && (
              <ImageCard
                url={data.images}
                style="aspect-3/2 rounded-3xl overflow-hidden"
              />
            )}
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
