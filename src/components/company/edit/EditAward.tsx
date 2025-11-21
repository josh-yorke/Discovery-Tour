import { useEffect, useState } from "react";
import {
  addAwardSchema,
  type addAwardData,
} from "../../../types/company/addCompanyTypes";
import PageLoader from "../../loader/PageLoader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { getDetails } from "../../../hooks/company/getDetails";
import { useNavigate } from "react-router";
import Input from "../../input/Input";
import Button from "../../button/Button";
import { addBranch } from "../../../hooks/company/addBranch";
import AwardImageInput from "../../input/AwardImageInput";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";
import PageError from "../../error/PageError";

const EditAward = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [existingAwards, setExistingAwards] = useState<any[]>([]);
  const [editingAward, setEditingAward] = useState<any>(null);
  const [awardImages, setAwardImages] = useState<File[]>([]);
  const [allAwardsWithFiles, setAllAwardsWithFiles] = useState<
    { awardId: string; files: File[] }[]
  >([]);

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["companyDetails"],
    queryFn: getDetails,
  });

  useEffect(() => {
    if (!companyData?.awards?.length || !id) return;

    setExistingAwards(companyData.awards);

    // Find the award to edit
    const awardToEdit = companyData.awards.find(
      (award: any) => award.id === id || award._id === id
    );

    if (awardToEdit) {
      setEditingAward(awardToEdit);
    }

    const fetchAllAwardFiles = async () => {
      try {
        console.log("Fetching ALL award files...");

        const allAwardsFilesData = await Promise.all(
          companyData.awards.map(async (award: any) => {
            try {
              const files = await fetchImageFiles(award.images || []);

              const validFiles = files.filter(
                (file) =>
                  file &&
                  file.size > 0 &&
                  (file.type.startsWith("image/") ||
                    file.type === "application/pdf")
              );

              console.log(
                `Award ${award.id || award._id}: ${
                  validFiles.length
                } valid files`
              );

              validFiles.forEach((file) => {
                console.log(
                  `  - ${file.name} (${file.type}, ${file.size} bytes)`
                );
              });

              return {
                awardId: award.id || award._id,
                files: validFiles,
              };
            } catch (error) {
              console.error(
                `Error fetching files for award ${award.id}:`,
                error
              );
              return {
                awardId: award.id || award._id,
                files: [],
              };
            }
          })
        );

        setAllAwardsWithFiles(allAwardsFilesData);

        const editingAwardData = allAwardsFilesData.find(
          (item) => item.awardId === id
        );
        if (editingAwardData) {
          setAwardImages(editingAwardData.files);
          console.log("Editing award files:", editingAwardData.files);
        }

        console.log("All awards with files:", allAwardsFilesData);
      } catch (error) {
        console.error("Error in fetchAllAwardFiles:", error);
      }
    };

    fetchAllAwardFiles();
  }, [companyData, id]);

  const methods = useForm<addAwardData>({
    resolver: zodResolver(addAwardSchema),
    defaultValues: {
      name: "",
      about: "",
      mission: "",
      vision: "",
      coreValues: "",
      awards: [{ images: undefined, description: "", date: "" }],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = methods;

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: addBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyDetails"] });
      navigate("/company/awards");
    },
  });

  useEffect(() => {
    if (companyData && editingAward) {
      reset({
        name: companyData.name || "",
        about: companyData.about || "",
        mission: companyData.mission || "",
        vision: companyData.vision || "",
        coreValues: companyData.coreValues || "",
        awards: [
          {
            images: undefined,
            description: editingAward.description || "",
            date: editingAward.date || "",
          },
        ],
      });
    }
  }, [companyData, editingAward, reset]);

  const onSubmit = async (data: addAwardData) => {
    if (!companyData || !editingAward || !id) return;

    const updatedAwards = existingAwards.map((award: any) => {
      const currentAwardId = award.id || award._id;
      if (currentAwardId === id) {
        return {
          date: data.awards[0].date,
          description: data.awards[0].description,
          images: [],
        };
      }

      return {
        date: award.date,
        description: award.description,
        images: award.images || [],
      };
    });

    const formData = new FormData();

    // Append basic company info
    formData.append("name", data.name);
    formData.append("about", data.about);
    formData.append("mission", data.mission);
    formData.append("vision", data.vision);
    formData.append("coreValues", data.coreValues);

    // Append awards data with file tracking info
    const awardsWithFileInfo = updatedAwards.map((award, index) => {
      const originalAward = existingAwards[index];
      const awardId = originalAward.id || originalAward._id;
      const awardFilesData = allAwardsWithFiles.find(
        (item) => item.awardId === awardId
      );

      return {
        ...award,
        _awardId: awardId,
        _fileCount:
          awardId === editingAward.id || awardId === editingAward._id
            ? 0
            : awardFilesData?.files.length || 0,
      };
    });

    formData.append("awards", JSON.stringify(awardsWithFileInfo));

    let totalFilesAppended = 0;

    updatedAwards.forEach((award, index) => {
      console.log(award);
      const originalAward = existingAwards[index];
      const currentAwardId = originalAward.id || originalAward._id;
      const awardFilesData = allAwardsWithFiles.find(
        (item) => item.awardId === currentAwardId
      );

      if (currentAwardId === id) {
        const newAwardFiles = data.awards[0].images;
        if (newAwardFiles) {
          let filesToAppend: File[] = [];

          if (newAwardFiles instanceof FileList) {
            filesToAppend = Array.from(newAwardFiles);
          } else if (newAwardFiles instanceof File) {
            filesToAppend = [newAwardFiles];
          } else if (Array.isArray(newAwardFiles)) {
            filesToAppend = newAwardFiles;
          }

          filesToAppend.forEach((file) => {
            if (file && file.size > 0 && file.type) {
              formData.append("awards", file);
              totalFilesAppended++;
              console.log(
                `Appending NEW file for edited award ${currentAwardId}:`,
                file.name
              );
            }
          });
        }
      } else {
        if (awardFilesData && awardFilesData.files.length > 0) {
          awardFilesData.files.forEach((file) => {
            if (file && file.size > 0 && file.type) {
              formData.append("awards", file);
              totalFilesAppended++;
              console.log(
                `Appending OLD file for award ${currentAwardId}:`,
                file.name
              );
            }
          });
        }
      }
    });

    formData.append("editedAwardId", id);
    formData.append("totalFiles", totalFilesAppended.toString());

    console.log("=== FORM DATA SUMMARY ===");
    console.log("Edited Award ID:", id);
    console.log("Total files appended:", totalFilesAppended);
    console.log(
      "Awards order:",
      updatedAwards.map((a, i) => `${i}: ${a.description}`)
    );

    console.log("FormData contents:");
    let fileCount = 0;
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileCount++;
        console.log(
          `File ${fileCount}: ${value.name} (${value.type}, ${value.size} bytes)`
        );
      } else if (key === "awards" && typeof value === "string") {
        const awardsData = JSON.parse(value);
        console.log(
          "Awards JSON with file info:",
          awardsData.map((a: any) => ({
            description: a.description,
            awardId: a._awardId,
            fileCount: a._fileCount,
          }))
        );
      } else if (key !== "awards") {
        console.log(`${key}:`, value);
      }
    }

    mutation.mutate(formData);
  };

  if (isLoading) return <PageLoader />;

  if (!editingAward) {
    return <PageError error="" action={() => {}} title="" />;
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-2xl flex flex-col items-center justify-center p-6 gap-6"
      >
        <input type="hidden" {...register("name")} />
        <input type="hidden" {...register("about")} />
        <input type="hidden" {...register("mission")} />
        <input type="hidden" {...register("vision")} />
        <input type="hidden" {...register("coreValues")} />

        <Input
          disabled={false}
          title="Award Description"
          placeholder="Award description"
          type="text"
          {...register("awards.0.description")}
          error={errors.awards?.[0]?.description?.message || ""}
        />

        <Input
          disabled={false}
          title="Award Date"
          placeholder="Award date"
          type="date"
          {...register("awards.0.date")}
          error={errors.awards?.[0]?.date?.message || ""}
        />

        <AwardImageInput
          name="awards.0.images"
          title="Award Image"
          register={register}
          setValue={setValue}
          initialFiles={awardImages}
          disabled={false}
          error={
            typeof errors.awards?.[0]?.images?.message === "string"
              ? errors.awards[0].images.message
              : ""
          }
        />

        <Button
          isLoading={mutation.isPending}
          title="Update Award"
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4 w-full"
        />
      </form>
    </FormProvider>
  );
};

export default EditAward;
