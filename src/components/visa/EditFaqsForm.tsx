import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import {
  type addFaqData,
  type editFaqData,
} from "../../types/faqs/addFaqsTypes";
import Input from "../input/Input";
import TextArea from "../input/TextArea";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import FormattedLinkInput from "../input/FormattedLinkInput";

export interface FaqsFormHandle {
  getFormData: () => Promise<addFaqData[] | null>;
  removeFaqField: (index: number) => void;
}

interface FaqsFormProps {
  editData?: editFaqData[];
  onDeleteFaq?: (faqId: string, index: number) => void;
  isDeleting?: boolean;
}

interface FormattedLink {
  title: string;
  link: string;
}

interface FaqSchemaType {
  question: string;
  answer: string;
  formattedLinks: FormattedLink[];
}

type FormData = { faqs: FaqSchemaType[] };

const DEFAULT_FAQ: FaqSchemaType = {
  question: "",
  answer: "",
  formattedLinks: [],
};

const formattedLinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().url("Must be a valid URL").min(1, "URL is required"),
});

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  formattedLinks: z.array(formattedLinkSchema).default([]),
});

const hasFaqContent = (faq: {
  question?: string;
  answer?: string;
}): boolean => {
  return (
    (faq.question?.trim() ?? "").length > 0 ||
    (faq.answer?.trim() ?? "").length > 0
  );
};

const hasCompleteFaq = (faq: {
  question?: string;
  answer?: string;
}): boolean => {
  return (
    (faq.question?.trim() ?? "").length > 0 &&
    (faq.answer?.trim() ?? "").length > 0
  );
};

const mapEditDataToDefaultValues = (
  editData: editFaqData[],
): FaqSchemaType[] => {
  if (!editData || editData.length === 0) return [DEFAULT_FAQ];

  return editData.map((data) => ({
    question: data?.question || "",
    answer: data?.answer || "",
    formattedLinks: data?.formattedLinks || [],
  }));
};

const EditFaqsForm = forwardRef<FaqsFormHandle, FaqsFormProps>(
  ({ editData = [], onDeleteFaq }, ref) => {
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
      defaultValues: {
        faqs: mapEditDataToDefaultValues(editData),
      },
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
        const hasCompleteData = hasCompleteFaq(faq);

        if (hasContent) {
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
          }

          if (hasCompleteData) {
            faqData.push({
              question: faq.question,
              answer: faq.answer,
              formattedLinks: faq.formattedLinks || [],
            });
          } else if (hasContent && !hasCompleteData) {
            isValid = false;
            if (!faq.question?.trim()) {
              setError(`faqs.${index}.question` as any, {
                type: "manual",
                message: "Question is required",
              });
            }
            if (!faq.answer?.trim()) {
              setError(`faqs.${index}.answer` as any, {
                type: "manual",
                message: "Answer is required",
              });
            }
          }
        }
      });

      console.log(
        "EditFaqsForm - Final data:",
        JSON.stringify(faqData, null, 2),
      );

      return { isValid, faqData };
    }, [getValues, setError, clearErrors]);

    const addFaq = useCallback(() => {
      append(DEFAULT_FAQ);
    }, [append]);

    const removeFaq = useCallback(
      (index: number) => {
        const faqItem = editData[index];
        if (faqItem?._id && onDeleteFaq) {
          onDeleteFaq(faqItem._id, index);
        } else {
          remove(index);
          clearErrors(`faqs.${index}` as any);
        }
      },
      [remove, editData, onDeleteFaq, clearErrors],
    );

    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const { isValid, faqData } = validateAndGetFormData();

        if (!isValid) {
          return null;
        }

        if (faqData.length === 0) {
          return [];
        }

        return faqData;
      },
      removeFaqField: (index: number) => {
        remove(index);
      },
    }));

    const renderFaqForm = (field: { id: string }, index: number) => {
      const currentFaq = watchFaqs?.[index];
      const hasContent = hasFaqContent(currentFaq);
      const questionError = errors.faqs?.[index]?.question?.message;
      const answerError = errors.faqs?.[index]?.answer?.message;
      const formattedLinksErrors = errors.faqs?.[index]?.formattedLinks;

      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center border-b border-gray-200 pb-6 last:border-0"
        >
          {fields.length >= 1 && (
            <IconButton
              action={() => removeFaq(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
              title="Remove FAQ"
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

            <FormattedLinkInput
              control={control}
              register={register}
              errors={formattedLinksErrors || {}}
              faqIndex={index}
            />
          </div>
        </div>
      );
    };

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6">
        <div className="w-full flex justify-center">
          <IconButton
            action={addFaq}
            style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="Add FAQ"
            icon={<RiAddFill size={16} />}
          />
        </div>

        {fields.map(renderFaqForm)}
      </div>
    );
  },
);

EditFaqsForm.displayName = "EditFaqsForm";
export default EditFaqsForm;
