import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState } from "react";
import {
  addRentalSchema,
  type addRentalData,
} from "../../types/rental/addRentalTypes";
import { addTypesCategories } from "../../hooks/types-categories/typesCategories";
import Input from "../input/Input";
import Button from "../button/Button";
import SearchableTransportDropdown from "../input/SearchableTransportDropdown";
import SearchablePlanDropdown from "../input/SearchablePlanDropdown";
import InputOption from "../input/InputOption";
import DatePicker from "../input/DatePicker";
import {
  addTypesCategoriesSchema,
  type addTypesCategoriesData,
} from "../../types/types-categories/addTypesCategoriesTypes";
import { success } from "zod";
import Modal from "../modal/Modal";
import { TYPE_CATEGORIES_MAPPING } from "../../utils/constants";

const AddTypesCategories = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [message, showMessage] = useState<string | null>(null);

  const methods = useForm<addTypesCategoriesData>({
    resolver: zodResolver(addTypesCategoriesSchema),
  });

  const {
    register,
    setValue,
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
      navigate("/types-categories");
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
              options={[
                "visa-type",
                "tour-type",
                "transport-type",
                "pass-type",
                "pass-category",
                "country",
              ]}
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
                {...register(TYPE_CATEGORIES_MAPPING[type])}
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
      {message && (
        <Modal
          message={message}
          success={mutation.isSuccess}
          action={() => {
            navigate("/types-categories/add");
          }}
        />
      )}
    </>
  );
};

export default AddTypesCategories;
