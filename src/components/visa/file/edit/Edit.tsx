import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Input from "../../../input/Input";
import Button from "../../../button/Button";
import FileInput from "../../../input/FileInput";
import {
  addVisaFileSchema,
  type addVisaFileData,
} from "../../../../types/visafile/addVisaFileTypes";
import { updateVisaFile } from "../../../../hooks/visa/file/updateVisaFile";

interface EditProps extends addVisaFileData {
  id: string;
}

const Edit = ({ file, fileTitle, id }: EditProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const methods = useForm<addVisaFileData>({
    resolver: zodResolver(addVisaFileSchema),
    defaultValues: {
      file,
      fileTitle,
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const mutation = useMutation<string, Error, { id: string; data: FormData }>({
    mutationFn: ({ id, data }) => updateVisaFile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"], exact: false });
      navigate("/visas/files");
      reset();
    },
  });
  console.log(file);

  const onSubmit = (data: addVisaFileData) => {
    const formData = new FormData();

    formData.append("type", "file");
    formData.append("fileTitle", data.fileTitle);
    Array.from(data.file).forEach((file: any) => {
      formData.append("file", file);
    });

    mutation.mutate({ id, data: formData });
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log(err);
          })}
          className="w-full min-h-[100svh] flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
            <Input
              disabled={false}
              error={errors.fileTitle?.message || ""}
              title="File Title"
              placeholder="file title"
              type="text"
              {...register("fileTitle")}
            />
            <FileInput
              initialFile={file}
              title="File"
              disabled={false}
              setValue={setValue}
              error={
                typeof errors.file?.message === "string"
                  ? errors.file.message
                  : ""
              }
            />
            <Button
              isLoading={mutation.isPending}
              title="Update Visa File"
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default Edit;
