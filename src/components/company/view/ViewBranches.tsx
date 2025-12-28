import { RiDeleteBin4Fill, RiPencilLine } from "react-icons/ri";
import type { companyBranches } from "../../../types/company/companyDataTypes";
import SocialButton from "../../cards/SocialButton";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetails } from "../../../hooks/company/getDetails";
import { addBranch } from "../../../hooks/company/addBranch";
import PageLoader from "../../loader/PageLoader";
import Modal from "../../modal/Modal";
import IconButton from "../../button/IconButton";

interface Branch {
  _id?: string;
  branchName: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    mapLink: string;
  };
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
}

const ViewBranches = ({ branches }: companyBranches) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: getDetails,
  });

  const handleDeleteBranch = (id: string) => {
    if (!companyData) return;

    const updatedBranches = (companyData.branches || []).filter(
      (b: Branch) => b._id !== id
    );

    const formData = new FormData();
    formData.append("name", companyData.name);
    formData.append("about", companyData.about);
    formData.append("mission", companyData.mission);
    formData.append("vision", companyData.vision);
    formData.append("coreValues", companyData.coreValues);
    formData.append("branches", JSON.stringify(updatedBranches));

    mutation.mutate(formData);
  };

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: addBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"], exact: false });
      navigate("/company/branches");
    },
  });

  if (isLoading) return <PageLoader />;

  return (
    <>
      <div className="w-full flex flex-col gap-2 items-center justify-center">
        <div className="w-full lg:w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <div
              key={branch._id}
              className="w-full flex flex-col items-center justify-center rounded-3xl bg-cover bg-center overflow-hidden"
              style={{
                backgroundImage: "url(/Japan.jpg)",
              }}
            >
              <div className="w-full flex flex-col items-center justify-center gap-4 p-6 bg-linear-to-tr from-white to-white/20">
                <p className="text-md font-bold text-center uppercase text-[#1d2087]">
                  {branch.branchName}
                </p>
                <div className="flex flex-row gap-2">
                  <IconButton
                    icon={<RiPencilLine size={16} color="white" />}
                    title="Edit"
                    style="flex flex-row gap-2 bg-[#1d2087] hover:bg-[#3b3eac] px-4 py-2 rounded-xl text-white"
                    action={() =>
                      navigate(`/company/branches/edit/${branch._id}`)
                    }
                  />

                  <IconButton
                    icon={<RiDeleteBin4Fill size={16} color="white" />}
                    title="Delete"
                    style="flex flex-row gap-2 bg-[#1d2087] hover:bg-[#3b3eac] px-4 py-2 rounded-xl text-white"
                    action={() => handleDeleteBranch(branch._id)}
                  />
                </div>
                <div className="w-full flex flex-col">
                  <p className="text-sm font-normal text-center">
                    Email: {branch.contact.email}
                  </p>
                  <p className="text-sm font-normal text-center">
                    Branch: {branch.contact.phone}
                  </p>
                  <p className="text-sm font-normal text-center">
                    Address: {branch.contact.address}
                  </p>
                </div>
                <SocialButton
                  socials={branch.socials}
                  mapLink={branch.contact.mapLink}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {mutation.isError && (
        <Modal
          success={mutation.isError}
          action={() => navigate("/news")}
          message={mutation.error.message}
        />
      )}
    </>
  );
};

export default ViewBranches;
