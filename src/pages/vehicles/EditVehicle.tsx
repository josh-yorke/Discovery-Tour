import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getVehicle } from "../../hooks/vehicles/vehicles";
import { fetchImageFiles } from "../../utils/fetchImageFiles";
import Navbar from "../../components/nav/Navbar";
import SectionError from "../../components/error/SectionError";
import SectionLoader from "../../components/loader/SectionLoader";
import Header from "../../components/users/Header";
import Edit from "../../components/vehicles/Edit";

const EditVehicle = () => {
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["vehicles", id],
    queryFn: () => getVehicle(id),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    console.log(images);
    const getImages = async () => {
      const image = await fetchImageFiles(data?.images);

      setImages(image);
    };

    getImages();
  }, [data]);

  return (
    <>
      <Navbar />

      {isLoading || isError ? (
        isError ? (
          <SectionError action={refetch} error={error.message} />
        ) : isLoading ? (
          <SectionLoader />
        ) : null
      ) : (
        <div className="w-full flex flex-col items-center justify-center bg-gray-100">
          <Header
            style="px-6 lg:px-0 py-6"
            title="Edit Vehicle"
            url="/vehicles"
            id={data._id}
          />
          <Edit
            year={data.year}
            images={images}
            vehicleName={data.vehicleName}
            vehicleType={data.vehicleType}
            status={data.status}
            isAvailable={data.isAvailable}
            brand={data.brand}
            fuelType={data.fuelType}
            model={data.model}
            seatingCapacity={data.seatingCapacity}
            luggageCapacity={data.luggageCapacity}
            transmission={data.transmission}
          />
        </div>
      )}
    </>
  );
};

export default EditVehicle;
