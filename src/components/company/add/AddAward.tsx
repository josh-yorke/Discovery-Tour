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

const AddAward = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [existingAwardFiles, setExistingAwardFiles] = useState<File[]>([]);
  const [existingAwards, setExistingAwards] = useState<any[]>([]);

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["companyDetails"],
    queryFn: getDetails,
  });

  useEffect(() => {
    if (!companyData?.awards?.length) return;

    setExistingAwards(companyData.awards);

    const fetchOldImages = async () => {
      try {
        console.log("Fetching old award images:", companyData.awards);

        const allAwardFiles = await Promise.all(
          companyData.awards.map(async (award: any) => {
            const files = await fetchImageFiles(award.images || []);
            return files;
          })
        );

        // Flatten the array of arrays into a single file array
        const flattenedFiles = allAwardFiles.flat();
        setExistingAwardFiles(flattenedFiles);

        console.log("Loaded existing award files:", flattenedFiles);
      } catch (error) {
        console.error("Error fetching old award images:", error);
      }
    };

    fetchOldImages();
  }, [companyData]);

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
    if (companyData) {
      reset({
        name: companyData.name || "",
        about: companyData.about || "",
        mission: companyData.mission || "",
        vision: companyData.vision || "",
        coreValues: companyData.coreValues || "",
        awards: [{ images: undefined, description: "", date: "" }],
      });
    }
  }, [companyData, reset]);

  const onSubmit = async (data: addAwardData) => {
    if (!companyData) return;

    const newAward = {
      date: data.awards[0].date,
      description: data.awards[0].description,
      images: [],
    };

    const updatedAwards = [...existingAwards, newAward];

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("about", data.about);
    formData.append("mission", data.mission);
    formData.append("vision", data.vision);
    formData.append("coreValues", data.coreValues);
    formData.append("awards", JSON.stringify(updatedAwards));

    // Handle files differently - ensure we're getting all files
    const newAwardFiles = data.awards[0].images;

    // Convert to array immediately to ensure we have all files
    let allFiles: File[] = [...existingAwardFiles];

    if (newAwardFiles) {
      let newFiles: File[] = [];

      // Handle both FileList and single File cases
      if (newAwardFiles instanceof FileList) {
        newFiles = Array.from(newAwardFiles);
      } else if (newAwardFiles instanceof File) {
        newFiles = [newAwardFiles];
      } else if (Array.isArray(newAwardFiles)) {
        newFiles = newAwardFiles;
      }

      console.log("New files to add:", newFiles.length);
      allFiles = [...allFiles, ...newFiles];
    }

    // Append all files
    allFiles.forEach((file, index) => {
      console.log(`Appending file ${index}:`, file.name);
      formData.append("awards", file);
    });

    console.log("Total files appended:", allFiles.length);

    mutation.mutate(formData);
  };

  if (isLoading) return <PageLoader />;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center justify-center p-6 gap-6"
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
          initialFiles={[]}
          disabled={false}
          error={
            typeof errors.awards?.[0]?.images?.message === "string"
              ? errors.awards[0].images.message
              : ""
          }
        />

        {/* Display existing awards info */}
        {existingAwards.length > 0 && (
          <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Existing Awards:</h3>
            <p>
              {existingAwards.length} awards with {existingAwardFiles.length}{" "}
              images will be preserved
            </p>
          </div>
        )}

        <Button
          isLoading={mutation.isPending}
          title="Add Award"
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4 w-full"
        />
      </form>
    </FormProvider>
  );
};

export default AddAward;
