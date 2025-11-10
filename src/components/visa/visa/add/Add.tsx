import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  addVisaSchema,
  type addVisaData,
} from "../../../../types/visa/addVisaTypes";
import Input from "../../../input/Input";
import TextArea from "../../../input/TextArea";
import InputOption from "../../../input/InputOption";
import ImageInput from "../../../input/ImageInput";
import Button from "../../../button/Button";
import { addVisa } from "../../../../hooks/visa/visa/addVisa";

const Add = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const methods = useForm<addVisaData>({
    resolver: zodResolver(addVisaSchema),
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: addVisa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visas"], exact: false });
      navigate("/visas/visa");
      reset();
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

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log(err);
          })}
          className="w-full min-h-[100svh] flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Country"
              options={["Korea", "Japan", "Resident"]}
              {...register("country")}
            />
            <Input
              disabled={false}
              error={errors.country?.message || ""}
              title="Visa Type"
              placeholder="visa type"
              type="text"
              {...register("type")}
            />
            <Input
              disabled={false}
              error={errors.eligibleApplicants?.message || ""}
              title="Eligible Applicants"
              placeholder="eligible applicants"
              type="text"
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
            <Button
              isLoading={mutation.isPending}
              title="Add Visa"
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default Add;
