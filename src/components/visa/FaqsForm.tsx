import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { type addFaqData } from "../../types/faqs/addFaqsTypes";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import FormattedLinkInput from "../input/FormattedLinkInput";

export interface FaqsFormHandle {
  getFormData: () => Promise<addFaqData[] | null>;
}

interface FormattedLink {
  title: string;
  link: string;
}

interface FaqFormData {
  question: string;
  answer: string;
  formattedLinks: FormattedLink[];
}

type FormData = { faqs: FaqFormData[] };

const DEFAULT_FAQ: FaqFormData = {
  question: "",
  answer: "",
  formattedLinks: [],
};

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  formattedLinks: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        link: z.string().url("Must be a valid URL").min(1, "URL is required"),
      }),
    )
    .default([]),
});

const FaqsForm = forwardRef<FaqsFormHandle>((_props, ref) => {
  const {
    register,
    control,
    formState: { errors },
    getValues,
    clearErrors,
    setError,
  } = useForm<FormData>({
    defaultValues: { faqs: [DEFAULT_FAQ] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "faqs",
  });

  const validateAndGetData = useCallback((): {
    isValid: boolean;
    data: addFaqData[];
  } => {
    const values = getValues();
    const validFaqs: addFaqData[] = [];
    let isValid = true;

    clearErrors();

    // Filter and validate only FAQs with content
    values.faqs.forEach((faq, index) => {
      const hasContent = faq.question?.trim() || faq.answer?.trim();

      if (!hasContent) return;

      const result = faqSchema.safeParse(faq);

      if (!result.success) {
        isValid = false;
        result.error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          setError(`faqs.${index}.${path}` as any, {
            type: "manual",
            message: issue.message,
          });
        });
      } else {
        validFaqs.push({
          question: result.data.question,
          answer: result.data.answer,
          formattedLinks: result.data.formattedLinks || [],
        });
      }
    });

    return { isValid, data: validFaqs };
  }, [getValues, setError, clearErrors]);

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, data } = validateAndGetData();
      return isValid && data.length > 0 ? data : null;
    },
  }));

  return (
    <div className="w-full flex flex-col gap-6">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="w-full border-b border-gray-200 pb-6 last:border-0"
        >
          <div className="flex justify-end mb-4">
            {fields.length > 1 && (
              <IconButton
                action={() => remove(index)}
                style="bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-lg"
                title="Remove FAQ"
                icon={<RiDeleteBin4Fill size={16} />}
              />
            )}
          </div>

          <div className="space-y-4">
            <Input
              style="bg-white"
              disabled={false}
              error={errors.faqs?.[index]?.question?.message}
              title="Question *"
              placeholder="Enter frequently asked question"
              type="text"
              {...register(`faqs.${index}.question`)}
            />

            <TextArea
              disabled={false}
              error={errors.faqs?.[index]?.answer?.message}
              title="Answer *"
              placeholder="Enter detailed answer"
              {...register(`faqs.${index}.answer`)}
            />

            <FormattedLinkInput
              control={control}
              register={register}
              errors={errors.faqs?.[index]?.formattedLinks}
              faqIndex={index}
            />
          </div>
        </div>
      ))}

      <div className="fixed bottom-6 right-6">
        <IconButton
          action={() => append(DEFAULT_FAQ)}
          style="bg-[#1d2087] hover:bg-[#3b3eac] text-white px-6 py-3 rounded-lg"
          title="Add FAQ"
          icon={<RiAddFill size={16} />}
        />
      </div>
    </div>
  );
});

FaqsForm.displayName = "FaqsForm";
export default FaqsForm;
