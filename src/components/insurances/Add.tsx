import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import InputOption from "../input/InputOption";
import TextArea from "../input/TextArea";
import ImageInput from "../input/ImageInput";
import ActionButton from "../button/ActionButton";
import Modal from "../modal/Modal";
import Button from "../button/Button";
import {
  addInsuranceSchema,
  type addInsuranceData,
} from "../../types/insurances/addInsuranceTypes";
import { getVisaCountries } from "../../hooks/visa/visa/getVisas";
import { getAllPartners } from "../../hooks/partners/partners";
import { addInsurance } from "../../hooks/insurances/insurance";
import Input from "../input/Input";

const Add = () => {
  const queryClient = useQueryClient();
  const [message, showMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [redirectTo, setRedirectTo] = useState<"list" | "information">("list");

  const methods = useForm<addInsuranceData>({
    resolver: zodResolver(addInsuranceSchema),
  });

  const { data: countriesData } = useQuery({
    queryKey: ["countries"],
    queryFn: getVisaCountries,
    select: (data) => {
      if (!data?.countries) return [];
      return data.countries.filter(
        (country): country is string => typeof country === "string",
      );
    },
  });

  const { data: partnersData } = useQuery({
    queryKey: ["partners"],
    queryFn: () => getAllPartners("insurance"),
    select: (data) => {
      if (!data?.partners) return [];
      return data.partners.filter(
        (partner): partner is string => typeof partner === "string",
      );
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const mutation = useMutation<
    { id: string; message: string },
    Error,
    FormData
  >({
    mutationFn: addInsurance,
    onSuccess: (data) => {
      localStorage.setItem("insuranceId", data.id);
      showMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["insurances"], exact: false });

      if (redirectTo === "information") {
        navigate(`/insurance/information/add`);
      } else {
        navigate(-1);
      }

      reset();
    },
    onError: (error) => {
      showMessage(error.message);
    },
  });

  const onSubmit = (data: addInsuranceData) => {
    const formData = new FormData();

    formData.append("country", data.country);
    formData.append("insurancePartner", data.insurancePartner);
    formData.append("title", data.title);
    formData.append("description", data.description);

    Array.from(data.images).forEach((file: any) => {
      formData.append("images", file);
    });

    mutation.mutate(formData);
  };

  const handleProceedToInformation = (data: addInsuranceData) => {
    setRedirectTo("information");
    onSubmit(data);
  };

  const countries = useMemo(() => countriesData || [], [countriesData]);
  const partners = useMemo(() => partnersData || [], [partnersData]);

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log(err);
          })}
          className="w-full min-h-screen flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full lg:w-2xl grid grid-cols-1 gap-4 items-start justify-start">
            <div className="w-full">
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Country"
                options={countries}
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

            {/* Description Field - TextArea has error prop */}
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
            />

            <div className="w-full flex flex-row gap-4 mt-4">
              <Button
                isLoading={mutation.isPending}
                title="Save Insurance"
                style="bg-white hover:bg-[#f7f9ff] text-[#1d2087] text-sm lg:text-base duration-300 mt-4"
              />

              <ActionButton
                action={handleSubmit(handleProceedToInformation)}
                isLoading={mutation.isPending}
                title="Add Details"
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
          }}
        />
      )}
    </>
  );
};

export default Add;
