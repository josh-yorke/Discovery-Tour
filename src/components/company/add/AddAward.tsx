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
import Input from "../../input/Input";
import Button from "../../button/Button";
import { addBranch } from "../../../hooks/company/addBranch";
import AwardImageInput from "../../input/AwardImageInput";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";

interface CompanyData {
  name: string;
  about: string;
  mission: string;
  vision: string;
  coreValues: string;
  awards?: Array<{
    date: string;
    description: string;
    images: string[];
  }>;
}

const AddAward = () => {
  const queryClient = useQueryClient();
  const [existingAwardFiles, setExistingAwardFiles] = useState<File[]>([]);
  const [existingAwards, setExistingAwards] = useState<any[]>([]);

  const { data: companyData, isLoading } = useQuery<CompanyData>({
    queryKey: ["companyDetails"],
    queryFn: getDetails,
  });

  useEffect(() => {
    if (!companyData?.awards?.length) return;

    setExistingAwards(companyData.awards);

    const fetchOldImages = async () => {
      try {
        const allAwardFiles = await Promise.all(
          companyData.awards!.map(async (award) => {
            const files = await fetchImageFiles(award.images || []);
            return files;
          }),
        );
        setExistingAwardFiles(allAwardFiles.flat());
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

  const mutation = useMutation({
    mutationFn: addBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyDetails"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      // Refresh the whole page
      window.location.href = "/company/awards";
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
    };

    const updatedAwards = [...existingAwards, newAward];
    const formData = new FormData();

    formData.append("name", data.name || "");
    formData.append("about", data.about || "");
    formData.append("mission", data.mission || "");
    formData.append("vision", data.vision || "");
    formData.append("coreValues", data.coreValues || "");
    formData.append("awards", JSON.stringify(updatedAwards));

    const newAwardFiles = data.awards[0].images;
    let allFiles: File[] = [...existingAwardFiles];

    if (newAwardFiles) {
      let newFiles: File[] = [];
      if (newAwardFiles instanceof FileList) {
        newFiles = Array.from(newAwardFiles);
      } else if (newAwardFiles instanceof File) {
        newFiles = [newAwardFiles];
      } else if (Array.isArray(newAwardFiles)) {
        newFiles = newAwardFiles;
      }
      allFiles = [...allFiles, ...newFiles];
    }

    allFiles.forEach((file: File) => {
      formData.append("awards", file);
    });

    mutation.mutate(formData);
  };

  if (isLoading) return <PageLoader />;

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
          style="bg-white"
          disabled={false}
          title="Award Description"
          placeholder="Award description"
          type="text"
          {...register("awards.0.description")}
          error={errors.awards?.[0]?.description?.message || ""}
        />

        <Input
          style="bg-white"
          disabled={false}
          title="Award Date"
          placeholder="Award date"
          type="date"
          max={new Date().toISOString().split("T")[0]}
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
