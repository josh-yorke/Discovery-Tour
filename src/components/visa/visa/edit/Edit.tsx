import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useMemo, useState } from "react";
import Modal from "../../../modal/Modal";
import ActionButton from "../../../button/ActionButton";
import {
  getVisaCountries,
  getVisaTypes,
} from "../../../../hooks/visa/visa/getVisas";

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
  const [redirectTo, setRedirectTo] = useState<"visa" | "information">("visa");
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

  const { data: countriesData } = useQuery({
    queryKey: ["visaCountries"],
    queryFn: getVisaCountries,
    select: (data) => {
      if (!data?.countries) return [];
      return data.countries.filter(
        (country): country is string => typeof country === "string"
      );
    },
  });

  const { data: visaTypesData } = useQuery({
    queryKey: ["visaTypes"],
    queryFn: getVisaTypes,
    select: (data) => {
      if (!data?.visaTypes) return [];
      return data.visaTypes.filter(
        (type): type is string => typeof type === "string"
      );
    },
  });

  const countries = useMemo(() => countriesData || [], [countriesData]);
  const types = useMemo(() => visaTypesData || [], [visaTypesData]);

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

      // Redirect based on which button was clicked
      if (redirectTo === "information") {
        navigate(`/visas/information/edit/${id}`);
      } else {
        navigate(`/visas/visa`);
      }

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

  // Handle Update Visa button click
  const handleUpdateVisa = (data: editVisaData) => {
    setRedirectTo("visa");
    onSubmit(data);
  };

  // Handle Proceed to Information Visa button click
  const handleProceedToInformation = (data: editVisaData) => {
    setRedirectTo("information");
    onSubmit(data);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleUpdateVisa, (err) => {
            console.log(err);
          })}
          className="w-full min-h-screen flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full lg:w-2xl grid grid-cols-1 gap-4 items-start justify-start">
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Country"
              options={countries}
              {...register("country")}
            />

            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Visa Type"
              options={types}
              {...register("type")}
            />

            <TextArea
              disabled={false}
              error={errors.eligibleApplicants?.message || ""}
              title="Eligible Applicants"
              placeholder="eligible applicants"
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
            <div className="w-full flex flex-row gap-4">
              <Button
                isLoading={mutation.isPending}
                title="Update Visa"
                style="bg-white hover:bg-[#f7f9ff] text-[#1d2087] text-sm lg:text-base duration-300 mt-4"
              />

              <ActionButton
                action={handleSubmit(handleProceedToInformation)}
                isLoading={mutation.isPending}
                title="Proceed to Visa Information"
                style="bg-[#1d2087] hover:bg-[#3b3eac] text-white text-sm lg:text-base duration-300 mt-4"
              />
            </div>
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
              // No need to navigate here since we're already navigating in onSuccess
            }
          }}
        />
      )}
    </>
  );
};

export default Edit;
