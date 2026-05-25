import { useEffect, useState } from "react";
import {
  addAwardSchema,
  type addAwardData,
} from "../../../types/company/addCompanyTypes";
import PageLoader from "../../loader/PageLoader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { getDetails, getAllAwards } from "../../../hooks/company/getDetails";
import { useNavigate } from "react-router";
import Input from "../../input/Input";
import Button from "../../button/Button";
import { addBranch } from "../../../hooks/company/addBranch";
import AwardImageInput from "../../input/AwardImageInput";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";
import PageError from "../../error/PageError";
import type { Award } from "../../../hooks/company/getAwards";

interface CompanyData {
  name: string;
  about: string;
  mission: string;
  vision: string;
  coreValues: string;
}

const EditAward = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [awardImages, setAwardImages] = useState<File[]>([]);

  const { data: companyData, isLoading: isCompanyLoading } =
    useQuery<CompanyData>({
      queryKey: ["companyDetails"],
      queryFn: getDetails,
    });

  const { data: allAwards, isLoading: isAwardsLoading } = useQuery<Award[]>({
    queryKey: ["allAwards"],
    queryFn: getAllAwards,
  });

  useEffect(() => {
    if (!allAwards?.length || !id) return;

    const awardToEdit = allAwards.find((award: Award) => award._id === id);
    if (awardToEdit) {
      setEditingAward(awardToEdit);

      const fetchAwardImages = async () => {
        const files = await fetchImageFiles(awardToEdit.images || []);
        setAwardImages(files);
      };
      fetchAwardImages();
    }
  }, [allAwards, id]);

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
      queryClient.invalidateQueries({ queryKey: ["allAwards"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      navigate("/company/awards");
      window.location.reload();
    },
  });

  useEffect(() => {
    if (companyData && editingAward) {
      const formattedDate = editingAward.date?.split("T")[0] || "";
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
            date: formattedDate,
          },
        ],
      });
    }
  }, [companyData, editingAward, reset]);

  const onSubmit = async (data: addAwardData) => {
    if (!companyData || !editingAward || !id || !allAwards) return;

    const updatedAwards = allAwards.map((award: Award) => {
      if (award._id === id) {
        return {
          date: data.awards[0].date,
          description: data.awards[0].description,
        };
      }
      return {
        date: award.date?.split("T")[0] || award.date,
        description: award.description,
      };
    });

    const formData = new FormData();
    const fields = [
      "name",
      "about",
      "mission",
      "vision",
      "coreValues",
    ] as const;
    fields.forEach((field) => {
      formData.append(field, data[field] || "");
    });
    formData.append("awards", JSON.stringify(updatedAwards));

    const allAwardFiles = await Promise.all(
      allAwards.map(async (award: Award) => {
        if (award._id === id) {
          const newFiles = data.awards[0].images;
          if (newFiles) {
            if (newFiles instanceof FileList) return Array.from(newFiles);
            if (newFiles instanceof File) return [newFiles];
            if (Array.isArray(newFiles)) return newFiles;
          }
          return [];
        }
        return fetchImageFiles(award.images || []);
      }),
    );

    allAwardFiles.flat().forEach((file: File) => {
      if (file && file.size > 0) {
        formData.append("awards", file);
      }
    });

    mutation.mutate(formData);
  };

  const isLoading = isCompanyLoading || isAwardsLoading;

  if (isLoading) return <PageLoader />;
  if (!editingAward) return <PageError error="" action={() => {}} title="" />;

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
