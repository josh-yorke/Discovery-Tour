import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

// Types
const cityFormSchema = addCitySchema;

type CityFormData = z.infer<typeof cityFormSchema>;

const formSchema = z.object({
  cities: z.array(cityFormSchema),
});

type FormData = z.infer<typeof formSchema>;

// Constants
const DEFAULT_CITY: CityFormData = {
  city: "",
};

const CityForm = forwardRef<CityFormHandle>((_props, ref) => {
  const {
    register,
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cities: [DEFAULT_CITY],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cities",
  });

  // Handlers
  const addCity = useCallback(() => {
    append(DEFAULT_CITY);
  }, [append]);

  const removeCity = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const isValid = await trigger();
      if (!isValid) return null;

      const formData = getValues();
      const cityData: addCityData[] = [];

      console.log("🔍 CityForm - formData.cities:", formData.cities);
      console.log("🔍 CityForm - isArray:", Array.isArray(formData.cities));

      // Ensure we're always working with an array
      const citiesArray = Array.isArray(formData.cities)
        ? formData.cities
        : [formData.cities];

      citiesArray.forEach((city, index) => {
        console.log(`🔍 Processing city ${index}:`, city);

        cityData.push({
          city: city.city,
        });
      });

      console.log("🔍 CityForm - final cityData:", cityData);

      return { cityData };
    },
  }));

  const renderCityForm = (field: { id: string }, index: number) => {
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
            error={errors.cities?.[index]?.city?.message || ""}
            title="City Name"
            placeholder="Enter city name (e.g., New York, Paris, Tokyo)"
            type="text"
            {...register(`cities.${index}.city`)}
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
