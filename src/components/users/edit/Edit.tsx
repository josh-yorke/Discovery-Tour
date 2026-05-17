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
import { useState, useEffect } from "react";
import AllowedActionsInputs from "../AllowedActions";
import EmailReceiverSetterInputs from "../EmailReceiverSetter.tsx";

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
  allowedActions,
  receiveEmailFrom,
}: EditInputsProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorModal, showErrorModal] = useState(false);
  const [logoutModal, showLogoutModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser?._id;

  const {
    register,
    handleSubmit,
    reset,
    watch,
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
      allowedActions: allowedActions,
      receiveEmailFrom: receiveEmailFrom,
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

      console.log(`${currentUserId}, ${id}`);

      if (currentUserId === id) {
        showLogoutModal(true);
      } else {
        navigate(-1);
      }

      reset();
    },
    onError: (error) => {
      setErrorMessage(
        error.message || "Failed to update user. Please try again.",
      );
      showErrorModal(true);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    showLogoutModal(false);
    navigate("/login");
  };

  const onSubmit: SubmitHandler<editUserData> = (data) => {
    mutation.mutate({ id, data });
  };

  useEffect(() => {
    if (mutation.isError && !errorModal) {
      setErrorMessage(
        mutation.error?.message || "An unexpected error occurred",
      );
      showErrorModal(true);
    }
  }, [mutation.isError, mutation.error, errorModal]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
      >
        <div className="w-full grid grid-cols-1 gap-4">
          <Input
            style="bg-white"
            disabled={mutation.isPending}
            title="First Name"
            type="text"
            placeholder="enter your first name"
            error={errors.firstName ? errors.firstName.message : ""}
            {...register("firstName")}
          />
          <Input
            style="bg-white"
            disabled={mutation.isPending}
            title="Last Name"
            type="text"
            placeholder="enter your last name"
            error={errors.lastName ? errors.lastName.message : ""}
            {...register("lastName")}
          />
          <Input
            style="bg-white"
            disabled={mutation.isPending}
            title="Email"
            type="email"
            placeholder="enter your email"
            error={errors.email ? errors.email.message : ""}
            {...register("email")}
          />
          <PasswordInput
            style="bg-white"
            title="Password"
            placeholder="enter your password"
            error={errors.password ? errors.password.message : ""}
            {...register("password")}
          />

          <div className="w-full">
            <InputOption
              disabled={mutation.isPending}
              options={["admin", "staff", "user"]}
              {...register("role")}
              style="w-full bg-white"
              title="Role"
            />
            {errors.role && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* ALLOWED ACTIONS */}
          <AllowedActionsInputs
            register={register}
            watch={watch}
            reset={reset}
          />

          {/* Receiver SETTERS */}
          <EmailReceiverSetterInputs
            register={register}
            watch={watch}
            reset={reset}
          />

          {/* InputOption with error display */}
          <div className="w-full">
            <InputOption
              disabled={mutation.isPending}
              options={["active", "pending"]}
              {...register("status")}
              style="w-full bg-white"
              title="Status"
            />
            {errors.status && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.status.message}
              </p>
            )}
          </div>

          <Button
            isLoading={mutation.isPending}
            title="Update"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </div>
      </form>

      {errorModal && (
        <Modal
          success={false}
          action={() => {
            showErrorModal(false);
            setErrorMessage("");
          }}
          message={errorMessage}
        />
      )}

      {logoutModal && (
        <div className="w-full h-screen fixed top-0 left-0 bg-black/10 z-sticky2 flex items-center justify-center">
          <div className="w-80 bg-white flex flex-col items-center justify-center text-sm p-6 rounded-lg gap-6">
            <div className="w-full flex flex-row items-center justify-between">
              <p className="text-[#1d2087] text-xs font-semibold">
                Confirm Logout
              </p>
            </div>
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <p className="text-center">
                You have updated your own account. You will need to log in
                again.
              </p>
              <div className="w-full flex flex-row gap-3 mt-2">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-[#1d2087] hover:bg-[#3b3eac] text-white rounded-lg font-medium duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Edit;
