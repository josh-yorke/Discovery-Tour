import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Input from "../../input/Input";
import Button from "../../button/Button";
import {
  addBranchSchema,
  type addBranchData,
} from "../../../types/company/addCompanyTypes";
import { addBranch } from "../../../hooks/company/addBranch";
import { getDetails } from "../../../hooks/company/getDetails";
import PageLoader from "../../loader/PageLoader";

const AddBranch = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: getDetails,
  });

  const methods = useForm<addBranchData>({
    resolver: zodResolver(addBranchSchema),
    defaultValues: {
      name: companyData?.name || "",
      about: companyData?.about || "",
      mission: companyData?.mission || "",
      vision: companyData?.vision || "",
      coreValues: companyData?.coreValues || "",
      branches: [
        {
          branchName: "",
          contact: {
            email: "",
            phone: "",
            address: "",
            mapLink: "",
          },
          socials: {
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
            youtube: "",
          },
        },
      ],
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
      queryClient.invalidateQueries({ queryKey: ["company"], exact: false });
      navigate("/company/branches");
    },
  });

  const onSubmit = (data: addBranchData) => {
    if (!companyData) return;

    const newBranch = { ...data.branches[0] };

    const updatedBranches = [...(companyData.branches || []), newBranch];

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("about", data.about);
    formData.append("mission", data.mission);
    formData.append("vision", data.vision);
    formData.append("coreValues", data.coreValues);
    formData.append("branches", JSON.stringify(updatedBranches));

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
          title="Branch Name"
          placeholder="Branch name"
          type="text"
          {...register("branches.0.branchName")}
          error={errors.branches?.[0]?.branchName?.message || ""}
        />
        <Input
          disabled={false}
          title="Email"
          placeholder="Branch email"
          type="email"
          {...register("branches.0.contact.email")}
          error={errors.branches?.[0]?.contact?.email?.message || ""}
        />
        <Input
          disabled={false}
          title="Phone"
          placeholder="Phone number"
          type="text"
          {...register("branches.0.contact.phone")}
          error={errors.branches?.[0]?.contact?.phone?.message || ""}
        />
        <Input
          disabled={false}
          title="Address"
          placeholder="Branch address"
          type="text"
          {...register("branches.0.contact.address")}
          error={errors.branches?.[0]?.contact?.address?.message || ""}
        />
        <Input
          disabled={false}
          title="Map Link"
          placeholder="Google Maps link"
          type="text"
          {...register("branches.0.contact.mapLink")}
          error={errors.branches?.[0]?.contact?.mapLink?.message || ""}
        />
        <Input
          disabled={false}
          title="Facebook"
          placeholder="Facebook link"
          type="text"
          {...register("branches.0.socials.facebook")}
          error={errors.branches?.[0]?.socials?.facebook?.message || ""}
        />
        <Input
          disabled={false}
          title="Instagram"
          placeholder="Instagram link"
          type="text"
          {...register("branches.0.socials.instagram")}
          error={errors.branches?.[0]?.socials?.instagram?.message || ""}
        />
        <Input
          disabled={false}
          title="Twitter"
          placeholder="Twitter link"
          type="text"
          {...register("branches.0.socials.twitter")}
          error={errors.branches?.[0]?.socials?.twitter?.message || ""}
        />
        <Input
          disabled={false}
          title="LinkedIn"
          placeholder="LinkedIn link"
          type="text"
          {...register("branches.0.socials.linkedin")}
          error={errors.branches?.[0]?.socials?.linkedin?.message || ""}
        />
        <Input
          disabled={false}
          title="YouTube"
          placeholder="YouTube link"
          type="text"
          {...register("branches.0.socials.youtube")}
          error={errors.branches?.[0]?.socials?.youtube?.message || ""}
        />

        <Button
          isLoading={mutation.isPending}
          title="Add Branch"
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
        />
      </form>
    </FormProvider>
  );
};

export default AddBranch;
