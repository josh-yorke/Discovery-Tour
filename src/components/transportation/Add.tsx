import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getVisaCountries } from "../../hooks/visa/visa/getVisas";
import InputOption from "../input/InputOption";
import TextArea from "../input/TextArea";
import ImageInput from "../input/ImageInput";
import ActionButton from "../button/ActionButton";
import Modal from "../modal/Modal";
import Button from "../button/Button";
import Input from "../input/Input";
import {
  addTransportationSchema,
  type addTransportationData,
} from "../../types/transportation/addTransportationTypes";
import { addTransportation } from "../../hooks/transportation/transportation";
import { getTransportTypes } from "../../hooks/category/type";

const Add = () => {
  const queryClient = useQueryClient();
  const [message, showMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [redirectTo, setRedirectTo] = useState<"visa" | "information">("visa");
  const methods = useForm<addTransportationData>({
    resolver: zodResolver(addTransportationSchema),
  });

  const { data: countriesData } = useQuery({
    queryKey: ["visaCountries"],
    queryFn: getVisaCountries,
    select: (data) => {
      if (!data?.countries) return [];
      return data.countries.filter(
        (country): country is string => typeof country === "string",
      );
    },
  });

  const { data: transportTypeData } = useQuery({
    queryKey: ["transportType"],
    queryFn: getTransportTypes,
    select: (data) => {
      if (!data?.types) return [];
      return data.types.filter(
        (type): type is string => typeof type === "string",
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
    mutationFn: addTransportation,
    onSuccess: (data) => {
      localStorage.setItem("transportId", data.id);
      showMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["transports"], exact: false });

      if (redirectTo === "information") {
        navigate(`/transport/transportation/information/add`);
      } else {
        navigate(-1);
      }

      reset();
    },
    onError: (error) => {
      showMessage(error.message);
    },
  });

  const onSubmit = (data: addTransportationData) => {
    const formData = new FormData();

    formData.append("country", data.country);
    formData.append("type", data.type || "JR-SOUTH");
    formData.append("description", data.description || "");
    formData.append("title", data.title);

    Array.from(data.images).forEach((file: any) => {
      formData.append("images", file);
    });

    mutation.mutate(formData);
  };

  const handleProceedToInformation = (data: addTransportationData) => {
    setRedirectTo("information");
    onSubmit(data);
  };

  const countries = useMemo(() => countriesData || [], [countriesData]);
  const types = useMemo(() => transportTypeData || [], [transportTypeData]);

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
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
              title="Transport Type"
              options={types}
              {...register("type")}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={errors.title?.message || ""}
              title="Title"
              placeholder="title"
              type="text"
              {...register("title")}
            />

            <TextArea
              disabled={false}
              error={errors.description?.message || ""}
              title="Description"
              placeholder="description"
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

            <div className="w-full flex flex-row gap-4">
              <Button
                isLoading={mutation.isPending}
                title="Save Transportation"
                style="bg-white hover:bg-[#f7f9ff] text-[#1d2087] text-sm lg:text-base duration-300 mt-4"
              />

              <ActionButton
                action={handleSubmit(handleProceedToInformation)}
                isLoading={mutation.isPending}
                title="Add Information"
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
