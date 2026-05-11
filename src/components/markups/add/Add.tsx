import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Input from "../../input/Input";
import Button from "../../button/Button";
import Modal from "../../modal/Modal";
import PageLoader from "../../loader/PageLoader";
import { getMarkups, updateMarkup } from "../../../hooks/markups/markups";
import {
  editMarkupSchema,
  type editMarkupData,
} from "../../../types/markups/editMarkupTypes";

interface Markup {
  _id: string;
  currencyPair: string;
  spread: number;
  markUp: number;
  updatedAt: string;
}

const AddMarkup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: markupsData, isLoading } = useQuery({
    queryKey: ["markups"],
    queryFn: () => getMarkups(),
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
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const mutation = useMutation({
    mutationFn: (data: editMarkupData) => {
      const allMarkups = [...(markupsData?.markups || [])];

      const cleanedMarkups = allMarkups.map((markup: Markup) => ({
        currencyPair: markup.currencyPair,
        spread: markup.spread.toString(),
        markUp: markup.markUp.toString(),
      }));

      const newMarkup = {
        currencyPair: data.currencyPair,
        spread: data.spread,
        markUp: data.markUp,
      };

      const updatedMarkupsArray = [...cleanedMarkups, newMarkup];

      return updateMarkup(updatedMarkupsArray);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["markups"], exact: false });
      reset();
      navigate("/company/markups");
    },
  });

  const onSubmit = (data: editMarkupData) => {
    mutation.mutate(data);
  };

  if (isLoading) return <PageLoader />;

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
            title="Add Markup"
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-white duration-300 mt-4"
          />
        </form>
      </FormProvider>

      {mutation.isError && (
        <Modal
          success={false}
          action={() => navigate("/markups")}
          message={mutation.error.message}
        />
      )}

      {mutation.isSuccess && !mutation.isError && (
        <Modal
          success={true}
          action={() => navigate("/markups")}
          message="Markup added successfully"
        />
      )}
    </>
  );
};

export default AddMarkup;
