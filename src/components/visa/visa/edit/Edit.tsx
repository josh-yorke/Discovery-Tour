import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useMemo, useState } from "react";

import {
  editVisaSchema,
  type editVisaData,
} from "../../../../types/visa/editVisaTypes";
import { updateVisa } from "../../../../hooks/visa/visa/updateVisa";
import {
  getVisaCountries,
  getVisaTypes,
} from "../../../../hooks/visa/visa/getVisas";
import { getTerm } from "../../../../hooks/visa/terms/getTerm";
import { getPayment } from "../../../../hooks/visa/payment/getPayment";
import { getDocument } from "../../../../hooks/visa/document/getDocument";
import { getProcess } from "../../../../hooks/visa/process/getProcess";
import { getPricelist } from "../../../../hooks/visa/pricelist/getPriceList";

import Button from "../../../button/Button";
import ImageInput from "../../../input/ImageInput";
import TextArea from "../../../input/TextArea";
import InputOption from "../../../input/InputOption";
import Modal from "../../../modal/Modal";
import ActionButton from "../../../button/ActionButton";

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
  const [message, setMessage] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<"visa" | "information" | "back">(
    "back",
  );
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const methods = useForm<editVisaData>({
    resolver: zodResolver(editVisaSchema),
    defaultValues: {
      country,
      type,
      mainDescription,
      eligibleApplicants,
      images,
    },
  });

  const { watch } = methods;

  const countriesQuery = useQuery({
    queryKey: ["visaCountries"],
    queryFn: getVisaCountries,
    select: (data) =>
      data?.countries?.filter(
        (country): country is string => typeof country === "string",
      ) || [],
  });

  const visaTypesQuery = useQuery({
    queryKey: ["visaTypes"],
    queryFn: getVisaTypes,
    select: (data) =>
      data?.visaTypes?.filter(
        (type): type is string => typeof type === "string",
      ) || [],
  });

  const countries = useMemo(
    () => countriesQuery.data || [],
    [countriesQuery.data],
  );
  const types = useMemo(() => visaTypesQuery.data || [], [visaTypesQuery.data]);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  getTerm(id);
  getPayment(id);
  getDocument(id);
  getProcess(id);
  getPricelist(id);

  const updateMutation = useMutation<
    string,
    Error,
    { id: string; data: FormData }
  >({
    mutationFn: ({ id, data }) => updateVisa(id, data),
    onSuccess: (data) => {
      setMessage(data);
      queryClient.invalidateQueries({ queryKey: ["visas"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["visas", id] });
    },
    onError: (error) => {
      setMessage(error.message);
    },
  });

  const createFormData = (data: editVisaData) => {
    const formData = new FormData();
    formData.append("country", data.country);
    formData.append("type", data.type);
    formData.append("eligibleApplicants", data.eligibleApplicants);
    formData.append("mainDescription", data.mainDescription);

    Array.from(data.images).forEach((file: any) => {
      formData.append("images", file);
    });

    return formData;
  };

  const handleSubmitAction = (
    data: editVisaData,
    target: "visa" | "information" | "back",
  ) => {
    setRedirectTo(target);
    const formData = createFormData(data);
    updateMutation.mutate({ id, data: formData });
  };

  const handleModalAction = () => {
    setMessage(null);
    if (updateMutation.isSuccess) {
      if (redirectTo === "information") {
        navigate(`/visas/information/edit/${id}`);
      } else {
        navigate(-1);
      }
    }
  };

  const currentCountry = watch("country");
  const currentType = watch("type");

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((data) => handleSubmitAction(data, "back"))}
          className="w-full min-h-screen flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full lg:w-2xl grid grid-cols-1 gap-4 items-start justify-start">
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Country"
              options={countries}
              value={currentCountry || ""}
              {...register("country")}
            />

            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Visa Type"
              options={types}
              value={currentType || ""}
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
                isLoading={updateMutation.isPending}
                title="Update Visa"
                style="bg-white hover:bg-[#f7f9ff] text-[#1d2087] text-sm lg:text-base duration-300 mt-4"
              />

              <ActionButton
                action={handleSubmit((data) =>
                  handleSubmitAction(data, "information"),
                )}
                isLoading={updateMutation.isPending}
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
          success={updateMutation.isSuccess}
          action={handleModalAction}
        />
      )}
    </>
  );
};

export default Edit;
