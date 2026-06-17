import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getVisaCountries } from "../../hooks/visa/visa/getVisas";
import { getAllPartners } from "../../hooks/partners/partners";
import InputOption from "../input/InputOption";
import TextArea from "../input/TextArea";
import ImageInput from "../input/ImageInput";
import ActionButton from "../button/ActionButton";
import Modal from "../modal/Modal";
import Button from "../button/Button";
import Input from "../input/Input";
import { updateInsurance } from "../../hooks/insurances/insurance";
import {
  addInsuranceSchema,
  type addInsuranceData,
} from "../../types/insurances/addInsuranceTypes";

interface EditInputsProps {
  id: string;
  title: string;
  description: string;
  images: File[];
  country: string;
  insurancePartner: string;
  countryV2?: {
    _id: string;
    country: string;
  } | null;
  insurancePartnerV2?: {
    _id: string;
    name: string;
  } | null;
}

type RedirectTarget = "list" | "information";

const Edit = ({
  id,
  title,
  description,
  images,
  country,
  insurancePartner,
  countryV2,
  insurancePartnerV2,
}: EditInputsProps) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [redirectTo, setRedirectTo] = useState<RedirectTarget>("list");

  const methods = useForm<addInsuranceData>({
    resolver: zodResolver(addInsuranceSchema),
    defaultValues: {
      title: title || "",
      description: description || "",
      country: countryV2?.country || country || "",
      insurancePartner: insurancePartnerV2?.name || insurancePartner || "",
      images: images || [],
    },
  });

  const { watch } = methods;

  const countriesQuery = useQuery({
    queryKey: ["countries"],
    queryFn: getVisaCountries,
    select: (data) =>
      data?.countries?.filter(
        (country): country is string => typeof country === "string",
      ) || [],
  });

  const partnersQuery = useQuery({
    queryKey: ["insurancePartners"],
    queryFn: () => getAllPartners("insurance"),
    select: (data) =>
      data?.partners?.filter(
        (partner): partner is string => typeof partner === "string",
      ) || [],
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const updateMutation = useMutation<{ message: string }, Error, FormData>({
    mutationFn: (formData) => updateInsurance(id, formData),
    onSuccess: (data) => {
      setMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["insurances"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["insurances", id] });

      if (redirectTo === "information") {
        navigate(`/insurance/information/edit/${id}`);
      } else {
        navigate("/insurance/insurances");
      }
    },
    onError: (error) => {
      setMessage(error.message);
    },
  });

  const createFormData = (data: addInsuranceData) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("country", data.country);
    formData.append("insurancePartner", data.insurancePartner);

    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((file: any) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });
    }

    return formData;
  };

  const handleSubmitAction = (
    data: addInsuranceData,
    target: RedirectTarget,
  ) => {
    setRedirectTo(target);
    const formData = createFormData(data);
    updateMutation.mutate(formData);
  };

  const countries = useMemo(
    () => countriesQuery.data || [],
    [countriesQuery.data],
  );

  const partners = useMemo(
    () => partnersQuery.data || [],
    [partnersQuery.data],
  );

  const currentCountry = watch("country");
  const currentPartner = watch("insurancePartner");

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((data) => handleSubmitAction(data, "list"))}
          className="w-full min-h-screen flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full lg:w-2xl grid grid-cols-1 gap-4 items-start justify-start">
            <div className="w-full">
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Country"
                options={countries}
                value={currentCountry || ""}
                {...register("country")}
              />
              {errors.country?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Insurance Partner"
                options={partners}
                value={currentPartner || ""}
                {...register("insurancePartner")}
              />
              {errors.insurancePartner?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.insurancePartner.message}
                </p>
              )}
            </div>

            <Input
              style="bg-white"
              disabled={false}
              error={errors.title?.message || ""}
              title="Title"
              placeholder="enter policy title"
              type="text"
              {...register("title")}
            />

            <TextArea
              disabled={false}
              error={errors.description?.message || ""}
              title="Description"
              placeholder="enter policy description"
              {...register("description")}
            />

            <ImageInput
              title="Images"
              disabled={false}
              register={register}
              setValue={setValue}
              error={
                typeof errors.images?.message === "string"
                  ? errors.images.message
                  : ""
              }
              initialFiles={images}
            />

            <div className="w-full flex flex-row gap-4">
              <Button
                isLoading={updateMutation.isPending}
                title="Update Insurance"
                style="bg-white hover:bg-[#f7f9ff] text-[#1d2087] text-sm lg:text-base duration-300 mt-4"
              />

              <ActionButton
                action={handleSubmit((data) =>
                  handleSubmitAction(data, "information"),
                )}
                isLoading={updateMutation.isPending}
                title="Proceed to Details"
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
          action={() => setMessage(null)}
        />
      )}
    </>
  );
};

export default Edit;
