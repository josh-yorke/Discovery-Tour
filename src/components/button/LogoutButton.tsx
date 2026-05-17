import { useMutation } from "@tanstack/react-query";
import { RiLogoutBoxLine } from "react-icons/ri";
import { logout } from "../../hooks/auth/useLogout";

const LogoutButton = () => {
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("user");
      window.location.href = "/";
    },
    onError: (error: any) => {
      console.log(error.message);
    },
  });

  return (
    <button
      className="flex flex-row items-center justify-center gap-2 bg-[#1d2087] hover:bg-[#3b3eac] text-xs font-normal text-white p-3 cursor-pointer rounded-full"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      <RiLogoutBoxLine size={14} />
    </button>
  );
};

export default LogoutButton;
