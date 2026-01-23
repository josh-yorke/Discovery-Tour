import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import {
  addRentalSchema,
  type addRentalData,
} from "../../types/rental/addRentalTypes";
import Input from "../input/Input";
import InputOption from "../input/InputOption";
import Button from "../button/Button";
import SearchableTransportDropdown from "../input/SearchableTransportDropdown";
import SearchablePlanDropdown from "../input/SearchablePlanDropdown";
import { updateRental } from "../../hooks/rental/rental";
import DatePicker from "../input/DatePicker";
import {
  addTypesCategoriesSchema,
  type addTypesCategoriesData,
} from "../../types/types-categories/addTypesCategoriesTypes";
import { TYPE_CATEGORIES_MAPPING } from "../../utils/constants";
import { updateTypesCategories } from "../../hooks/types-categories/typesCategories";
import type { typesCategoriesData } from "../../types/types-categories/typesCategoriesDataTypes";

interface EditProps extends addTypesCategoriesData {
  id?: string;
}

const Edit = ({
  id: propId,
  type: type,
  visaType,
  tourType,
  transportType,
  railPassType,
  railPassCategory,
  country,
}: EditProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const typesCategoriesId = propId || routeId || "";

  const methods = useForm<addTypesCategoriesData>({
    resolver: zodResolver(addTypesCategoriesSchema),
    defaultValues: {
      type: type || "visa-type", 
      visaType: visaType || "",
      tourType: tourType || "",
      transportType: transportType || "",
      railPassType: railPassType || "",
      railPassCategory: railPassCategory || "",
      country: country || "",
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const mutation = useMutation({
    mutationFn: (data: addTypesCategoriesData) =>
      updateTypesCategories(typesCategoriesId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visaType"], exact: false });
      navigate("/types-categories");
    },
  });

  const onSubmit = (data: addTypesCategoriesData) => {
    mutation.mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
        className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
      >
        <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
          <InputOption
            disabled={true}
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
            value={type}
            {...register("type")}
          />

          <Input
            style="bg-white"
            disabled={false}
            error={errors.type?.message || ""}
            title="Name"
            placeholder="Enter Type/Category Name Here"
            type="text"
            {...register(TYPE_CATEGORIES_MAPPING[type])}
          />

          <Button
            isLoading={mutation.isPending}
            title="Save"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default Edit;
