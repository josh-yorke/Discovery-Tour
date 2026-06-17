import { FormProvider, useForm } from "react-hook-form";
import Button from "../../button/Button";
import PageLoader from "../../loader/PageLoader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getDetails } from "../../../hooks/company/getDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { addBranch } from "../../../hooks/company/addBranch";
import {
  editCarouselSchema,
  type editCarouselData,
} from "../../../types/company/editCompanyTypes";
import CarouselInput from "../../input/CarouselInput";
import Modal from "../../modal/Modal";

const EditSlider = ({
  carousel,
  name,
  about,
  mission,
  vision,
  coreValues,
}: editCarouselData) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: getDetails,
  });

  const methods = useForm<editCarouselData>({
    resolver: zodResolver(editCarouselSchema),
    defaultValues: {
      name: name,
      about: about,
      mission: mission,
      vision: vision,
      coreValues: coreValues,
      carousel: carousel,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: addBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"], exact: false });
      navigate("/company/carousel");
    },
  });

  const onSubmit = (data: editCarouselData) => {
    if (!companyData) return;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("about", data.about);
    formData.append("mission", data.mission);
    formData.append("vision", data.vision);
    formData.append("coreValues", data.coreValues);

    Array.from(data.carousel).forEach((file: any) => {
      formData.append("carousel", file);
    });

    mutation.mutate(formData);
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <CarouselInput
            title="Carousel Images"
            disabled={false}
            register={register}
            setValue={setValue}
            error={
              typeof errors.carousel?.message === "string"
                ? errors.carousel.message
                : ""
            }
            initialFiles={carousel}
          />
          <Button
            isLoading={mutation.isPending}
            title="Update Carousel"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </form>
      </FormProvider>
      {mutation.isError && (
        <Modal
          success={mutation.isError}
          action={() => navigate("/company/carousel")}
          message={mutation.error.message}
        />
      )}
    </>
  );
};

export default EditSlider;
