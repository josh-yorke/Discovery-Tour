import { RiDeleteBin4Line, RiPencilLine } from "react-icons/ri";
import type { companyBranches } from "../../../types/company/companyDataTypes";
import SocialButton from "../../cards/SocialButton";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetails } from "../../../hooks/company/getDetails";
import { addBranch } from "../../../hooks/company/addBranch";
import PageLoader from "../../loader/PageLoader";
import Modal from "../../modal/Modal";

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
      <div className="w-full flex flex-col gap-2">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((branch) => (
            <div
              key={branch._id}
              className="w-full flex flex-col items-center justify-center rounded-lg bg-cover bg-center overflow-hidden"
              style={{
                backgroundImage: "url(/Japan.jpg)",
              }}
            >
              <div className="w-full flex flex-col items-center justify-center gap-4 p-6 bg-gradient-to-tr from-white to-white/20">
                <p className="text-md font-semibold text-center uppercase">
                  {branch.branchName}
                </p>
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
                <SocialButton socials={branch.socials} />
                <div
                  className="px-4 py-2 rounded-lg bg-[#1d2087] hover:bg-[#3b3eac] duration-300 text-sm font-normal text-white cursor-pointer"
                  onClick={() => window.open(branch.contact.mapLink)}
                >
                  Directions
                </div>
                <div className="flex flex-row gap-2">
                  <RiPencilLine
                    size={16}
                    color="black"
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/company/branches/edit/${branch._id}`)
                    }
                  />
                  <RiDeleteBin4Line
                    size={16}
                    color="black"
                    className="cursor-pointer"
                    onClick={() => handleDeleteBranch(branch._id)}
                  />
                </div>
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
