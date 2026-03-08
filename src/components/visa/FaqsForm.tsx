import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { type addFaqData } from "../../types/faqs/addFaqsTypes";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";

export interface FaqsFormHandle {
  getFormData: () => Promise<addFaqData[] | null>;
}

const hasFaqContent = (faq: {
  question?: string;
  answer?: string;
}): boolean => {
  return (
    (faq.question?.trim() ?? "").length > 0 ||
    (faq.answer?.trim() ?? "").length > 0
  );
};

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

type FaqSchemaType = {
  question: string;
  answer: string;
};

type FormData = { faqs: FaqSchemaType[] };

const DEFAULT_FAQ: FaqSchemaType = {
  question: "",
  answer: "",
};

const FaqsForm = forwardRef<FaqsFormHandle>((_props, ref) => {
  const {
    register,
    control,
    formState: { errors },
    watch,
    getValues,
    clearErrors,
    setError,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: { faqs: [DEFAULT_FAQ] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "faqs",
  });

  const watchFaqs = watch("faqs");

  const validateAndGetFormData = useCallback(() => {
    const values = getValues();
    const faqData: addFaqData[] = [];
    let isValid = true;

    clearErrors();

    values.faqs.forEach((faq, index) => {
      const hasContent = hasFaqContent(faq);

      if (hasContent) {
        const result = faqSchema.safeParse(faq);

        if (!result.success) {
          isValid = false;
          result.error.issues.forEach((issue) => {
            const path = issue.path[0];
            if (typeof path === "string") {
              setError(`faqs.${index}.${path}` as any, {
                type: "manual",
                message: issue.message,
              });
            }
          });
        } else {
          faqData.push({
            question: result.data.question,
            answer: result.data.answer,
          });
        }
      }
    });

    return { isValid, faqData };
  }, [getValues, setError, clearErrors]);

  const addFaq = useCallback(() => {
    append(DEFAULT_FAQ);
  }, [append]);

  const removeFaq = useCallback(
    (index: number) => {
      remove(index);
      clearErrors(`faqs.${index}` as any);
    },
    [remove, clearErrors],
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, faqData } = validateAndGetFormData();

      if (!isValid || faqData.length === 0) {
        return null;
      }

      return faqData;
    },
  }));

  const renderFaqForm = (field: { id: string }, index: number) => {
    const currentFaq = watchFaqs?.[index];
    const hasContent = hasFaqContent(currentFaq);
    const questionError = errors.faqs?.[index]?.question?.message;
    const answerError = errors.faqs?.[index]?.answer?.message;

    return (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center border-b border-gray-200 pb-6 last:border-0"
      >
        {fields.length >= 1 && (
          <IconButton
            action={() => removeFaq(index)}
            style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
          />
        )}

        <div className="w-full flex flex-col gap-4">
          <Input
            style="bg-white"
            disabled={false}
            error={hasContent && questionError ? String(questionError) : ""}
            title="Question *"
            placeholder="Enter frequently asked question"
            type="text"
            {...register(`faqs.${index}.question` as const)}
          />

          <TextArea
            disabled={false}
            error={hasContent && answerError ? String(answerError) : ""}
            title="Answer *"
            placeholder="Enter detailed answer to the question"
            {...register(`faqs.${index}.answer` as const)}
          />

          <div className="text-xs text-gray-500">
            <p>• Fields marked with * are required</p>
            <p>• Both question and answer must be filled out</p>
            <p>• You can add multiple FAQs using the + button</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="relative w-full flex justify-center">
        <IconButton
          action={addFaq}
          style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="Add FAQ"
          icon={<RiAddFill size={16} />}
        />
      </div>

      <div className="w-full space-y-6">{fields.map(renderFaqForm)}</div>
    </div>
  );
});

FaqsForm.displayName = "FaqsForm";
export default FaqsForm;
