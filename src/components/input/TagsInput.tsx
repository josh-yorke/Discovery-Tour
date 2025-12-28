import { useFieldArray, useFormContext } from "react-hook-form";
import { RiAddLine, RiDeleteBin2Line } from "react-icons/ri";

interface TagsProps {
  error: string | undefined;
  disabled: boolean;
}

const TagsInput = ({ disabled, error }: TagsProps) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
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
        <p className="text-sm font-semibold">Tags</p>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="w-full flex gap-2 items-center">
          <input
            disabled={disabled}
            type="text"
            className="text-sm font-normal bg-white rounded-full px-6 py-3 w-full"
            placeholder="enter a tag"
            {...register(`tags.${index}`)}
          />
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

export default TagsInput;
