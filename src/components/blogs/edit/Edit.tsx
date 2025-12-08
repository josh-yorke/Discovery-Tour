import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Input from "../../input/Input";
import TagsInput from "../../input/TagsInput";
import TextArea from "../../input/TextArea";
import ImageInput from "../../input/ImageInput";
import Modal from "../../modal/Modal";
import InputOption from "../../input/InputOption";
import Button from "../../button/Button";
import {
  addBlogSchema,
  type addBlogData,
} from "../../../types/blogs/addBlogTypes";
import RelatedLinksInput from "../../input/RelatedLinksInput";
import { updateBlog } from "../../../hooks/blogs/updateBlog";

interface EditInputsProps extends addBlogData {
  id: string;
}

const EditInputs = ({
  id,
  tags,
  title,
  contents,
  status,
  images,
  readingTimeUnit,
  readingTimeValue,
  relatedLinks,
}: EditInputsProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const methods = useForm<addBlogData>({
    resolver: zodResolver(addBlogSchema),
    defaultValues: {
      tags: tags,
      title: title,
      contents: contents,
      images: images,
      status: status,
      readingTimeUnit,
      readingTimeValue: Number(readingTimeValue),
      relatedLinks,
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
    mutationFn: ({ id, data }) => updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["blogs", id] });
      navigate(`/blogs`);
      reset();
    },
  });

  const onSubmit = (data: addBlogData) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("contents", data.contents);
    formData.append("status", data.status);
    formData.append("readingTimeUnit", data.readingTimeUnit);
    formData.append("readingTimeValue", data.readingTimeValue.toString());

    // Handle relatedLinks safely
    data.relatedLinks.forEach((link) => {
      if (link && link.trim() !== "") {
        formData.append("relatedLinks", link);
      }
    });

    data.tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    Array.from(data.images).forEach((file: any) => {
      formData.append("images", file);
    });

    const user = localStorage.getItem("user");

    if (!user) {
      console.error("No user found in localStorage. Cannot append author.");
      return;
    }

    try {
      const parsed = JSON.parse(user);

      if (!parsed._id) {
        console.error("User object has no _id. Cannot append author.");
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
          <Input
            style="bg-white"
            disabled={false}
            error={errors.readingTimeValue?.message || ""}
            title="Reading Time Value"
            placeholder="reading time value"
            type="number"
            min="1"
            {...register("readingTimeValue", {
              valueAsNumber: true,
            })}
          />
          <InputOption
            disabled={false}
            style="bg-white w-full"
            title="Reading Time Unit"
            options={["second(s)", "minute(s)", "hour(s)"]}
            {...register("readingTimeUnit")}
          />
          <TagsInput error={errors.tags?.[0]?.message || ""} disabled={false} />
          <RelatedLinksInput
            error={errors.relatedLinks?.[0]?.message || ""}
            disabled={false}
          />
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
            title="Update blog"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </form>
      </FormProvider>

      {mutation.isError && (
        <Modal
          success={mutation.isError}
          action={() => navigate("/blogs")}
          message={mutation.error.message}
        />
      )}
    </>
  );
};

export default EditInputs;
