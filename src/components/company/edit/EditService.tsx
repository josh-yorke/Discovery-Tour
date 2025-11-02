import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Input from "../../input/Input";
import { addBranch } from "../../../hooks/company/addBranch";
import { getDetails } from "../../../hooks/company/getDetails";
import PageLoader from "../../loader/PageLoader";
import { useEffect } from "react";
import Button from "../../button/Button";
import {
  editServiceSchema,
  type editServiceData,
} from "../../../types/company/editCompanyTypes";

interface EditBranchProps {
  id: string;
}

const EditService = ({ id }: EditBranchProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getDetails,
  });

  const methods = useForm<editServiceData>({
    resolver: zodResolver(editServiceSchema),
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
      const serviceToEdit = companyData.services?.find(
        (service: any) => service._id === id
      );

      methods.reset({
        name: companyData.name,
        about: companyData.about,
        mission: companyData.mission,
        vision: companyData.vision,
        coreValues: companyData.coreValues,
        services: serviceToEdit
          ? [
              {
                title: serviceToEdit.title,
                description: serviceToEdit.description,
              },
            ]
          : [{ title: "", description: "" }],
      });
    }
  }, [companyData, id, methods]);

  const onSubmit = (data: editServiceData) => {
    console.log("Form submitted!", data);
    if (!companyData) return;

    const updatedServices = (companyData.services || []).map((service: any) =>
      service._id === id ? { ...service, ...data.services[0] } : service
    );

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
        className="w-full flex flex-col items-center justify-center p-6 gap-6"
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
          title="Update Service"
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
        />
      </form>
    </FormProvider>
  );
};

export default EditService;
