import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  addVehicleSchema,
  type addVehicleData,
} from "../../types/vehicles/addVehicleTypes";
import { addVehicle } from "../../hooks/vehicles/vehicles";
import Input from "../input/Input";
import InputOption from "../input/InputOption";
import Button from "../button/Button";
import ImageInput from "../input/ImageInput";

const Add = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const methods = useForm<addVehicleData>({
    resolver: zodResolver(addVehicleSchema),
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: addVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"], exact: false });
      navigate(-1);
      reset();
    },
  });

  const onSubmit = (data: addVehicleData) => {
    const formData = new FormData();

    formData.append("vehicleName", data.vehicleName);
    formData.append("vehicleType", data.vehicleType);
    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("year", data.year.toString());
    formData.append("seatingCapacity", data.seatingCapacity.toString());
    formData.append("luggageCapacity", data.luggageCapacity);
    formData.append("fuelType", data.fuelType);
    formData.append("transmission", data.transmission);
    formData.append("isAvailable", data.isAvailable);
    formData.append("status", data.status);

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
          className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
            <Input
              style="bg-white"
              disabled={false}
              error={errors.vehicleName?.message || ""}
              title="Vehicle Name"
              placeholder="vehicle name"
              type="text"
              {...register("vehicleName")}
            />

            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Vehicle Type"
              options={["sedan", "suv", "van", "minibus", "luxury"]}
              {...register("vehicleType")}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={errors.brand?.message || ""}
              title="Brand"
              placeholder="brand"
              type="text"
              {...register("brand")}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={errors.model?.message || ""}
              title="Model"
              placeholder="model"
              type="text"
              {...register("model")}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={errors.year?.message || ""}
              title="Year"
              placeholder="year"
              type="number"
              {...register("year")}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={errors.seatingCapacity?.message || ""}
              title="Seating Capacity"
              placeholder="seating capacity"
              type="number"
              {...register("seatingCapacity")}
            />

            <Input
              style="bg-white"
              disabled={false}
              error={errors.seatingCapacity?.message || ""}
              title="Luggage Capacity"
              placeholder="luggage capacity"
              type="text"
              {...register("luggageCapacity")}
            />

            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Transmission"
              options={["automatic", "manual"]}
              {...register("transmission")}
            />

            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Fuel Type"
              options={["gasoline", "diesel", "hybrid", "electric"]}
              {...register("fuelType")}
            />

            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Available?"
              options={["true", "false"]}
              {...register("isAvailable")}
            />

            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Status"
              options={["active", "maintenance", "unavailable"]}
              {...register("status")}
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
              title="Add vehicle"
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default Add;
