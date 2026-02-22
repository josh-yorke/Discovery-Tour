import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "../../input/Input";
import CustomImageInput from "../../input/CustomImageInput";
import Modal from "../../modal/Modal";
import {
  editPartnerSchema,
  type editPartnerData,
} from "../../../types/partners/editPartnerTypes";
import InputOption from "../../input/InputOption";
import Button from "../../button/Button";
import { updatePartner } from "../../../hooks/partners/partners";

interface EditInputsProps extends editPartnerData {
  id: string;
}

const Edit = ({
  id,
  partnerName,
  type,
  websiteUrl,
  image,
}: EditInputsProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const methods = useForm<editPartnerData>({
    resolver: zodResolver(editPartnerSchema),
    defaultValues: {
      partnerName: partnerName,
      type: type,
      websiteUrl: websiteUrl,
      image: image,
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const mutation = useMutation<string, Error, { id: string; data: FormData }>({
    mutationFn: ({ id, data }) => updatePartner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["partners", id] });
      navigate(-1);
      reset();
    },
  });

  const onSubmit = (data: editPartnerData) => {
    const formData = new FormData();

    formData.append("partnerName", data.partnerName);
    formData.append("type", data.type);
    formData.append("websiteUrl", data.websiteUrl);

    if (data.image && data.image.length > 0) {
      data.image.forEach((file: File) => {
        formData.append("image", file);
      });
    }

    mutation.mutate({ id, data: formData });
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log(err);
          })}
          className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <Input
            style="bg-white"
            disabled={false}
            error={errors.partnerName?.message || ""}
            title="Partner Name"
            placeholder="enter partner name"
            type="text"
            {...register("partnerName")}
          />

          <InputOption
            disabled={false}
            options={["Insurance"]}
            {...register("type")}
            style="w-full bg-white"
            title="Partner Type"
          />

          <Input
            style="bg-white"
            disabled={false}
            error={errors.websiteUrl?.message || ""}
            title="Website URL"
            placeholder="https://example.com"
            type="url"
            {...register("websiteUrl")}
          />

          <CustomImageInput
            title="Logo Image"
            disabled={false}
            initialFiles={image}
            setValue={setValue}
            register={register}
            error={
              typeof errors.image?.message === "string"
                ? errors.image.message
                : ""
            }
            fieldName="image"
          />

          <Button
            isLoading={mutation.isPending}
            title="Update Partner"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </form>
      </FormProvider>

      {mutation.isError && (
        <Modal
          success={false}
          action={() => navigate("/partners")}
          message={mutation.error.message}
        />
      )}
    </>
  );
};

export default Edit;
