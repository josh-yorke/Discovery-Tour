import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

// Form schema matching your accommodation form structure
const cityFormSchema = z.object({
  city: z.string().min(1, "City name is required"),
});

type CityFormData = {
  city: string;
};

// ULTRA STRICT form schema
const formSchema = z.object({
  cities: z
    .array(cityFormSchema)
    .min(1, "At least one city is required")
    .refine(
      (cities) => {
        // Check that every city has the required fields
        return cities.every((city) => city.city.trim() !== "");
      },
      {
        message: "All cities must have a name filled out",
      }
    ),
});

type FormData = z.infer<typeof formSchema>;

const DEFAULT_CITY: CityFormData = {
  city: "",
};

const mapEditDataToDefaultValues = (
  editData: editCityData[]
): CityFormData[] => {
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
      trigger,
      getValues,
    } = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        cities: mapEditDataToDefaultValues(editData),
      },
      mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "cities",
    });

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
        }
      },
      [remove, editData, onDeleteCity]
    );

    // ULTRA STRICT getFormData
    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        console.log("🔄 Validating city form...");

        // First validate with Zod
        const isValid = await trigger();
        if (!isValid) {
          console.log("❌ Zod validation failed");
          return null;
        }

        const formData = getValues();
        const cityData: addCityData[] = [];

        const citiesArray = Array.isArray(formData.cities)
          ? formData.cities
          : [formData.cities];

        console.log("📋 Raw cities data:", citiesArray);

        // MANUAL VALIDATION - Check every city has required data
        for (let i = 0; i < citiesArray.length; i++) {
          const city = citiesArray[i];

          const hasName = city.city && city.city.trim() !== "";

          console.log(`📝 City ${i}:`, {
            hasName,
            name: city.city,
          });

          // Only include if ALL required fields are filled
          if (hasName) {
            cityData.push({
              city: city.city,
            });
          } else {
            console.log(`⚠️ Skipping city ${i} - missing required field`);
          }
        }

        // Final check - must have at least one valid city
        if (cityData.length === 0) {
          console.log("❌ No valid cities found");
          alert(
            "❌ Please fill out all required fields (City Name) for at least one city."
          );
          return null;
        }

        console.log("✅ Valid cities:", cityData.length);
        return { cityData };
      },
      removeCityField: (index: number) => {
        remove(index);
      },
    }));

    const renderCityForm = (field: { id: string }, index: number) => {
      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {/* Delete button */}
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
              error={errors.cities?.[index]?.city?.message || ""}
              title="City Name *"
              placeholder="Enter city name (e.g., New York, Paris, Tokyo)"
              type="text"
              {...register(`cities.${index}.city`)}
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
  }
);

EditCityForm.displayName = "EditCityForm";

export default EditCityForm;
