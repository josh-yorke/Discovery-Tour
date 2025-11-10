import { useNavigate } from "react-router";
import Button from "../../button/Button";
import Input from "../../input/Input";
import InputOption from "../../input/InputOption";
import PasswordInput from "../../input/PasswordInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editUserSchema,
  type editUserData,
} from "../../../types/users/editUserTypes";
import { updateUser } from "../../../hooks/users/updateUser";
import Modal from "../../modal/Modal";
import { useState } from "react";

interface EditInputsProps extends editUserData {
  id: string;
}

const Edit = ({
  firstName,
  lastName,
  email,
  password,
  role,
  status,
  id,
}: EditInputsProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modal, showModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<editUserData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      status: status,
      firstName: firstName,
      lastName: lastName,
      password: password,
      email: email,
      role: role,
    },
  });

  const mutation = useMutation<
    string,
    Error,
    { id: string; data: editUserData }
  >({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["user", variables.id],
        exact: false,
      });
      navigate("/users");
      reset();
    },
    onError: () => {
      showModal(true);
    },
  });

  const onSubmit: SubmitHandler<editUserData> = (data) => {
    mutation.mutate({ id, data });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full min-h-[100svh] flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
      >
        <div className="w-full grid grid-cols-1 gap-4">
          <Input
            disabled={false}
            title="First Name"
            type="text"
            placeholder="enter your first name"
            error={errors.firstName ? errors.firstName.message : ""}
            {...register("firstName")}
          />
          <Input
            disabled={false}
            title="Last Name"
            type="text"
            placeholder="enter your last name"
            error={errors.lastName ? errors.lastName.message : ""}
            {...register("lastName")}
          />
          <Input
            disabled={false}
            title="Email"
            type="email"
            placeholder="enter your email"
            error={errors.email ? errors.email.message : ""}
            {...register("email")}
          />
          <PasswordInput
            title="Password"
            placeholder="enter your password"
            error={errors.password ? errors.password.message : ""}
            {...register("password")}
          />
          <InputOption
            disabled={false}
            options={["admin", "user"]}
            {...register("role")}
            style="w-full bg-white"
            title="Role"
          />
          <InputOption
            disabled={false}
            options={["active", "pending"]}
            {...register("status")}
            style="w-full bg-white"
            title="Status"
          />
          <Button
            isLoading={mutation.isPending}
            title="Update"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </div>
      </form>
      {modal && mutation.isError && (
        <Modal
          success={!mutation.isError}
          action={() => showModal(false)}
          message={mutation.error.message}
        />
      )}
    </>
  );
};

export default Edit;
