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
import {
  addTourSchema,
  type addTourData,
} from "../../types/tours/addTourTypes";
import { getTourTypesId } from "../../hooks/tours/getTours";
import Input from "../input/Input";
import LocationImageInput from "../input/LocationImageInput";
import TagsInput from "../input/TagsInput";
import InputOptionId from "../input/InputOptionId";
import { updateTour } from "../../hooks/tours/updateTour";

interface EditInputsProps extends addTourData {
  id: string;
}

const Edit = ({
  id,
  country,
  type,
  mainDescription,
  category,
  tags,
  images,
  mainLocationImages,
  mainLocationName,
  mainLocationDescription,
}: EditInputsProps) => {
  const queryClient = useQueryClient();
  const [message, showMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [redirectTo, setRedirectTo] = useState<"visa" | "information">("visa");
  const methods = useForm<addTourData>({
    resolver: zodResolver(addTourSchema),
    defaultValues: {
      country,
      type,
      mainDescription,
      category,
      tags,
      images,
      mainLocationImages,
      mainLocationName,
      mainLocationDescription,
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

  const { data: tourTypesData } = useQuery({
    queryKey: ["tourTypes"],
    queryFn: getTourTypesId,
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
    FormData // The mutation expects FormData, not an object
  >({
    mutationFn: (formData) => updateTour(id, formData), // Pass the FormData directly
    onSuccess: (data) => {
      localStorage.setItem("tourId", data.id);
      showMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["tours"], exact: false });

      if (redirectTo === "information") {
        navigate(`/tours/information/add`);
      } else {
        navigate(`/tours`);
      }

      reset();
    },
    onError: (error) => {
      showMessage(error.message);
    },
  });

  const onSubmit = (data: addTourData) => {
    const formData = new FormData();

    formData.append("country", data.country);
    formData.append("type", data.type);
    formData.append("mainDescription", data.mainDescription);
    formData.append("category", data.category);
    formData.append("mainLocationName", data.mainLocationName);
    formData.append("mainLocationDescription", data.mainLocationDescription);

    data.tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    Array.from(data.images).forEach((file: any) => {
      formData.append("images", file);
    });

    Array.from(data.mainLocationImages).forEach((file: any) => {
      formData.append("mainLocationImages", file);
    });

    mutation.mutate(formData); // Pass FormData directly
  };

  const handleProceedToInformation = (data: addTourData) => {
    setRedirectTo("information");
    onSubmit(data);
  };

  const countries = useMemo(() => countriesData || [], [countriesData]);
  const types = useMemo(() => tourTypesData || [], [tourTypesData]);

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

            <InputOptionId
              disabled={false}
              style="bg-white w-full"
              title="Tour Type"
              options={types}
              {...register("type")}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={errors.category?.message || ""}
              title="Category"
              placeholder="category"
              type="text"
              {...register("category")}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={errors.mainLocationName?.message || ""}
              title="Location Name"
              placeholder="location name"
              type="text"
              {...register("mainLocationName")}
            />

            <TagsInput
              error={errors.tags?.[0]?.message || ""}
              disabled={false}
            />

            <TextArea
              disabled={false}
              error={errors.mainDescription?.message || ""}
              title="Description"
              placeholder="description"
              {...register("mainDescription")}
            />

            <TextArea
              disabled={false}
              error={errors.mainLocationDescription?.message || ""}
              title="Location Description"
              placeholder="location description"
              {...register("mainLocationDescription")}
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
            <LocationImageInput
              title="Location Images"
              disabled={false}
              register={register}
              setValue={setValue}
              error={
                typeof errors.mainLocationImages?.message === "string"
                  ? errors.mainLocationImages.message
                  : ""
              }
              initialFiles={mainLocationImages}
            />
            <div className="w-full flex flex-row gap-4">
              <Button
                isLoading={mutation.isPending}
                title="Update Tour"
                style="bg-white hover:bg-[#f7f9ff] text-[#1d2087] text-sm lg:text-base duration-300 mt-4"
              />

              <ActionButton
                action={handleSubmit(handleProceedToInformation)}
                isLoading={mutation.isPending}
                title="Proceed to Tour Information"
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
              navigate("/tours/information/add");
            }
          }}
        />
      )}
    </>
  );
};

export default Edit;
