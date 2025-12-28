import { useFieldArray, useFormContext } from "react-hook-form";
import { RiAddLine, RiDeleteBin2Line, RiLink } from "react-icons/ri";

interface RelatedLinksInputProps {
  error: string | undefined;
  disabled: boolean;
}

const RelatedLinksInput = ({ disabled, error }: RelatedLinksInputProps) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "relatedLinks",
  });

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-row gap-2 items-center justify-start">
        {!disabled && (
          <button
            type="button"
            onClick={() => append("")}
            className="p-2 rounded-full bg-white cursor-pointer"
          >
            <RiAddLine size={16} />
          </button>
        )}
        <p className="text-sm font-semibold">Related Links</p>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="w-full flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              disabled={disabled}
              type="url"
              className="text-sm font-normal bg-white rounded-full pl-10 pr-6 py-3 w-full"
              placeholder="https://example.com"
              {...register(`relatedLinks.${index}`)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <RiLink size={14} className="text-gray-400" />
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-3 rounded-full bg-white cursor-pointer"
            >
              <RiDeleteBin2Line size={16} />
            </button>
          )}
        </div>
      ))}
      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export default RelatedLinksInput;
