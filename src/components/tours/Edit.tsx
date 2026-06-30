import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  addTourSchema,
  type addTourData,
} from "../../types/tours/addTourTypes";
import {
  getVisaCountries,
  getVisaCountriesId,
} from "../../hooks/visa/visa/getVisas";
import { getTourTypesId } from "../../hooks/tours/getTours";
import { updateTour } from "../../hooks/tours/updateTour";

import InputOption from "../input/InputOption";
import TextArea from "../input/TextArea";
import ImageInput from "../input/ImageInput";
import ActionButton from "../button/ActionButton";
import Modal from "../modal/Modal";
import Button from "../button/Button";
import Input from "../input/Input";
import LocationImageInput from "../input/LocationImageInput";
import TagsInput from "../input/TagsInput";
import InputOptionId from "../input/InputOptionId";

interface EditInputsProps extends addTourData {
  id: string;
}

type RedirectTarget = "visa" | "information";

const Edit = ({
  id,
  country,
  type,
  mainDescription,
  tags,
  images,
  mainLocationImages,
  mainLocationName,
  mainLocationDescription,
  title,
}: EditInputsProps) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [redirectTo, setRedirectTo] = useState<RedirectTarget>("visa");

  const methods = useForm<addTourData>({
    resolver: zodResolver(addTourSchema),
    defaultValues: {
      title,
      country,
      type,
      mainDescription,
      tags,
      images,
      mainLocationImages,
      mainLocationName,
      mainLocationDescription,
    },
  });

  const { watch } = methods;
  const selectedCountry = watch("country");

  const { data: countriesWithIdData } = useQuery({
    queryKey: ["visaCountriesWithId"],
    queryFn: getVisaCountriesId,
    select: (data) => {
      if (!data) return [];
      return data.map((item: any) => ({
        id: item._id || item.id,
        name: item.country,
      }));
    },
  });

  const selectedCountryId = useMemo(() => {
    if (!selectedCountry || !countriesWithIdData) return null;
    const countryObj = countriesWithIdData.find(
      (c: any) => c.name === selectedCountry,
    );
    return countryObj?.id || null;
  }, [selectedCountry, countriesWithIdData]);

  const countriesQuery = useQuery({
    queryKey: ["visaCountries"],
    queryFn: getVisaCountries,
    select: (data) =>
      data?.countries?.filter(
        (country): country is string => typeof country === "string",
      ) || [],
  });

  const tourTypesQuery = useQuery({
    queryKey: ["tourTypes", selectedCountryId],
    queryFn: () => {
      if (!selectedCountryId) return [];
      return getTourTypesId(selectedCountryId);
    },
    enabled: !!selectedCountryId,
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const updateMutation = useMutation<
    { id: string; message: string },
    Error,
    FormData
  >({
    mutationFn: (formData) => updateTour(id, formData),
    onSuccess: (data) => {
      localStorage.setItem("tourId", data.id);
      setMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["tours"], exact: false });

      if (redirectTo === "information") {
        navigate(`/tours/information/edit/${id}`);
      } else {
        navigate(-1);
      }
    },
    onError: (error) => {
      setMessage(error.message);
    },
  });

  const createFormData = (data: addTourData) => {
    const formData = new FormData();
    formData.append("country", data.country);
    formData.append("type", data.type);
    formData.append("title", data.title);
    formData.append("mainDescription", data.mainDescription || "");
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

    return formData;
  };

  const handleSubmitAction = (data: addTourData, target: RedirectTarget) => {
    setRedirectTo(target);
    const formData = createFormData(data);
    updateMutation.mutate(formData);
  };

  const countries = useMemo(
    () => countriesQuery.data || [],
    [countriesQuery.data],
  );

  const types = useMemo(() => {
    if (!tourTypesQuery.data) return [];
    return tourTypesQuery.data;
  }, [tourTypesQuery.data]);

  const currentCountry = watch("country");

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((data) => handleSubmitAction(data, "visa"))}
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

            <InputOptionId
              disabled={!selectedCountryId || tourTypesQuery.isLoading}
              style="bg-white w-full"
              title="Tour Type"
              options={types}
              {...register("type")}
            />

            {tourTypesQuery.isLoading && selectedCountryId && (
              <p className="text-sm text-gray-500 -mt-2">
                Loading tour types...
              </p>
            )}

            {!tourTypesQuery.isLoading &&
              selectedCountryId &&
              types.length === 0 && (
                <p className="text-sm text-yellow-600 -mt-2">
                  No tour types available for this country
                </p>
              )}

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
                isLoading={updateMutation.isPending}
                title="Update Tour"
                style="bg-white hover:bg-[#f7f9ff] text-[#1d2087] text-sm lg:text-base duration-300 mt-4"
              />

              <ActionButton
                action={handleSubmit((data) =>
                  handleSubmitAction(data, "information"),
                )}
                isLoading={updateMutation.isPending}
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
          success={updateMutation.isSuccess}
          action={() => setMessage(null)}
        />
      )}
    </>
  );
};

export default Edit;
