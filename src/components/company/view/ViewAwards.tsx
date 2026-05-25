import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";
import { addBranch } from "../../../hooks/company/addBranch";
import AwardCard from "../../cards/AwardCard";
import Modal from "../../modal/Modal";
import { getAllAwards, getDetails } from "../../../hooks/company/getDetails";
import { type Award } from "../../../hooks/company/getAwards";

interface CompanyData {
  name: string;
  about: string;
  mission: string;
  vision: string;
  coreValues: string;
}

interface ViewAwardsProps {
  awards: Award[];
  refetchAwards: () => void;
}

const ViewAwards = ({ awards, refetchAwards }: ViewAwardsProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { data: companyData } = useQuery<CompanyData>({
    queryKey: ["companyDetails"],
    queryFn: getDetails,
  });

  const { data: allAwards, refetch: refetchAllAwards } = useQuery<Award[]>({
    queryKey: ["allAwards"],
    queryFn: getAllAwards,
  });

  const deleteMutation = useMutation({
    mutationFn: async (awardId: string) => {
      if (!companyData || !allAwards) {
        throw new Error("Required data not found");
      }

      const remainingAwards = allAwards.filter(
        (award: Award) => award._id !== awardId,
      );
      const formattedAwards = remainingAwards.map((award: Award) => ({
        date: award.date?.split("T")[0] || award.date,
        description: award.description,
      }));

      const allFiles = await Promise.all(
        remainingAwards.map((award: Award) =>
          fetchImageFiles(award.images || []),
        ),
      );

      const formData = new FormData();
      const fields = [
        "name",
        "about",
        "mission",
        "vision",
        "coreValues",
      ] as const;
      fields.forEach((field) => {
        formData.append(field, companyData[field] || "");
      });
      formData.append("awards", JSON.stringify(formattedAwards));
      allFiles.flat().forEach((file: File) => formData.append("awards", file));

      return addBranch(formData);
    },
    onSuccess: () => {
      setIsSuccess(true);
      setModalMessage("Award deleted successfully");
      showModal(true);

      const queries = ["companyDetails", "awards", "allAwards"];
      queries.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      );

      setTimeout(() => {
        refetchAwards();
        refetchAllAwards();
        window.location.reload();
      }, 1500);
    },
    onError: (error: Error) => {
      setIsSuccess(false);
      setModalMessage(error.message || "Failed to delete award");
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this award?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!awards?.length) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-sm font-normal">No Awards Found</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full lg:w-9/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards.map((award: Award) => (
          <AwardCard
            key={award._id}
            id={award._id}
            url={award.images}
            description={award.description}
            style="aspect-[3/2] w-full rounded-lg"
            date={new Date(award.date).toLocaleDateString()}
            action={() => handleDelete(award._id)}
          />
        ))}
      </div>

      {modal && (
        <Modal
          success={isSuccess}
          message={modalMessage}
          action={() => showModal(false)}
        />
      )}
    </>
  );
};

export default ViewAwards;
