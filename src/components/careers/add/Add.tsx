import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import {
  addCareerSchema,
  type addCareerData,
} from "../../../types/career/addCareerTypes";
import { addCareer } from "../../../hooks/careers/careers";
import Input from "../../input/Input";
import TextArea from "../../input/TextArea";
import InputOption from "../../input/InputOption";
import ImageInput from "../../input/ImageInput";
import Button from "../../button/Button";
import Modal from "../../modal/Modal";
import SearchableBranchDropdown from "../../input/SearchableBranchDropdown";
import { useNavigate } from "react-router";

const Add = () => {
  const queryClient = useQueryClient();
  const [message, showMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const methods = useForm<addCareerData>({
    resolver: zodResolver(addCareerSchema),
    defaultValues: {
      status: "draft",
      employmentType: "Full-time",
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const mutation = useMutation<
    { id: string; message: string },
    Error,
    FormData
  >({
    mutationFn: addCareer,
    onSuccess: (data) => {
      showMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["careers"], exact: false });
    },
    onError: (error) => {
      showMessage(error.message);
    },
  });

  const onSubmit = (data: addCareerData) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("employmentType", data.employmentType);
    formData.append("department", data.department);
    formData.append("branch", data.branch);

    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    mutation.mutate(formData);
  };

  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Temporary",
  ];
  const statusOptions = ["open", "closed", "draft"];

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

            <div className="w-full flex flex-col gap-2">
              <p className="text-sm font-semibold">Branch</p>
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

            <div className="w-full">
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Employment Type"
                options={employmentTypes}
                {...register("employmentType")}
              />
              {errors.employmentType?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employmentType.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Status"
                options={statusOptions}
                {...register("status")}
              />
              {errors.status?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

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
            />

            <div className="w-full flex flex-row gap-4">
              <Button
                isLoading={mutation.isPending}
                title="Save Career"
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
            if (mutation.isSuccess) {
              navigate("/careers");
            }
            showMessage(null);
          }}
        />
      )}
    </>
  );
};

export default Add;
