import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { RiAddLine } from "react-icons/ri";
import ImageInput from "../../input/ImageInput";
import { fetchImageFiles } from "../../../utils/fetchImageFiles";

interface TagsProps {
  error: string | undefined;
  disabled: boolean;
}

const EditAwards = ({ disabled, error }: TagsProps) => {
  const { control, register, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "awards",
  });

  const awards = watch("awards");

  // ✅ Fetch and attach images per award
  useEffect(() => {
    const loadAwardImages = async () => {
      if (!awards || awards.length === 0) return;

      for (let i = 0; i < awards.length; i++) {
        const award = awards[i];
        if (award?.image && typeof award.image === "string") {
          try {
            const [file] = await fetchImageFiles([award.image]);
            setValue(`awards.${i}.image`, [file]); // store as File[]
          } catch (err) {
            console.error("Error fetching award image:", err);
          }
        }
      }
    };

    loadAwardImages();
  }, [awards, setValue]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex flex-row gap-2 items-center justify-start">
        {!disabled && (
          <button
            type="button"
            onClick={() => append({ description: "", date: "", image: [] })}
            className="p-2 rounded-lg bg-black/5 cursor-pointer"
          >
            <RiAddLine size={16} />
          </button>
        )}
        <p className="text-sm font-semibold">Awards</p>
      </div>

      {fields.map((field, index) => {
        const dateValue = awards?.[index]?.date
          ? awards[index].date.slice(0, 10)
          : "";

        return (
          <div
            key={field.id}
            className="w-full flex flex-col gap-2 border border-gray-200 rounded-lg p-3"
          >
            <input
              disabled={disabled}
              type="text"
              className="text-sm font-normal bg-black/5 rounded-lg px-4 py-3 w-full"
              placeholder="Award description"
              {...register(`awards.${index}.description`)}
            />
            <input
              disabled={disabled}
              type="date"
              className="text-sm font-normal bg-black/5 rounded-lg px-4 py-3 w-full"
              value={dateValue}
              onChange={(e) => setValue(`awards.${index}.date`, e.target.value)}
            />
            <ImageInput
              title="Award Image"
              error=""
              disabled={disabled}
              register={register}
              setValue={(files) => setValue(`awards.${index}.image`, files)}
              initialFiles={awards?.[index]?.image || []}
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-3 rounded-lg bg-[#1d2087] hover:bg-[#3b3eac] duration-300 cursor-pointer text-white text-sm font-normal"
              >
                Delete
              </button>
            )}
          </div>
        );
      })}

      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export default EditAwards;
