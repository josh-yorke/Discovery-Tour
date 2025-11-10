import { useState } from "react";
import type { companyAwards } from "../../../types/company/companyDataTypes";
import AwardCard from "../../cards/AwardCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addBranch } from "../../../hooks/company/addBranch";
import { useNavigate } from "react-router";
import { getDetails } from "../../../hooks/company/getDetails";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";
import Modal from "../../modal/Modal";

const ViewAwards = ({ awards }: companyAwards) => {
  const [modal, showModal] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["company"],
    queryFn: () => getDetails(),
    enabled: true,
  });

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: addBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"] });
      navigate("/company/awards");
      showModal(true);
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDeleteAward = async (awardId: string) => {
    if (!data) return;

    const updatedAwards = data.awards.filter((award: any) => {
      const currentAwardId = award.id || award._id;
      return currentAwardId !== awardId;
    });

    const allFiles = await Promise.all(
      updatedAwards.map(async (award: any) => {
        const files = await fetchImageFiles(award.images || []);
        return files;
      })
    );

    const flattenedFiles = allFiles.flat();

    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("about", data.about || "");
    formData.append("mission", data.mission || "");
    formData.append("vision", data.vision || "");
    formData.append("coreValues", data.coreValues || "");
    formData.append("awards", JSON.stringify(updatedAwards));

    flattenedFiles.forEach((file) => {
      formData.append("awards", file);
    });

    console.log("Deleted award with ID:", awardId);
    console.log("Remaining awards:", updatedAwards.length);
    console.log("Total files appended:", flattenedFiles.length);

    mutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this award?")) {
      handleDeleteAward(id);
    }
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {awards.map((award) => (
          <AwardCard
            action={() => handleDelete(award._id)}
            id={award._id}
            key={award._id}
            url={award.images}
            description={award.description}
            style="h-[40vh] w-full rounded-lg"
            date={award.date}
          />
        ))}
      </div>
      {modal && (
        <Modal
          success={mutation.isError ? false : true}
          message={
            mutation.isError
              ? mutation.error.message
              : "Award successfully deleted!"
          }
          action={() => showModal(false)}
        />
      )}
    </>
  );
};

export default ViewAwards;
