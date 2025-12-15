import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  addVisaSchema,
  type addVisaData,
} from "../../../../types/visa/addVisaTypes";
import TextArea from "../../../input/TextArea";
import InputOption from "../../../input/InputOption";
import ImageInput from "../../../input/ImageInput";
import Button from "../../../button/Button";
import { addVisa } from "../../../../hooks/visa/visa/addVisa";
import { useMemo, useState } from "react";
import Modal from "../../../modal/Modal";
import ActionButton from "../../../button/ActionButton";
import {
  getVisaCountries,
  getVisaTypes,
} from "../../../../hooks/visa/visa/getVisas";

const Add = () => {
  const queryClient = useQueryClient();
  const [message, showMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [redirectTo, setRedirectTo] = useState<"visa" | "information">("visa");
  const methods = useForm<addVisaData>({
    resolver: zodResolver(addVisaSchema),
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
    mutationFn: addVisa,
    onSuccess: (data) => {
      localStorage.setItem("visaId", data.id);
      showMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["visas"], exact: false });

      if (redirectTo === "information") {
        navigate(`/visas/information/add`);
      } else {
        navigate(`/visas/visa`);
      }

      reset();

      reset();
    },
    onError: (error) => {
      showMessage(error.message);
    },
  });

  const onSubmit = (data: addVisaData) => {
    const formData = new FormData();

    formData.append("country", data.country);
    formData.append("type", data.type);
    formData.append("eligibleApplicants", data.eligibleApplicants);
    formData.append("mainDescription", data.mainDescription);

    Array.from(data.images).forEach((file: any) => {
      formData.append("images", file);
    });

    mutation.mutate(formData);
  };

  const handleProceedToInformation = (data: addVisaData) => {
    setRedirectTo("information");
    onSubmit(data);
  };

  const countries = useMemo(() => countriesData || [], [countriesData]);
  const types = useMemo(() => visaTypesData || [], [visaTypesData]);

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
                title="Save Visa"
                style="bg-white hover:bg-[#f7f9ff] text-[#1d2087] text-sm lg:text-base duration-300 mt-4"
              />

              <ActionButton
                action={handleSubmit(handleProceedToInformation)}
                isLoading={mutation.isPending}
                title="Add Visa Information"
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
              navigate("/visas/information/add");
            }
          }}
        />
      )}
    </>
  );
};

export default Add;
