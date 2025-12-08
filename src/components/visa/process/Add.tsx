import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  addProcessSchema,
  type addProcessData,
} from "../../../types/process/addProcessTypes";
import { addProcess } from "../../../hooks/visa/process/addProcess";
import TextArea from "../../input/TextArea";
import Input from "../../input/Input";
import Button from "../../button/Button";

const Add = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const methods = useForm<addProcessData>({
    resolver: zodResolver(addProcessSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const getStoredIds = () => {
    const visaId = localStorage.getItem("visaId") || "";
    const fileId = localStorage.getItem("fileId") || "";
    return { visaId, fileId };
  };

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: addProcess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricelist"], exact: false });
      navigate("/visas/pricelist");
      reset();
    },
  });

  const onSubmit = (data: addProcessData) => {
    const { visaId, fileId } = getStoredIds();
    console.log(visaId);

    if (!visaId) {
      console.error("No visaId found in localStorage");

      return;
    }

    const formData = new FormData();

    formData.append("type", "process");
    formData.append("processTitle", data.processTitle);
    formData.append("process", data.process);
    formData.append("visa", visaId);

    if (fileId) {
      formData.append("fileAssociated", fileId);
    }

    mutation.mutate(formData);
  };

  useEffect(() => {
    const { visaId, fileId } = getStoredIds();
    if (visaId) {
      console.log("Loaded from localStorage - Visa ID:", visaId);
    }
    if (fileId) {
      console.log("Loaded from localStorage - File ID:", fileId);
    }
  }, []);

  return (
    <form
      className="w-full min-h-[100svh] flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
      onSubmit={handleSubmit(onSubmit, (err) => {
        console.log(err);
      })}
    >
      <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
        <Input
          style=""
          disabled={false}
          error={errors.processTitle?.message || ""}
          title="Title"
          placeholder="process title"
          type="text"
          {...register("processTitle")}
        />
        <TextArea
          disabled={false}
          error={errors.process?.message || ""}
          title="process"
          placeholder="process"
          {...register("process")}
        />

        <Button
          isLoading={mutation.isPending}
          title="Add Pricelist"
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
        />
      </div>
    </form>
  );
};

export default Add;
