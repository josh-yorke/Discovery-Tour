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
  addRailPassSchema,
  type addRailPassData,
} from "../../types/rail-pass/addRailPassTypes";
import { addRailPass } from "../../hooks/rail-pass/railPass";
import { getPassCategory } from "../../hooks/category/category";
import { getAllPassTypes } from "../../hooks/category/type";

const Add = () => {
  const queryClient = useQueryClient();
  const [message, showMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [redirectTo, setRedirectTo] = useState<"visa" | "information">("visa");
  const methods = useForm<addRailPassData>({
    resolver: zodResolver(addRailPassSchema),
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

  const { data: passCategoryData } = useQuery({
    queryKey: ["passCategory"],
    queryFn: getPassCategory,
    select: (data) => {
      if (!data?.categories) return [];
      return data.categories.filter(
        (category): category is string => typeof category === "string",
      );
    },
  });

  const { data: passTypeData, isLoading: isLoadingPassTypes } = useQuery({
    queryKey: ["passType"],
    queryFn: getAllPassTypes,
    select: (data) => {
      if (!data?.passTypes) return [];
      return data.passTypes.filter(
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
    mutationFn: addRailPass,
    onSuccess: (data) => {
      localStorage.setItem("railPassId", data.id);
      showMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["railPass"], exact: false });

      if (redirectTo === "information") {
        navigate(`/transport/rail-passes/information/add`);
      } else {
        navigate(-1);
      }

      reset();
    },
    onError: (error) => {
      showMessage(error.message);
    },
  });

  const onSubmit = (data: addRailPassData) => {
    const formData = new FormData();

    formData.append("country", data.country);
    formData.append("type", data.type || "JR-SOUTH");
    formData.append("description", data.description);
    formData.append("title", data.title);
    formData.append("category", data.category);

    Array.from(data.images).forEach((file: any) => {
      formData.append("images", file);
    });

    mutation.mutate(formData);
  };

  const handleProceedToInformation = (data: addRailPassData) => {
    setRedirectTo("information");
    onSubmit(data);
  };

  const countries = useMemo(() => countriesData || [], [countriesData]);
  const category = useMemo(() => passCategoryData || [], [passCategoryData]);
  const passTypes = useMemo(() => passTypeData || [], [passTypeData]);

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
              title="Category"
              options={category}
              {...register("category")}
            />

            <InputOption
              disabled={passTypes.length === 0}
              style="bg-white w-full"
              title="Pass Type"
              options={passTypes}
              {...register("type")}
            />

            {isLoadingPassTypes && (
              <p className="text-gray-500 text-sm">Loading pass types...</p>
            )}

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
                title="Save Rail Pass"
                style="bg-white hover:bg-[#f7f9ff] text-[#1d2087] text-sm lg:text-base duration-300 mt-4"
              />

              <ActionButton
                action={handleSubmit(handleProceedToInformation)}
                isLoading={mutation.isPending}
                title="Add Pass Information"
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
