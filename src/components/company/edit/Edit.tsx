import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../input/Input";
import { FormProvider, useForm } from "react-hook-form";
import TextArea from "../../input/TextArea";
import {
  editDetailSchema,
  type editDetailData,
} from "../../../types/company/editCompanyTypes";
import Button from "../../button/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { updateDetails } from "../../../hooks/company/updateDetails";
import Modal from "../../modal/Modal";

const Edit = ({
  name,
  tagline,
  about,
  mission,
  vision,
  coreValues,
}: editDetailData) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const methods = useForm<editDetailData>({
    resolver: zodResolver(editDetailSchema),
    defaultValues: {
      name,
      tagline,
      about,
      mission,
      vision,
      coreValues,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: (data) => updateDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"] });
      navigate(`/company/details`);
      reset();
    },
  });

  const onSubmit = (data: editDetailData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("tagline", data.tagline);
    formData.append("about", data.about);
    formData.append("mission", data.mission);
    formData.append("vision", data.vision);
    formData.append("coreValues", data.coreValues);

    mutation.mutate(formData);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center justify-center gap-4 p-6"
        >
          <Input
            disabled={false}
            title="Company Name"
            type="text"
            placeholder="company name"
            error={errors.name?.message || ""}
            {...register("name")}
          />
          <Input
            disabled={false}
            title="Tagline"
            type="text"
            placeholder="company tagline"
            error={errors.tagline?.message || ""}
            {...register("tagline")}
          />
          <Input
            disabled={false}
            title="Core Values"
            type="text"
            placeholder="core values"
            error={errors.coreValues?.message || ""}
            {...register("coreValues")}
          />
          <TextArea
            disabled={false}
            title="About"
            placeholder="about the company"
            error={errors.about?.message || ""}
            {...register("about")}
          />
          <TextArea
            disabled={false}
            title="Mission"
            placeholder="company mission"
            error={errors.mission?.message || ""}
            {...register("mission")}
          />
          <TextArea
            disabled={false}
            title="Vision"
            placeholder="company vision"
            error={errors.vision?.message || ""}
            {...register("vision")}
          />
          <Button
            isLoading={mutation.isPending}
            title="Update details"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </form>
      </FormProvider>
      {mutation.isError && (
        <Modal
          success={mutation.isError}
          action={() => navigate("/company/details")}
          message={mutation.error.message}
        />
      )}
    </>
  );
};

export default Edit;
