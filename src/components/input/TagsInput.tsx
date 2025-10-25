import { useFieldArray, useFormContext } from "react-hook-form";
import { RiAddLine, RiDeleteBin2Line } from "react-icons/ri";

interface TagsProps {
  error: string | undefined;
}

const TagsInput = ({ error }: TagsProps) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-row gap-2 items-center justify-start">
        <button
          type="button"
          onClick={() => append("")}
          className="p-2 rounded-lg bg-black/5 cursor-pointer"
        >
          <RiAddLine size={16} />
        </button>
        <p className="text-sm font-semibold">Tags</p>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="w-full flex gap-2 items-center">
          <input
            type="text"
            className="text-sm font-normal bg-black/5 rounded-lg px-6 py-3 w-full"
            placeholder="enter a tag"
            {...register(`tags.${index}`)}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="p-3 rounded-lg bg-gray-100 cursor-pointer"
          >
            <RiDeleteBin2Line size={16} />
          </button>
        </div>
      ))}
      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export default TagsInput;
