import { useNavigate } from "react-router";
import Input from "../../../components/input/Input";
import PasswordInput from "../../../components/input/PasswordInput";
import Modal from "../../../components/modal/Modal";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  addUserSchema,
  type addUserData,
} from "../../../types/users/addUserTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyEmail } from "../../../hooks/auth/verifyEmail";
import { useState } from "react";
import VerifyEmail from "../../../components/users/add/VerifyEmail";
import { addUser } from "../../../hooks/users/addUser";
import Button from "../../button/Button";
import InputOption from "../../input/InputOption";

const Add = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [verifyModal, showVerifyModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<addUserData>({
    resolver: zodResolver(addUserSchema),
  });

  const emailMutation = useMutation({
    mutationFn: (email: string) => verifyEmail(email),
    onSuccess: (res) => {
      console.log(res?.code);
      showVerifyModal(true);
    },
  });

  const emailSubmit = (data: addUserData) => {
    emailMutation.mutate(data.email);
  };

  const addMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      navigate("/users");
      reset();
    },
  });

  const onSubmit: SubmitHandler<addUserData> = (data) => {
    addMutation.mutate(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(emailSubmit)}
        className="w-full min-h-[100svh] flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
      >
        <div className="w-full lg:w-2xl grid grid-cols-1 gap-4 items-start justify-center">
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
            isLoading={emailMutation.isPending}
            title="Proceed"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </div>
      </form>
      {verifyModal && (
        <VerifyEmail
          onVerify={() => handleSubmit(onSubmit)()}
          code={emailMutation.data?.code}
          action={() => showVerifyModal(false)}
          message={emailMutation.data?.message}
        />
      )}
      {emailMutation.isError && (
        <Modal
          success={!emailMutation.isError}
          action={() => navigate("/users")}
          message={emailMutation.error.message}
        />
      )}
    </>
  );
};

export default Add;
