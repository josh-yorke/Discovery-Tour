import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { companyAwards } from "../../../types/company/companyDataTypes";
import { useState, useEffect } from "react";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";
import { addBranch } from "../../../hooks/company/addBranch";
import AwardCard from "../../cards/AwardCard";
import Modal from "../../modal/Modal";
import { getDetails } from "../../../hooks/company/getDetails";

interface ViewAwardsProps {
  awards: companyAwards["awards"];
}

const ViewAwards = ({ awards }: ViewAwardsProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);

  const { data: companyDetails } = useQuery({
    queryKey: ["companyDetails"],
    queryFn: getDetails,
  });

  useEffect(() => {
    if (companyDetails) {
      setCompanyData(companyDetails);
    }
  }, [companyDetails]);

  const deleteMutation = useMutation({
    mutationFn: async (awardId: string) => {
      if (!companyData) throw new Error("Company data not found");

      const updatedAwards = awards.filter((award) => award._id !== awardId);

      const allFiles = await Promise.all(
        updatedAwards.map(async (award) => {
          const files = await fetchImageFiles(award.images || []);
          return files;
        }),
      );

      const formData = new FormData();
      formData.append("name", companyData.name || "");
      formData.append("about", companyData.about || "");
      formData.append("mission", companyData.mission || "");
      formData.append("vision", companyData.vision || "");
      formData.append("coreValues", companyData.coreValues || "");
      formData.append("awards", JSON.stringify(updatedAwards));

      allFiles.flat().forEach((file) => {
        formData.append("awards", file);
      });

      return addBranch(formData);
    },
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["companyDetails"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this award?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!awards || awards.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-sm font-normal">No Awards Found</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full lg:w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {awards.map((award) => (
          <AwardCard
            key={award._id}
            id={award._id}
            url={award.images}
            description={award.description}
            style="aspect-[3/2] w-full rounded-lg"
            date={award.date}
            action={() => handleDelete(award._id)}
          />
        ))}
      </div>

      {modal && (
        <Modal
          success={!deleteMutation.isError}
          message={
            deleteMutation.isError
              ? deleteMutation.error.message
              : "Award deleted successfully"
          }
          action={() => showModal(false)}
        />
      )}
    </>
  );
};

export default ViewAwards;
