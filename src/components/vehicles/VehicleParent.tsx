import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageLoader from "../loader/PageLoader";
import Modal from "../modal/Modal";
import type { vehicleData } from "../../types/vehicles/vehicleDataTypes";
import { deleteVehicle } from "../../hooks/vehicles/vehicles";
import VehicleCard from "../cards/VehicleCard";

interface ParentProps {
  vehicles: vehicleData[];
  isLoading: boolean;
}

const VehicleParent = ({ vehicles, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["vehicles"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      {vehicles && vehicles.length > 0 ? (
        <div className="w-full lg:w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle: vehicleData) => (
            <VehicleCard
              _id={vehicle._id}
              onDelete={() => handleDelete(vehicle._id)}
              images={vehicle.images}
              vehicleName={vehicle.vehicleName}
              vehicleType={vehicle.vehicleType}
              status={vehicle.status}
              isAvailable={vehicle.isAvailable}
              brand={vehicle.brand}
              fuelType={vehicle.fuelType}
              model={vehicle.model}
              seatingCapacity={vehicle.seatingCapacity}
              luggageCapacity={vehicle.luggageCapacity}
              transmission={vehicle.transmission}
              year={vehicle.year}
            />
          ))}
        </div>
      ) : (
        <div className="h-[60vh] flex items-center justify-center">
          <p className="text-sm font-normal">No Results Found</p>
        </div>
      )}
      {modal && (
        <Modal
          success={deleteMutation.isError ? false : true}
          message={
            deleteMutation.isError
              ? deleteMutation.error.message
              : deleteMutation.data
          }
          action={() => showModal(false)}
        />
      )}
    </>
  );
};

export default VehicleParent;
