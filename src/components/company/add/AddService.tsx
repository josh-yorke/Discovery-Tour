import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Input from "../../input/Input";
import {
  addServiceSchema,
  type addServiceData,
} from "../../../types/company/addCompanyTypes";
import { addBranch } from "../../../hooks/company/addBranch";
import { getDetails } from "../../../hooks/company/getDetails";
import PageLoader from "../../loader/PageLoader";
import { useEffect } from "react";
import Button from "../../button/Button";

const AddService = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getDetails,
  });

  const methods = useForm<addServiceData>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      name: companyData?.name || "",
      about: companyData?.about || "",
      mission: companyData?.mission || "",
      vision: companyData?.vision || "",
      coreValues: companyData?.coreValues || "",
      services: [{ title: "", description: "" }],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: addBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"], exact: false });
      navigate("/company/services");
    },
  });

  useEffect(() => {
    if (companyData) {
      methods.reset({
        name: companyData.name,
        about: companyData.about,
        mission: companyData.mission,
        vision: companyData.vision,
        coreValues: companyData.coreValues,
        services: [{ title: "", description: "" }],
      });
    }
  }, [companyData]);

  const onSubmit = (data: addServiceData) => {
    console.log("Form submitted!", data);
    if (!companyData) return;

    const newService = { ...data.services[0] };
    const updatedServices = [...(companyData.services || []), newService];

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("about", data.about);
    formData.append("mission", data.mission);
    formData.append("vision", data.vision);
    formData.append("coreValues", data.coreValues);
    formData.append("services", JSON.stringify(updatedServices));

    mutation.mutate(formData);

    console.log("FormData contents:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-2xl flex flex-col items-center justify-center p-6 gap-6"
      >
        <Input
          disabled={false}
          title="Title"
          placeholder="service title"
          type="text"
          {...register("services.0.title")}
          error={errors.services?.[0]?.title?.message || ""}
        />
        <Input
          disabled={false}
          title="Description"
          placeholder="service description"
          type="text"
          {...register("services.0.description")}
          error={errors.services?.[0]?.description?.message || ""}
        />

        <Button
          isLoading={mutation.isPending}
          title="Add Service"
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
        />
      </form>
    </FormProvider>
  );
};

export default AddService;
