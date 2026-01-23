import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import IconButton from "../../../button/IconButton";
import Input from "../../../input/Input";
import {
  addCitySchema,
  type addCityData,
} from "../../../../types/city/addCity";

export interface CityFormHandle {
  getFormData: () => Promise<{
    cityData: addCityData[];
  } | null>;
}

const hasCityContent = (city: { city?: string }): boolean => {
  return (city.city?.trim() ?? "").length > 0;
};

const citySchema = addCitySchema;

type CitySchemaType = z.infer<typeof citySchema>;
type FormData = { cities: CitySchemaType[] };

const DEFAULT_CITY: CitySchemaType = {
  city: "",
};

const CityForm = forwardRef<CityFormHandle>((_props, ref) => {
  const {
    register,
    control,
    formState: { errors },
    getValues,
    clearErrors,
    setError,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      cities: [DEFAULT_CITY],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cities",
  });

  const validateAndGetFormData = useCallback(() => {
    const values = getValues();
    const cityData: addCityData[] = [];
    let isValid = true;

    clearErrors();

    values.cities.forEach((city, index) => {
      const hasContent = hasCityContent(city);

      if (hasContent) {
        const result = citySchema.safeParse(city);

        if (!result.success) {
          isValid = false;
          result.error.issues.forEach((issue) => {
            const path = issue.path[0];
            if (typeof path === "string") {
              setError(`cities.${index}.${path}` as any, {
                type: "manual",
                message: issue.message,
              });
            }
          });
        } else {
          cityData.push({
            city: city.city,
          });
        }
      }
    });

    return { isValid, cityData };
  }, [getValues, setError, clearErrors]);

  const addCity = useCallback(() => {
    append(DEFAULT_CITY);
  }, [append]);

  const removeCity = useCallback(
    (index: number) => {
      remove(index);
      clearErrors(`cities.${index}` as any);
    },
    [remove, clearErrors],
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, cityData } = validateAndGetFormData();

      if (!isValid || cityData.length === 0) {
        return null;
      }

      return { cityData };
    },
  }));

  const renderCityForm = (field: { id: string }, index: number) => {
    const cityError = errors.cities?.[index]?.city?.message;
    const currentCity = getValues().cities[index];
    const hasContent = hasCityContent(currentCity);

    return (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center"
      >
        {fields.length >= 1 && (
          <IconButton
            action={() => removeCity(index)}
            style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
          />
        )}

        <div className="w-full flex flex-col gap-4">
          <Input
            style="bg-white"
            disabled={false}
            error={hasContent && cityError ? String(cityError) : ""}
            title="City Name"
            placeholder="Enter city name (e.g., New York, Paris, Tokyo)"
            type="text"
            {...register(`cities.${index}.city` as const)}
          />

          <div className="text-xs text-gray-500">
            <p>• City name must be at least 2 characters long</p>
            <p>• Use the full, official name of the city</p>
            <p>
              • Avoid abbreviations unless they're standard (e.g., NYC for New
              York City)
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="relative w-full flex justify-center">
        <IconButton
          action={addCity}
          style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="New City"
          icon={<RiAddFill size={16} />}
        />
      </div>

      <div className="w-full space-y-6">{fields.map(renderCityForm)}</div>
    </div>
  );
});

CityForm.displayName = "CityForm";

export default CityForm;
