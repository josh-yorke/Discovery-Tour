import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import { useWatch } from "react-hook-form";

import {
  addRailPassSchema,
  type addRailPassData,
} from "../../types/rail-pass/addRailPassTypes";
import { updateRailPass } from "../../hooks/rail-pass/railPass";
import { getVisaCountries } from "../../hooks/visa/visa/getVisas";
import { getPassCategory } from "../../hooks/category/category";
import { getPassTypesByCategory } from "../../hooks/category/type";

import Button from "../button/Button";
import ImageInput from "../input/ImageInput";
import TextArea from "../input/TextArea";
import InputOption from "../input/InputOption";
import Input from "../input/Input";
import Modal from "../modal/Modal";
import ActionButton from "../button/ActionButton";

interface EditInputsProps extends addRailPassData {
  id: string;
}

type RedirectTarget = "rail-pass" | "information";

const Edit = ({
  id,
  country,
  type,
  description,
  title,
  category,
  images,
}: EditInputsProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<RedirectTarget>("rail-pass");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const methods = useForm<addRailPassData>({
    resolver: zodResolver(addRailPassSchema),
    defaultValues: {
      country,
      type,
      description,
      title,
      category,
      images,
    },
  });

  const { watch } = methods;

  const selectedCategory = useWatch({
    control: methods.control,
    name: "category",
  });

  const countriesQuery = useQuery({
    queryKey: ["visaCountries"],
    queryFn: getVisaCountries,
    select: (data) =>
      data?.countries?.filter(
        (country): country is string => typeof country === "string"
      ) || [],
  });

  const categoriesQuery = useQuery({
    queryKey: ["passCategory"],
    queryFn: getPassCategory,
    select: (data) =>
      data?.categories?.filter(
        (category): category is string => typeof category === "string"
      ) || [],
  });

  const passTypesQuery = useQuery({
    queryKey: ["passType", selectedCategory],
    queryFn: () => {
      if (!selectedCategory) return { types: [] };
      return getPassTypesByCategory(selectedCategory);
    },
    enabled: !!selectedCategory,
    select: (data) =>
      data?.types?.filter((type): type is string => typeof type === "string") ||
      [],
  });

  const countries = useMemo(
    () => countriesQuery.data || [],
    [countriesQuery.data]
  );
  const categories = useMemo(
    () => categoriesQuery.data || [],
    [categoriesQuery.data]
  );
  const passTypes = useMemo(
    () => passTypesQuery.data || [],
    [passTypesQuery.data]
  );

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const updateMutation = useMutation<
    string,
    Error,
    { id: string; data: FormData }
  >({
    mutationFn: ({ id, data }) => updateRailPass(id, data),
    onSuccess: (data) => {
      setMessage(data);
      queryClient.invalidateQueries({ queryKey: ["railPass"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["railPass", id] });

      const redirectPath =
        redirectTo === "information"
          ? `/rail-passes/information/edit/${id}`
          : `/rail-passes`;

      navigate(redirectPath);
    },
    onError: (error) => {
      setMessage(error.message);
    },
  });

  const createFormData = (data: addRailPassData) => {
    const formData = new FormData();
    formData.append("country", data.country);
    formData.append("type", data.type);
    formData.append("description", data.description);
    formData.append("title", data.title);
    formData.append("category", data.category);

    Array.from(data.images).forEach((file: any) => {
      formData.append("images", file);
    });

    return formData;
  };

  const handleSubmitAction = (
    data: addRailPassData,
    target: RedirectTarget
  ) => {
    setRedirectTo(target);
    const formData = createFormData(data);
    updateMutation.mutate({ id, data: formData });
  };

  const currentCountry = watch("country");
  const currentCategory = watch("category");
  const currentType = watch("type");

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((data) =>
            handleSubmitAction(data, "rail-pass")
          )}
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
              title="Category"
              options={categories}
              value={currentCategory || ""}
              {...register("category")}
            />

            <InputOption
              disabled={!selectedCategory || passTypes.length === 0}
              style="bg-white w-full"
              title="Pass Type"
              options={passTypes}
              value={currentType || ""}
              {...register("type")}
            />

            {passTypesQuery.isLoading && selectedCategory && (
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
                title="Update Rail Pass"
                style="bg-white hover:bg-[#f7f9ff] text-[#1d2087] text-sm lg:text-base duration-300 mt-4"
              />

              <ActionButton
                action={handleSubmit((data) =>
                  handleSubmitAction(data, "information")
                )}
                isLoading={updateMutation.isPending}
                title="Proceed to Pass Information"
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
