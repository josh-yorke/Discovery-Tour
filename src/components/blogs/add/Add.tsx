import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Input from "../../../components/input/Input";
import TagsInput from "../../../components/input/TagsInput";
import InputOption from "../../../components/input/InputOption";
import TextArea from "../../../components/input/TextArea";
import ImageInput from "../../input/ImageInput";
import Button from "../../button/Button";
import {
  addBlogSchema,
  type addBlogData,
} from "../../../types/blogs/addBlogTypes";
import { addBlog } from "../../../hooks/blogs/addBlog";
import RelatedLinksInput from "../../input/RelatedLinksInput";
import { useState } from "react";
import Modal from "../../modal/Modal";

const Add = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [message, showMessage] = useState<string | null>(null);

  const methods = useForm<addBlogData>({
    resolver: zodResolver(addBlogSchema),
    defaultValues: {
      tags: [""],
      relatedLinks: [""],
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const mutation = useMutation<string, Error, globalThis.FormData>({
    mutationFn: addBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"], exact: false });
      navigate("/blogs");
      reset();
    },
    onError: (error) => {
      showMessage(error.message);
    },
  });

  const onSubmit = (data: addBlogData) => {
    const formData = new globalThis.FormData();

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

    mutation.mutate(formData);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log(err);
          })}
          className="w-full lg:w-2xl min-h-svh flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
            <Input
              style="bg-white"
              disabled={false}
              error={errors.title?.message || ""}
              title="Title"
              placeholder="blog title"
              type="text"
              {...register("title")}
            />
            <TextArea
              disabled={false}
              error={errors.contents?.message || ""}
              title="Contents"
              placeholder="blog contents"
              {...register("contents")}
            />
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Status"
              options={["published", "draft"]}
              {...register("status")}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={errors.readingTimeValue?.message || ""}
              title="Reading Time Value"
              placeholder="reading time value"
              type="number"
              {...register("readingTimeValue", { valueAsNumber: true })}
            />
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Reading Time Unit"
              options={["second(s)", "minute(s)", "hour(s)"]}
              {...register("readingTimeUnit")}
            />
            <TagsInput
              error={errors.tags?.[0]?.message || ""}
              disabled={false}
            />
            <RelatedLinksInput
              error={errors.relatedLinks?.[0]?.message || ""}
              disabled={false}
            />
            <ImageInput
              title="Images"
              disabled={false}
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
              title="Add blog"
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
            />
          </div>
        </form>
      </FormProvider>
      {message && (
        <Modal
          message={message}
          success={mutation.isSuccess}
          action={() => {
            showMessage(null);
          }}
        />
      )}
    </>
  );
};

export default Add;
