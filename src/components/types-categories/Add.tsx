import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { TYPES_CATEGORIES_KEYS, TYPES_CATEGORIES_MAPPING } from "../../constants/typesCategoriesConstants";
import { addTypesCategories } from "../../hooks/types-categories/typesCategories";
import {
  addTypesCategoriesSchema,
  type addTypesCategoriesData,
} from "../../types/types-categories/addTypesCategoriesTypes";
import Button from "../button/Button";
import Input from "../input/Input";
import InputOption from "../input/InputOption";
import Modal from "../modal/Modal";
import { getParentOfTypeCategory } from "../../utils/getFormattedTypeCategory";

const AddTypesCategories = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [message, showMessage] = useState<string | null>(null);

  const methods = useForm<addTypesCategoriesData>({
    resolver: zodResolver(addTypesCategoriesSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const type = watch("type");

  const mutation = useMutation({
    mutationFn: (data: addTypesCategoriesData) => addTypesCategories(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visaType"], exact: false });
      navigate(`/types-categories?type=${getParentOfTypeCategory(type)}`);
      reset();
    },
    onError: (error) => {
      showMessage(error.message);
    },
  });

  const onSubmit = (data: addTypesCategoriesData) => {
    mutation.mutate(data);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log(err);
          })}
          className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Type"
              options={TYPES_CATEGORIES_KEYS}
              {...register("type")}
            />

            {type && (
              <Input
                style="bg-white"
                disabled={!type}
                error={errors.type?.message || ""}
                title="Name"
                placeholder="Enter Type/Category Name Here"
                type="text"
                {...register(TYPES_CATEGORIES_MAPPING[type])}
              />
            )}

            <Button
              isLoading={mutation.isPending}
              title="Save"
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
            />
          </div>
        </form>
      </FormProvider>
      {mutation.isError && message && (
        <Modal
          message={message}
          success={mutation.isSuccess}
          action={() => {
            navigate(`/types-categories?type=${getParentOfTypeCategory(type)}`);
          }}
        />
      )}
    </>
  );
};

export default AddTypesCategories;
