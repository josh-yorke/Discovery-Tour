import { useEffect } from "react";
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
import ImageInput from "../../input/ImageInput";
import { addBranch } from "../../../hooks/company/addBranch";

const AddAward = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["companyDetails"],
    queryFn: getDetails,
  });

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

  // Prefill company info
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

  const onSubmit = (data: addAwardData) => {
    if (!companyData) return;

    const newAward = {
      description: data.awards[0].description,
      date: data.awards[0].date,
    };

    const updatedAwards = [...(companyData.awards || []), newAward];

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("about", data.about);
    formData.append("mission", data.mission);
    formData.append("vision", data.vision);
    formData.append("coreValues", data.coreValues);
    formData.append("awards", JSON.stringify(updatedAwards));

    const imageFiles = data.awards[0].images;
    if (imageFiles && imageFiles.length > 0) {
      Array.from(imageFiles as FileList).forEach((file: File) => {
        formData.append("awards", file);
      });
    }

    mutation.mutate(formData);
  };

  if (isLoading) return <PageLoader />;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center justify-center p-6 gap-6"
      >
        {/* Hidden company fields (auto-filled from backend) */}
        <input type="hidden" {...register("name")} />
        <input type="hidden" {...register("about")} />
        <input type="hidden" {...register("mission")} />
        <input type="hidden" {...register("vision")} />
        <input type="hidden" {...register("coreValues")} />

        {/* Award fields */}
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
        <ImageInput
          title="Award Image"
          register={register}
          setValue={(key, value) => setValue("awards.0.images", value)}
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
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
        />
      </form>
    </FormProvider>
  );
};

export default AddAward;
