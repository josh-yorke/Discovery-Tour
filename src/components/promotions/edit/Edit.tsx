import { FormProvider, useForm } from "react-hook-form";
import Input from "../../input/Input";
import TextArea from "../../input/TextArea";
import InputOption from "../../input/InputOption";
import TagsInput from "../../input/TagsInput";
import ImageInput from "../../input/ImageInput";
import Button from "../../button/Button";
import Modal from "../../modal/Modal";
import {
  editPromotionSchema,
  type editPromotionData,
} from "../../../types/promotions/editPromotionTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { updatePromotion } from "../../../hooks/promotions/updatePromotion";

interface EditInputsProps extends editPromotionData {
  id: string;
}

const Edit = ({ id, tags, title, contents, images }: EditInputsProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const methods = useForm<editPromotionData>({
    resolver: zodResolver(editPromotionSchema),
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
    mutationFn: ({ id, data }) => updatePromotion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["promotion", id] });
      navigate(`/promotions`);
      reset();
    },
  });

  const onSubmit = (data: editPromotionData) => {
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
          className="w-full lg:w-2xl min-h-[100svh] flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <Input
            style="bg-white"
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
            disabled={false}
            options={["draft", "published"]}
            {...register("status")}
            style="w-full bg-white"
            title="Status"
          />
          <TagsInput error={errors.tags?.[0]?.message || ""} disabled={false} />
          <ImageInput
            title="images"
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
            title="Update promotion"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </form>
      </FormProvider>

      {mutation.isError && (
        <Modal
          success={mutation.isError}
          action={() => navigate("/promotions")}
          message={mutation.error.message}
        />
      )}
    </>
  );
};

export default Edit;
