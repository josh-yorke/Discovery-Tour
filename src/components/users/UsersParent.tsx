import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { userData } from "../../types/users/userDataTypes";
import UserCard from "../cards/UserCard";
import PageLoader from "../loader/PageLoader";
import { useState } from "react";
import { deleteUser } from "../../hooks/users/deleteUser";
import Modal from "../modal/Modal";

interface ParentProps {
  users: userData[];
  isLoading: boolean;
}

const UsersParent = ({ users, isLoading }: ParentProps) => {
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);
  if (isLoading) return <PageLoader />;

  const delUser = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      showModal(true);
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
    },
    onError: () => {
      showModal(true);
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      delUser.mutate(id);
    }
  };

  return (
    <>
      {users && users.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user: userData) => (
            <UserCard
              key={user._id}
              email={user.email}
              firstName={user.firstName}
              lastName={user.lastName}
              role={user.role}
              status={user.status}
              id={user._id}
              onDelete={() => handleDelete(user._id)}
            />
          ))}
        </div>
      ) : (
        <div className="h-[60vh] flex items-center justify-center">
          <p className="text-sm font-normal">No Users Found</p>
        </div>
      )}
      {modal && (
        <Modal
          success={delUser.isError ? false : true}
          message={delUser.isError ? delUser.error.message : delUser.data}
          action={() => showModal(false)}
        />
      )}
    </>
  );
};

export default UsersParent;
