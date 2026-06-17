import { useFieldArray } from "react-hook-form";
import { RiAddLine, RiDeleteBin2Line } from "react-icons/ri";
import Input from "./Input";
import { useEffect } from "react";

interface FormattedLinkInputProps {
  control: any;
  register: any;
  errors: any;
  faqIndex: number;
  disabled?: boolean;
  fieldName?: string;
  fieldKey?: string;
  defaultValues?: any[]; // ✅ Add this prop
}

const FormattedLinkInput = ({
  control,
  register,
  errors,
  faqIndex,
  disabled = false,
  fieldName = "faqs",
  fieldKey = "formattedLinks",
  defaultValues = [],
}: FormattedLinkInputProps) => {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: `${fieldName}.${faqIndex}.${fieldKey}`,
  });

  // ✅ Initialize with default values when they change
  useEffect(() => {
    if (defaultValues && defaultValues.length > 0 && fields.length === 0) {
      replace(defaultValues);
    }
  }, [defaultValues, replace, fields.length]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-row gap-2 items-center justify-start">
        {!disabled && (
          <button
            type="button"
            onClick={() => append({ title: "", link: "" })}
            className="p-2 rounded-full bg-white cursor-pointer"
          >
            <RiAddLine size={16} />
          </button>
        )}
        <p className="text-sm font-semibold">Formatted Links (Optional)</p>
      </div>

      {fields.map((field, linkIndex) => (
        <div key={field.id} className="w-full flex gap-2 items-center">
          <Input
            style="bg-white flex-1 rounded-full px-6 py-3"
            disabled={disabled}
            error={errors?.[linkIndex]?.title?.message}
            title=""
            placeholder="Link Title"
            type="text"
            {...register(
              `${fieldName}.${faqIndex}.${fieldKey}.${linkIndex}.title`,
            )}
          />

          <Input
            style="bg-white flex-1 rounded-full px-6 py-3"
            disabled={disabled}
            error={errors?.[linkIndex]?.link?.message}
            title=""
            placeholder="https://example.com"
            type="url"
            {...register(
              `${fieldName}.${faqIndex}.${fieldKey}.${linkIndex}.link`,
            )}
          />

          {!disabled && (
            <button
              type="button"
              onClick={() => remove(linkIndex)}
              className="p-3 rounded-full bg-white cursor-pointer"
            >
              <RiDeleteBin2Line size={16} />
            </button>
          )}
        </div>
      ))}

      {errors?.message && (
        <p className="text-xs font-semibold text-red-500">{errors.message}</p>
      )}
    </div>
  );
};

export default FormattedLinkInput;
