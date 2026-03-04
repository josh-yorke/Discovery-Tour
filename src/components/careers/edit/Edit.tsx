import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  addCareerSchema,
  type addCareerData,
} from "../../../types/career/addCareerTypes";
import { updateCareer } from "../../../hooks/careers/careers";

import Input from "../../input/Input";
import TextArea from "../../input/TextArea";
import InputOption from "../../input/InputOption";
import ImageInput from "../../input/ImageInput";
import Button from "../../button/Button";
import Modal from "../../modal/Modal";
import SearchableBranchDropdown from "../../input/SearchableBranchDropdown";

interface EditCareerProps extends addCareerData {
  id: string;
}

const Edit = ({
  id,
  title,
  description,
  status,
  employmentType,
  images,
  department,
  branch,
}: EditCareerProps) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const methods = useForm<addCareerData>({
    resolver: zodResolver(addCareerSchema),
    defaultValues: {
      title,
      description,
      status,
      employmentType,
      images,
      department,
      branch,
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = methods;

  const updateMutation = useMutation<
    { id: string; message: string },
    Error,
    FormData
  >({
    mutationFn: (formData) => updateCareer(id, formData),
    onSuccess: (data) => {
      localStorage.setItem("careerId", data.id);
      setMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["careers"], exact: false });
      navigate("/careers");
    },
    onError: (error) => {
      setMessage(error.message);
    },
  });

  const createFormData = (data: addCareerData) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("employmentType", data.employmentType);
    formData.append("department", data.department);
    formData.append("branch", data.branch);

    // Handle images
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    return formData;
  };

  const handleFormSubmit = (data: addCareerData) => {
    const formData = createFormData(data);
    updateMutation.mutate(formData);
  };

  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Temporary",
  ];
  const statusOptions = ["open", "closed", "draft"];

  const currentStatus = watch("status");
  const currentEmploymentType = watch("employmentType");

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-full min-h-screen flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full lg:w-2xl grid grid-cols-1 gap-4 items-start justify-start">
            <Input
              style="bg-white"
              disabled={false}
              error={errors.title?.message || ""}
              title="Career Title"
              placeholder="e.g. Senior Software Engineer"
              type="text"
              {...register("title")}
            />

            <TextArea
              disabled={false}
              error={errors.description?.message || ""}
              title="Career Description"
              placeholder="Describe the role, responsibilities, and requirements..."
              {...register("description")}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={errors.department?.message || ""}
              title="Department"
              placeholder="e.g. Engineering, Marketing, Sales"
              type="text"
              {...register("department")}
            />

            <div className="w-full">
              <Controller
                name="branch"
                control={control}
                render={({ field }) => (
                  <SearchableBranchDropdown
                    disabled={false}
                    title="Branch"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.branch?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.branch.message}
                </p>
              )}
            </div>

            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Employment Type"
              options={employmentTypes}
              value={currentEmploymentType || ""}
              {...register("employmentType")}
            />

            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Status"
              options={statusOptions}
              value={currentStatus || ""}
              {...register("status")}
            />

            <ImageInput
              title="Career Images"
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
                title="Update Career"
                style="bg-white hover:bg-[#f7f9ff] text-[#1d2087] text-sm lg:text-base duration-300 mt-4"
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
