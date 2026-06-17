import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Input from "../../../components/input/Input";
import InputOption from "../../../components/input/InputOption";
import CustomImageInput from "../../input/CustomImageInput";
import Button from "../../button/Button";
import Modal from "../../modal/Modal";
import { useState } from "react";
import {
  addPartnerSchema,
  type addPartnerData,
} from "../../../types/partners/addPartnerTypes";
import { addPartner } from "../../../hooks/partners/partners";

const Add = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [modal, setModal] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null);

  const methods = useForm<addPartnerData>({
    resolver: zodResolver(addPartnerSchema),
    defaultValues: {
      partnerName: "",
      type: "",
      websiteUrl: "",
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: addPartner,
    onSuccess: (data) => {
      setModal({
        message: data || "Partner added successfully!",
        isSuccess: true,
      });
      queryClient.invalidateQueries({ queryKey: ["partners"], exact: false });
      reset();
    },
    onError: (error) => {
      setModal({
        message: error.message || "Failed to add partner",
        isSuccess: false,
      });
    },
  });

  const handleModalClose = () => {
    setModal(null);
    if (modal?.isSuccess) {
      navigate(-1);
    }
  };

  const onSubmit = (data: addPartnerData) => {
    const formData = new FormData();

    formData.append("partnerName", data.partnerName);
    formData.append("type", data.type);
    formData.append("websiteUrl", data.websiteUrl);

    if (data.image && data.image.length > 0) {
      data.image.forEach((file: File) => {
        formData.append("image", file);
      });
    }

    mutation.mutate(formData);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log(err);
          })}
          className="w-full lg:w-2xl min-h-screen flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
            <Input
              style="bg-white"
              disabled={false}
              error={errors.partnerName?.message || ""}
              title="Partner Name"
              placeholder="enter partner name"
              type="text"
              {...register("partnerName")}
            />

            <div className="w-full">
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Partner Type"
                options={["Insurance"]}
                {...register("type")}
              />
              {errors.type && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.type.message}
                </p>
              )}
            </div>

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
              title="Image"
              disabled={false}
              setValue={setValue}
              register={register}
              maxImages={1}
              error={
                typeof errors.image?.message === "string"
                  ? errors.image.message
                  : ""
              }
              fieldName="image"
            />

            <Button
              isLoading={mutation.isPending}
              title="Add Partner"
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
            />
          </div>
        </form>
      </FormProvider>

      {modal && (
        <Modal
          message={modal.message}
          success={modal.isSuccess}
          action={handleModalClose}
        />
      )}
    </>
  );
};

export default Add;
