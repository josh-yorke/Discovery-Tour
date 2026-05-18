import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import Input from "../../input/Input";
import Button from "../../button/Button";
import Modal from "../../modal/Modal";
import PageLoader from "../../loader/PageLoader";
import { getMarkups, updateMarkup } from "../../../hooks/markups/markups";
import {
  editMarkupSchema,
  type editMarkupData,
} from "../../../types/markups/editMarkupTypes";
import type { markupData } from "../../../types/markups/markupDataTypes";

interface Markup {
  _id: string;
  currencyPair: string;
  spread: number;
  markUp: number;
  updatedAt: string;
}

const EditMarkup = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: markupsData, isLoading } = useQuery({
    queryKey: ["markups"],
    queryFn: () => getMarkups(),
    enabled: !!id,
  });

  const methods = useForm<editMarkupData>({
    resolver: zodResolver(editMarkupSchema),
    defaultValues: {
      currencyPair: "",
      spread: "",
      markUp: "",
    },
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (!markupsData?.markups || !id) return;

    const currentMarkup = markupsData.markups.find(
      (markup: Markup) => markup._id === id,
    );

    if (currentMarkup) {
      reset({
        currencyPair: currentMarkup.currencyPair || "",
        spread: currentMarkup.spread.toString() || "",
        markUp: currentMarkup.markUp.toString() || "",
      });
    }
  }, [markupsData, id, reset]);

  const mutation = useMutation({
    mutationFn: (data: editMarkupData) => {
      if (!id) throw new Error("No markup ID found");

      const allMarkups = [...(markupsData?.markups || [])];

      const updatedMarkup: markupData = {
        _id: id,
        currencyPair: data.currencyPair,
        spread: data.spread,
        markUp: data.markUp,
      };

      const filteredMarkups = allMarkups.filter((m: Markup) => m._id !== id);

      const cleanedMarkups: markupData[] = filteredMarkups.map(
        (markup: Markup) => ({
          _id: markup._id,
          currencyPair: markup.currencyPair,
          spread: markup.spread.toString(),
          markUp: markup.markUp.toString(),
        }),
      );

      const updatedMarkupsArray: markupData[] = [
        ...cleanedMarkups,
        updatedMarkup,
      ];

      return updateMarkup(updatedMarkupsArray);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markups"], exact: false });
      navigate("/company/markups");
    },
  });

  const onSubmit = (data: editMarkupData) => {
    mutation.mutate(data);
  };

  if (isLoading) return <PageLoader />;

  const currentMarkup = markupsData?.markups?.find(
    (markup: Markup) => markup._id === id,
  );

  if (!currentMarkup) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-sm font-normal">No markup data found</p>
      </div>
    );
  }

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-2xl flex flex-col items-center justify-center p-6 gap-6"
        >
          <Input
            style="bg-white"
            disabled={false}
            title="Currency Pair"
            placeholder="e.g., EUR/USD"
            type="text"
            {...register("currencyPair")}
            error={errors.currencyPair?.message || ""}
          />
          <Input
            style="bg-white"
            disabled={false}
            title="Spread"
            placeholder="e.g., 2.5"
            type="text"
            {...register("spread")}
            error={errors.spread?.message || ""}
          />
          <Input
            style="bg-white"
            disabled={false}
            title="Markup"
            placeholder="e.g., 1.5%"
            type="text"
            {...register("markUp")}
            error={errors.markUp?.message || ""}
          />

          <Button
            isLoading={mutation.isPending}
            title="Update Markup"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </form>
      </FormProvider>

      {mutation.isError && (
        <Modal
          success={false}
          action={() => navigate("/company/markups")}
          message={mutation.error.message}
        />
      )}

      {mutation.isSuccess && !mutation.isError && (
        <Modal
          success={true}
          action={() => navigate("/company/markups")}
          message="Markup updated successfully"
        />
      )}
    </>
  );
};

export default EditMarkup;
