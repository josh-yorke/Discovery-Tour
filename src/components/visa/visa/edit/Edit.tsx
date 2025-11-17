import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  editVisaSchema,
  type editVisaData,
} from "../../../../types/visa/editVisaTypes";
import { updateVisa } from "../../../../hooks/visa/visa/updateVisa";
import Button from "../../../button/Button";
import ImageInput from "../../../input/ImageInput";
import TextArea from "../../../input/TextArea";
import Input from "../../../input/Input";
import InputOption from "../../../input/InputOption";
import { getTerm } from "../../../../hooks/visa/terms/getTerm";
import { getPayment } from "../../../../hooks/visa/payment/getPayment";
import { getDocument } from "../../../../hooks/visa/document/getDocument";
import { getProcess } from "../../../../hooks/visa/process/getProcess";
import { getPricelist } from "../../../../hooks/visa/pricelist/getPriceList";
import { useState } from "react";
import Modal from "../../../modal/Modal";

interface EditInputsProps extends editVisaData {
  id: string;
}

const Edit = ({
  id,
  country,
  type,
  mainDescription,
  eligibleApplicants,
  images,
}: EditInputsProps) => {
  const [message, showMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const methods = useForm<editVisaData>({
    resolver: zodResolver(editVisaSchema),
    defaultValues: {
      country,
      type,
      mainDescription,
      eligibleApplicants,
      images: images,
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  console.log(images);

  //get data
  getTerm(id);
  getPayment(id);
  getDocument(id);
  getProcess(id);
  getPricelist(id);

  const mutation = useMutation<string, Error, { id: string; data: FormData }>({
    mutationFn: ({ id, data }) => updateVisa(id, data),
    onSuccess: (data) => {
      showMessage(data);
      queryClient.invalidateQueries({ queryKey: ["visas"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["visas", id] });
      navigate(`/visas/information/edit/${id}`);
      reset();
    },
    onError: (error) => {
      showMessage(error.message);
    },
  });

  const onSubmit = (data: editVisaData) => {
    const formData = new FormData();
    formData.append("country", data.country);
    formData.append("type", data.type);
    formData.append("eligibleApplicants", data.eligibleApplicants);
    formData.append("mainDescription", data.mainDescription);

    Array.from(data.images).forEach((file: any) => {
      formData.append("images", file);
    });

    mutation.mutate({ id, data: formData });
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log(err);
          })}
          className="w-full min-h-[100svh] flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Country"
              options={["Korea", "Japan", "Resident"]}
              {...register("country")}
            />
            <Input
              disabled={false}
              error={errors.country?.message || ""}
              title="Visa Type"
              placeholder="visa type"
              type="text"
              {...register("type")}
            />
            <Input
              disabled={false}
              error={errors.eligibleApplicants?.message || ""}
              title="Eligible Applicants"
              placeholder="eligible applicants"
              type="text"
              {...register("eligibleApplicants")}
            />
            <TextArea
              disabled={false}
              error={errors.mainDescription?.message || ""}
              title="Visa Description"
              placeholder="visa description"
              {...register("mainDescription")}
            />

            <ImageInput
              initialFiles={images}
              title="Images"
              disabled={false}
              register={register}
              setValue={setValue}
              error={
                typeof errors.images?.message === "string"
                  ? errors.images.message
                  : ""
              }
            />
            <Button
              isLoading={mutation.isPending}
              title="Update Visa & Proceed to Information"
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
            />
          </div>
        </form>
      </FormProvider>
      {message && (
        <Modal
          message={message}
          success={mutation.isSuccess}
          action={() => {
            showMessage(null);
            if (mutation.isSuccess) {
              navigate("/visas/information/add");
            }
          }}
        />
      )}
    </>
  );
};

export default Edit;
