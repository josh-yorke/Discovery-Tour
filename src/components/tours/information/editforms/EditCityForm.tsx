import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";

import IconButton from "../../../button/IconButton";
import Input from "../../../input/Input";
import type { addCityData, editCityData } from "../../../../types/city/addCity";

export interface CityFormHandle {
  getFormData: () => Promise<{
    cityData: addCityData[];
  } | null>;
  removeCityField: (index: number) => void;
}

interface CityFormProps {
  editData?: editCityData[];
  onDeleteCity?: (cityId: string, index: number) => void;
  isDeletingCity?: boolean;
}

// Helper functions similar to pricelist form
const hasCityContent = (city: { city?: string }): boolean => {
  return (city.city?.trim() ?? "").length > 0;
};

const hasCompleteCity = (city: { city?: string }): boolean => {
  return (city.city?.trim() ?? "").length > 0;
};

const citySchema = z.object({
  city: z.string().min(1, "City name is required"),
});

type CitySchemaType = {
  city: string;
};

type FormData = { cities: CitySchemaType[] };

const DEFAULT_CITY: CitySchemaType = {
  city: "",
};

const mapEditDataToDefaultValues = (
  editData: editCityData[],
): CitySchemaType[] => {
  if (editData.length === 0) return [DEFAULT_CITY];

  return editData.map((data) => ({
    city: data?.city || "",
  }));
};

const EditCityForm = forwardRef<CityFormHandle, CityFormProps>(
  ({ editData = [], onDeleteCity }, ref) => {
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
        cities: mapEditDataToDefaultValues(editData),
      },
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "cities",
    });

    const watchCities = watch("cities");

    const validateAndGetFormData = useCallback(() => {
      const values = getValues();
      const cityData: addCityData[] = [];
      let isValid = true;
      let hasAnyCompleteData = false;

      clearErrors();

      values.cities.forEach((city, index) => {
        const hasContent = hasCityContent(city);
        const hasCompleteData = hasCompleteCity(city);

        // If there's any content at all, validate it
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
          }

          // Only add to data array if it's complete
          if (hasCompleteData) {
            hasAnyCompleteData = true;
            cityData.push({
              city: city.city,
            });
          } else if (hasContent && !hasCompleteData) {
            // If there's content but it's incomplete, show validation error
            isValid = false;
            if (!city.city?.trim()) {
              setError(`cities.${index}.city` as any, {
                type: "manual",
                message: "City name is required",
              });
            }
          }
        }
      });

      // Additional check: if there's at least one city with content but none are complete
      const anyCityHasContent = values.cities.some((city) =>
        hasCityContent(city),
      );
      if (anyCityHasContent && !hasAnyCompleteData) {
        isValid = false;
        // Find the first incomplete city and highlight its error
        const firstIncompleteIndex = values.cities.findIndex(
          (city) => hasCityContent(city) && !hasCompleteCity(city),
        );
        if (firstIncompleteIndex >= 0) {
          setError(`cities.${firstIncompleteIndex}.city` as any, {
            type: "manual",
            message: "City name is required",
          });
        }
      }

      return { isValid, cityData, hasAnyCompleteData };
    }, [getValues, setError, clearErrors]);

    const addCity = useCallback(() => {
      append(DEFAULT_CITY);
    }, [append]);

    const removeCity = useCallback(
      (index: number) => {
        const cityItem = editData[index];
        if (cityItem?._id && onDeleteCity) {
          onDeleteCity(cityItem._id, index);
        } else {
          remove(index);
          clearErrors(`cities.${index}` as any);
        }
      },
      [remove, editData, onDeleteCity, clearErrors],
    );

    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const { isValid, cityData } = validateAndGetFormData();

        // Only return null if there are validation errors
        if (!isValid) {
          return null;
        }

        // Return data even if arrays are empty (form is valid but has no complete data)
        // But in this case, we should check if we have any data to submit
        if (cityData.length === 0) {
          // If user has entered any content but it's incomplete, don't submit
          const values = getValues();
          const anyCityHasContent = values.cities.some((city) =>
            hasCityContent(city),
          );
          if (anyCityHasContent) {
            // Show an alert or handle the case where there's partial data
            console.log("Partial city data exists but is incomplete");
            return null;
          }
          // If no content at all, it's valid but empty
          return { cityData: [] };
        }

        return { cityData };
      },
      removeCityField: (index: number) => {
        remove(index);
      },
    }));

    const renderCityForm = (field: { id: string }, index: number) => {
      const currentCity = watchCities?.[index];
      const hasContent = hasCityContent(currentCity);
      const cityError = errors.cities?.[index]?.city?.message;

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
              title="City Name *"
              placeholder="Enter city name (e.g., New York, Paris, Tokyo)"
              type="text"
              {...register(`cities.${index}.city` as const)}
            />

            <div className="text-xs text-gray-500">
              <p>• City name must be at least 1 character long</p>
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
        <div className="w-full flex justify-center">
          <IconButton
            action={addCity}
            style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="New City"
            icon={<RiAddFill size={16} />}
          />
        </div>

        {fields.map(renderCityForm)}
      </div>
    );
  },
);

EditCityForm.displayName = "EditCityForm";

export default EditCityForm;
