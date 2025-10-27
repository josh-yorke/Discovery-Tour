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

const Add = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"], exact: false });
      navigate("/news");
      reset();
    },
  });

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

    mutation.mutate(formData);
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
          <div className="w-full grid grid-cols-1 gap-4 items-start justify-start">
            <Input
              disabled={false}
              error={errors.title?.message || ""}
              title="Title"
              placeholder="news title"
              type="text"
              {...register("title")}
            />
            <TextArea
              disabled={false}
              error={errors.contents?.message || ""}
              title="Contents"
              placeholder="news contents"
              {...register("contents")}
            />
            <InputOption
              disabled={false}
              style="bg-black/6 w-full"
              title="Status"
              options={["published", "draft"]}
              {...register("status")}
            />
            <TagsInput
              error={errors.tags?.[0]?.message || ""}
              disabled={false}
            />
            <ImageInput
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
    </>
  );
};

export default Add;
