import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "../../input/Input";
import TagsInput from "../../input/TagsInput";
import TextArea from "../../input/TextArea";
import ImageInput from "../../input/ImageInput";
import Modal from "../../modal/Modal";
import {
  editNewsSchema,
  type editNewsData,
} from "../../../types/news/editNewsTypes";
import InputOption from "../../input/InputOption";
import Button from "../../button/Button";
import { updateNews } from "../../../hooks/news/updateNews";

interface EditInputsProps extends editNewsData {
  id: string;
}

const EditInputs = ({ id, tags, title, contents, images }: EditInputsProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const methods = useForm<editNewsData>({
    resolver: zodResolver(editNewsSchema),
    defaultValues: {
      tags: tags,
      title: title,
      contents: contents,
      images: images,
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
    mutationFn: ({ id, data }) => updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["news", id] });
      navigate(`/news`);
      reset();
    },
  });

  const onSubmit = (data: editNewsData) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("contents", data.contents);
    formData.append("status", data.status);

    data.tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    Array.from(data.images).forEach((file: any) => {
      formData.append("images", file);
    });

    const user = localStorage.getItem("user");

    if (!user) {
      console.error("o user found in localStorage. Cannot append author.");
      return;
    }

    try {
      const parsed = JSON.parse(user);

      if (!parsed._id) {
        console.error(" User object has no _id. Cannot append author.");
        return;
      }

      formData.append("author", parsed._id);
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      return;
    }

    mutation.mutate({ id, data: formData });
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log(err);
          })}
          className="w-full flex flex-col items-center justify-center p-6 gap-6"
        >
          <Input
            disabled={false}
            error={errors.title?.message || ""}
            title="Title"
            placeholder="post title"
            type="text"
            {...register("title")}
          />

          <TextArea
            disabled={false}
            title="Contents"
            placeholder="post contents"
            error={errors.contents?.message || ""}
            {...register("contents")}
          />
          <InputOption
            disabled={true}
            options={["draft", "published"]}
            {...register("status")}
            style="w-full bg-black/6"
            title="Status"
          />
          <TagsInput error={errors.tags?.[0]?.message || ""} disabled={false} />
          <ImageInput
            disabled={false}
            initialFiles={images}
            register={register}
            setValue={setValue}
            error={
              typeof errors.images?.message === "string"
                ? errors.images.message
                : ""
            }
          />
          <Button
            isLoading={mutation.isPending}
            title="Update news"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </form>
      </FormProvider>

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

export default EditInputs;
