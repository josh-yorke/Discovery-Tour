import {
  RiDeleteBin4Line,
  RiPencilLine,
  RiSuitcase2Fill,
} from "react-icons/ri";
import type { companyServices } from "../../../types/company/companyDataTypes";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetails } from "../../../hooks/company/getDetails";
import { addBranch } from "../../../hooks/company/addBranch";
import PageLoader from "../../loader/PageLoader";

interface Service {
  _id?: string;
  title: string;
  description: string;
}

const ViewServices = ({ services }: companyServices) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: getDetails,
  });

  const handleDeleteBranch = (id: string) => {
    if (!companyData) return;

    const updatedServices = (companyData.services || []).filter(
      (s: Service) => s._id !== id
    );

    const formData = new FormData();
    formData.append("name", companyData.name);
    formData.append("about", companyData.about);
    formData.append("mission", companyData.mission);
    formData.append("vision", companyData.vision);
    formData.append("coreValues", companyData.coreValues);
    formData.append("services", JSON.stringify(updatedServices));

    mutation.mutate(formData);
  };

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: addBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"], exact: false });
      navigate("/company/services");
    },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <div
            className="w-full flex flex-col items-center justify-center p-12 rounded-lg gap-6 bg-white"
            key={service._id}
          >
            <div className="p-3 rounded-full bg-black/10">
              <RiSuitcase2Fill size={16} color="1d2087" />
            </div>
            <div className="w-full flex flex-col gap-2 items-center justify-center">
              <p className="text-md font-semibold text-[#1d2087]">
                {service.title}
              </p>
              <p className="text-sm font-normal text-center">
                {service.description}
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <RiPencilLine
                size={16}
                color="black"
                className="cursor-pointer"
                onClick={() =>
                  navigate(`/company/services/edit/${service._id}`)
                }
              />
              <RiDeleteBin4Line
                size={16}
                color="black"
                className="cursor-pointer"
                onClick={() => handleDeleteBranch(service._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewServices;
