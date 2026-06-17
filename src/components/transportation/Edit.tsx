import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import { getVisaCountries } from "../../hooks/visa/visa/getVisas";
import Button from "../button/Button";
import ImageInput from "../input/ImageInput";
import TextArea from "../input/TextArea";
import InputOption from "../input/InputOption";
import Input from "../input/Input";
import Modal from "../modal/Modal";
import ActionButton from "../button/ActionButton";
import {
  addTransportationSchema,
  type addTransportationData,
} from "../../types/transportation/addTransportationTypes";
import { updateTransport } from "../../hooks/transportation/transportation";
import { getTransportTypes } from "../../hooks/category/type";

interface EditInputsProps extends addTransportationData {
  id: string;
}

type RedirectTarget = "transportation" | "information";

const Edit = ({
  id,
  country,
  type,
  description,
  title,
  images,
}: EditInputsProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] =
    useState<RedirectTarget>("transportation");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const methods = useForm<addTransportationData>({
    resolver: zodResolver(addTransportationSchema),
    defaultValues: {
      country,
      type,
      description,
      title,
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

  const typesQuery = useQuery({
    queryKey: ["transportType"],
    queryFn: getTransportTypes,
    select: (data) =>
      data?.types?.filter((type): type is string => typeof type === "string") ||
      [],
  });

  const countries = useMemo(
    () => countriesQuery.data || [],
    [countriesQuery.data],
  );
  const types = useMemo(() => typesQuery.data || [], [typesQuery.data]);

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
    mutationFn: ({ id, data }) => updateTransport(id, data),
    onSuccess: (data) => {
      setMessage(data);
      queryClient.invalidateQueries({ queryKey: ["transports"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["transports", id] });

      if (redirectTo === "information") {
        navigate(`/transport/transportation/information/edit/${id}`);
      } else {
        navigate(-1);
      }
    },
    onError: (error) => {
      setMessage(error.message);
    },
  });

  const createFormData = (data: addTransportationData) => {
    const formData = new FormData();
    formData.append("country", data.country);
    formData.append("type", data.type);
    formData.append("description", data.description || "");
    formData.append("title", data.title);

    Array.from(data.images).forEach((file: any) => {
      formData.append("images", file);
    });

    return formData;
  };

  const handleSubmitAction = (
    data: addTransportationData,
    target: RedirectTarget,
  ) => {
    setRedirectTo(target);
    const formData = createFormData(data);
    updateMutation.mutate({ id, data: formData });
  };

  const currentCountry = watch("country");
  const currentType = watch("type");

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((data) =>
            handleSubmitAction(data, "transportation"),
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
              title="Transport Type"
              options={types}
              value={currentType || ""}
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
                title="Update Transportation"
                style="bg-white hover:bg-[#f7f9ff] text-[#1d2087] text-sm lg:text-base duration-300 mt-4"
              />

              <ActionButton
                action={handleSubmit((data) =>
                  handleSubmitAction(data, "information"),
                )}
                isLoading={updateMutation.isPending}
                title="Proceed to Information"
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
