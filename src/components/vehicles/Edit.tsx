import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
  addVehicleSchema,
  type addVehicleData,
} from "../../types/vehicles/addVehicleTypes";
import { updateVehicle } from "../../hooks/vehicles/vehicles";
import Input from "../input/Input";
import InputOption from "../input/InputOption";
import Button from "../button/Button";
import ImageInput from "../input/ImageInput";

interface EditProps extends addVehicleData {
  id?: string;
}

const Edit = ({
  id: propId,
  images,
  vehicleName,
  vehicleType,
  status,
  isAvailable,
  brand,
  fuelType,
  model,
  seatingCapacity,
  luggageCapacity,
  transmission,
  year,
}: EditProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const vehicleId = propId || routeId || "";

  const methods = useForm<addVehicleData>({
    resolver: zodResolver(addVehicleSchema),
    defaultValues: {
      vehicleName,
      vehicleType,
      status,
      isAvailable,
      brand,
      fuelType,
      model,
      seatingCapacity: seatingCapacity?.toString(),
      luggageCapacity,
      transmission,
      year: year?.toString(),
      images: images || [],
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: (formData: FormData) => updateVehicle(vehicleId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"], exact: false });
      navigate("/transport/vehicles");
    },
  });

  const onSubmit = (data: addVehicleData) => {
    const formData = new FormData();
    const { images, ...otherData } = data;

    Object.entries(otherData).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    if (images && images.length > 0) {
      Array.from(images).forEach((file: any) => {
        formData.append("images", file);
      });
    }

    mutation.mutate(formData);
  };

  // Helper function to safely get error message
  const getErrorMessage = (fieldName: keyof addVehicleData): string => {
    const error = errors[fieldName];
    return error?.message?.toString() || "";
  };

  const inputFields = [
    {
      name: "vehicleName" as const,
      title: "Vehicle Name",
      type: "text",
      placeholder: "vehicle name",
    },
    {
      name: "brand" as const,
      title: "Brand",
      type: "text",
      placeholder: "brand",
    },
    {
      name: "model" as const,
      title: "Model",
      type: "text",
      placeholder: "model",
    },
    {
      name: "year" as const,
      title: "Year",
      type: "text",
      placeholder: "year",
    },
    {
      name: "seatingCapacity" as const,
      title: "Seating Capacity",
      type: "text",
      placeholder: "seating capacity",
    },
    {
      name: "luggageCapacity" as const,
      title: "Luggage Capacity",
      type: "text",
      placeholder: "luggage capacity",
    },
  ];

  const selectFields = [
    {
      name: "vehicleType" as const,
      title: "Vehicle Type",
      options: ["sedan", "suv", "van", "minibus", "luxury"],
    },
    {
      name: "transmission" as const,
      title: "Transmission",
      options: ["automatic", "manual"],
    },
    {
      name: "fuelType" as const,
      title: "Fuel Type",
      options: ["gasoline", "diesel", "hybrid", "electric"],
    },
    {
      name: "isAvailable" as const,
      title: "Available?",
      options: ["true", "false"],
    },
    {
      name: "status" as const,
      title: "Status",
      options: ["active", "maintenance", "unavailable"],
    },
  ];

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
        className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
      >
        <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
          {inputFields.map((field) => (
            <Input
              key={field.name}
              style="bg-white"
              disabled={false}
              error={getErrorMessage(field.name)}
              title={field.title}
              placeholder={field.placeholder}
              type={field.type}
              {...register(field.name)}
            />
          ))}

          {selectFields.map((field) => (
            <InputOption
              key={field.name}
              disabled={false}
              style="bg-white w-full"
              title={field.title}
              options={field.options}
              {...register(field.name)}
            />
          ))}

          <ImageInput
            title="Images"
            disabled={false}
            register={register}
            setValue={setValue}
            initialFiles={images}
            error={
              typeof errors.images?.message === "string"
                ? errors.images.message
                : ""
            }
          />

          <Button
            isLoading={mutation.isPending}
            title="Update Vehicle"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default Edit;
