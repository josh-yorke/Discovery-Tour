import { FormProvider, useForm } from "react-hook-form";
import {
  addNewsSchema,
  type addNewsData,
} from "../../../types/news/addNewsTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { addNews } from "../../../hooks/news/addNews";
import Input from "../../../components/input/Input";
import TagsInput from "../../../components/input/TagsInput";
import InputOption from "../../../components/input/InputOption";
import TextArea from "../../../components/input/TextArea";
import ImageInput from "../../input/ImageInput";
import Button from "../../button/Button";
import Modal from "../../modal/Modal"; // Import Modal component
import { useState } from "react";
import RelatedLinksInput from "../../input/RelatedLinksInput";

const Add = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [modal, setModal] = useState<{
    message: string;
    isSuccess: boolean;
  } | null>(null);

  const methods = useForm<addNewsData>({
    resolver: zodResolver(addNewsSchema),
    defaultValues: {
      tags: [""],
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const mutation = useMutation<string, Error, FormData>({
    mutationFn: addNews,
    onSuccess: (data) => {
      setModal({
        message: data || "News added successfully!",
        isSuccess: true,
      });
      queryClient.invalidateQueries({ queryKey: ["news"], exact: false });
      reset();
    },
    onError: (error) => {
      setModal({
        message: error.message || "Failed to add news",
        isSuccess: false,
      });
    },
  });

  const handleModalClose = () => {
    setModal(null);
    if (modal?.isSuccess) {
      navigate(-1);
    }
  };

  const onSubmit = (data: addNewsData) => {
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

    data.relatedLinks.forEach((link) => {
      if (link && link.trim() !== "") {
        formData.append("relatedLinks", link);
      }
    });

    const user = localStorage.getItem("user");

    if (!user) {
      setModal({
        message: "No user found in localStorage. Cannot append author.",
        isSuccess: false,
      });
      return;
    }

    try {
      const parsed = JSON.parse(user);

      if (!parsed._id) {
        setModal({
          message: "User object has no _id. Cannot append author.",
          isSuccess: false,
        });
        return;
      }

      formData.append("author", parsed._id);
    } catch (err) {
      setModal({
        message: "Failed to parse user from localStorage",
        isSuccess: false,
      });
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
          className="w-full lg:w-2xl min-h-screen flex flex-col items-center justify-start p-6 gap-6 bg-gray-100"
        >
          <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
            <Input
              style="bg-white"
              disabled={false}
              error={errors.title?.message || ""}
              title="Title"
              placeholder="news title"
              type="text"
              {...register("title")}
            />

            {/* Status InputOption with error display */}
            <div className="w-full">
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Status"
                options={["published", "draft"]}
                {...register("status")}
              />
              {errors.status && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            <TextArea
              disabled={false}
              error={errors.contents?.message || ""}
              title="Contents"
              placeholder="news contents"
              {...register("contents")}
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
              title="Add news"
              style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
            />
          </div>
        </form>
      </FormProvider>

      {modal && (
        <Modal
          message={modal.message}
          success={modal.isSuccess}
          action={handleModalClose}
        />
      )}
    </>
  );
};

export default Add;
