import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback, useEffect } from "react";
import { z } from "zod";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import {
  type addActivityData,
  type addItineraryData,
  type addMealData,
  type editItineraryData,
  addActivitySchema,
  addMealSchema,
} from "../../../../types/itinerary/addItinerary";
import IconButton from "../../../button/IconButton";
import Input from "../../../input/Input";
import TextArea from "../../../input/TextArea";
import InputOption from "../../../input/InputOption";

export interface ItineraryFormHandle {
  getFormData: () => Promise<{
    itineraryData: addItineraryData[];
  } | null>;
  removeItineraryField: (index: number) => void;
}

interface ItineraryFormProps {
  editData?: editItineraryData[];
  onDeleteItinerary?: (itineraryId: string, index: number) => void;
}

const itineraryFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  dayOrder: z.string().min(1, "Day order is required"),
  activities: z
    .array(addActivitySchema)
    .min(1, "At least one activity is required"),
  meals: z.array(addMealSchema).min(1, "At least one meal is required"),
});

type ItineraryWithFormData = {
  title: string;
  location: string;
  dayOrder: string;
  activities: addActivityData[];
  meals: addMealData[];
};

const formSchema = z.object({
  itineraries: z
    .array(itineraryFormSchema)
    .min(1, "At least one itinerary day is required"),
});

type FormData = z.infer<typeof formSchema>;

const DEFAULT_ACTIVITY: addActivityData = {
  activityType: "",
  information: "",
};

const DEFAULT_MEAL: addMealData = {
  mealType: "",
  mealCount: "",
  mealUnit: "",
  description: "",
};

const DEFAULT_ITINERARY: ItineraryWithFormData = {
  title: "",
  location: "",
  dayOrder: "",
  activities: [DEFAULT_ACTIVITY],
  meals: [DEFAULT_MEAL],
};

const mapEditDataToDefaultValues = (
  editData: editItineraryData[]
): ItineraryWithFormData[] => {
  if (editData.length === 0) return [DEFAULT_ITINERARY];

  return editData.map((data) => ({
    title: data?.title || "",
    location: data?.location || "",
    dayOrder: data?.dayOrder?.toString() || "",
    activities: data?.activities?.map((activity) => ({
      activityType: activity?.activityType || "",
      information: activity?.information || "",
    })) || [DEFAULT_ACTIVITY],
    meals: data?.meals?.map((meal) => ({
      mealType: meal?.mealType || "",
      mealCount: meal?.mealCount?.toString() || "",
      mealUnit: meal?.mealUnit || "",
      description: meal?.description || "",
    })) || [DEFAULT_MEAL],
  }));
};

const EditItineraryForm = forwardRef<ItineraryFormHandle, ItineraryFormProps>(
  ({ editData = [], onDeleteItinerary }, ref) => {
    const {
      register,
      control,
      formState: { errors },
      trigger,
      getValues,
      setValue,
      watch,
      reset,
    } = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        itineraries: mapEditDataToDefaultValues(editData),
      },
      mode: "onChange",
    });

    const {
      fields: itineraryFields,
      append: appendItinerary,
      remove: removeItinerary,
    } = useFieldArray({
      control,
      name: "itineraries",
    });

    const watchItineraries = watch("itineraries");

    // FIXED: Reset form when editData changes
    useEffect(() => {
      const newDefaultValues = mapEditDataToDefaultValues(editData);
      reset({
        itineraries: newDefaultValues,
      });
    }, [editData, reset]);

    const addActivity = useCallback(
      (itineraryIndex: number) => {
        const currentItinerary = getValues(`itineraries.${itineraryIndex}`);
        const currentActivities = Array.isArray(currentItinerary?.activities)
          ? [...currentItinerary.activities]
          : [currentItinerary?.activities || DEFAULT_ACTIVITY];

        currentActivities.push({ ...DEFAULT_ACTIVITY });
        setValue(`itineraries.${itineraryIndex}.activities`, currentActivities);
      },
      [getValues, setValue]
    );

    const removeActivity = useCallback(
      (itineraryIndex: number, activityIndex: number) => {
        const currentItinerary = getValues(`itineraries.${itineraryIndex}`);
        const currentActivities = Array.isArray(currentItinerary?.activities)
          ? [...currentItinerary.activities]
          : [currentItinerary?.activities || DEFAULT_ACTIVITY];

        if (currentActivities.length > 1) {
          currentActivities.splice(activityIndex, 1);
          setValue(
            `itineraries.${itineraryIndex}.activities`,
            currentActivities
          );
        }
      },
      [getValues, setValue]
    );

    const addMeal = useCallback(
      (itineraryIndex: number) => {
        const currentItinerary = getValues(`itineraries.${itineraryIndex}`);
        const currentMeals = Array.isArray(currentItinerary?.meals)
          ? [...currentItinerary.meals]
          : [currentItinerary?.meals || DEFAULT_MEAL];

        currentMeals.push({ ...DEFAULT_MEAL });
        setValue(`itineraries.${itineraryIndex}.meals`, currentMeals);
      },
      [getValues, setValue]
    );

    const removeMeal = useCallback(
      (itineraryIndex: number, mealIndex: number) => {
        const currentItinerary = getValues(`itineraries.${itineraryIndex}`);
        const currentMeals = Array.isArray(currentItinerary?.meals)
          ? [...currentItinerary.meals]
          : [currentItinerary?.meals || DEFAULT_MEAL];

        if (currentMeals.length > 1) {
          currentMeals.splice(mealIndex, 1);
          setValue(`itineraries.${itineraryIndex}.meals`, currentMeals);
        }
      },
      [getValues, setValue]
    );

    // FIXED: Simple function that just calls onDeleteItinerary
    const handleDeleteItinerary = useCallback(
      (index: number) => {
        const itineraryItem = editData[index];
        console.log("EditItineraryForm - handleDeleteItinerary called:", {
          index,
          itineraryId: itineraryItem?._id,
          hasDeleteFunction: !!onDeleteItinerary,
        });

        if (itineraryItem?._id && onDeleteItinerary) {
          // Parent component handles the confirmation - NO confirmation here!
          onDeleteItinerary(itineraryItem._id, index);
        } else {
          // For new items not saved yet
          console.log("Removing unsaved itinerary at index:", index);
          removeItinerary(index);
        }
      },
      [removeItinerary, editData, onDeleteItinerary]
    );

    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const isValid = await trigger();
        if (!isValid) {
          return null;
        }

        const formData = getValues();
        const itineraryData: addItineraryData[] = [];

        const itinerariesArray = Array.isArray(formData.itineraries)
          ? formData.itineraries
          : [formData.itineraries];

        itinerariesArray.forEach((itinerary) => {
          const activities = Array.isArray(itinerary.activities)
            ? itinerary.activities
            : [itinerary.activities || DEFAULT_ACTIVITY];

          const meals = Array.isArray(itinerary.meals)
            ? itinerary.meals
            : [itinerary.meals || DEFAULT_MEAL];

          const filteredActivities = activities.filter(
            (activity) =>
              (activity?.activityType?.trim() ||
                activity?.information?.trim()) &&
              activity !== null &&
              activity !== undefined
          );

          const filteredMeals = meals.filter(
            (meal) =>
              (meal?.mealType?.trim() || meal?.description?.trim()) &&
              meal !== null &&
              meal !== undefined
          );

          const processedMeals = filteredMeals.map((meal) => ({
            ...meal,
            mealCount: String(meal.mealCount || ""),
          }));

          if (
            itinerary.title?.trim() ||
            itinerary.location?.trim() ||
            itinerary.dayOrder?.trim() ||
            filteredActivities.length > 0 ||
            processedMeals.length > 0
          ) {
            itineraryData.push({
              title: itinerary.title || "",
              location: itinerary.location || "",
              dayOrder: String(itinerary.dayOrder || ""),
              activities:
                filteredActivities.length > 0 ? filteredActivities : [],
              meals: processedMeals.length > 0 ? processedMeals : [],
            });
          }
        });

        return { itineraryData };
      },
      removeItineraryField: (index: number) => {
        handleDeleteItinerary(index);
      },
    }));

    const renderActivityForm = (
      itineraryIndex: number,
      activityIndex: number
    ) => {
      const currentItinerary = watchItineraries?.[itineraryIndex];
      const activities = Array.isArray(currentItinerary?.activities)
        ? currentItinerary.activities
        : [currentItinerary?.activities || DEFAULT_ACTIVITY];

      return (
        <div
          key={`activity-${itineraryIndex}-${activityIndex}`}
          className="space-y-3"
        >
          <div className="flex justify-between items-center">
            {activities.length > 1 && (
              <button
                type="button"
                onClick={() => removeActivity(itineraryIndex, activityIndex)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Activity Type"
              options={[
                "transportation",
                "accommodation",
                "dining",
                "sightseeing",
                "adventure",
                "shopping",
                "entertainment",
                "wellness",
                "cultural",
                "free",
                "general",
              ]}
              {...register(
                `itineraries.${itineraryIndex}.activities.${activityIndex}.activityType`
              )}
            />
            <TextArea
              disabled={false}
              error={
                errors.itineraries?.[itineraryIndex]?.activities?.[
                  activityIndex
                ]?.information?.message || ""
              }
              title="Information"
              placeholder="Describe the activity in detail"
              {...register(
                `itineraries.${itineraryIndex}.activities.${activityIndex}.information`
              )}
            />
            <div className="w-full border-t border-black/6 border-0 my-6" />
          </div>
        </div>
      );
    };

    const renderMealForm = (itineraryIndex: number, mealIndex: number) => {
      const currentItinerary = watchItineraries?.[itineraryIndex];
      const meals = Array.isArray(currentItinerary?.meals)
        ? currentItinerary.meals
        : [currentItinerary?.meals || DEFAULT_MEAL];

      return (
        <div key={`meal-${itineraryIndex}-${mealIndex}`} className="space-y-3">
          <div className="flex justify-between items-center">
            {meals.length > 1 && (
              <button
                type="button"
                onClick={() => removeMeal(itineraryIndex, mealIndex)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Meal Type"
              options={["breakfast", "lunch", "dinner", "snacks", "others"]}
              {...register(
                `itineraries.${itineraryIndex}.meals.${mealIndex}.mealType`
              )}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={
                errors.itineraries?.[itineraryIndex]?.meals?.[mealIndex]
                  ?.mealCount?.message || ""
              }
              title="Meal Count"
              placeholder="e.g., 2, 1, 3"
              type="text"
              {...register(
                `itineraries.${itineraryIndex}.meals.${mealIndex}.mealCount`
              )}
            />

            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Meal Unit"
              options={["person", "group", "team"]}
              {...register(
                `itineraries.${itineraryIndex}.meals.${mealIndex}.mealUnit`
              )}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={
                errors.itineraries?.[itineraryIndex]?.meals?.[mealIndex]
                  ?.description?.message || ""
              }
              title="Description"
              placeholder="e.g., Hotel breakfast, Buffet lunch"
              type="text"
              {...register(
                `itineraries.${itineraryIndex}.meals.${mealIndex}.description`
              )}
            />
          </div>
          <div className="w-full border-t border-black/6 border-0 my-6" />
        </div>
      );
    };

    const renderItineraryForm = (field: { id: string }, index: number) => {
      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {itineraryFields.length >= 1 && (
            <IconButton
              action={() => {
                console.log("Delete button clicked in render");
                handleDeleteItinerary(index);
              }}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  style="bg-white"
                  disabled={false}
                  error={errors.itineraries?.[index]?.title?.message || ""}
                  title="Day Title"
                  placeholder="e.g., Day 1: Arrival in Paris"
                  type="text"
                  {...register(`itineraries.${index}.title`)}
                />
                <Input
                  style="bg-white"
                  disabled={false}
                  error={errors.itineraries?.[index]?.location?.message || ""}
                  title="Location"
                  placeholder="e.g., Paris, France"
                  type="text"
                  {...register(`itineraries.${index}.location`)}
                />
                <Input
                  style="bg-white"
                  disabled={false}
                  error={errors.itineraries?.[index]?.dayOrder?.message || ""}
                  title="Day Order"
                  placeholder="e.g., 1, 2, 3"
                  type="text"
                  {...register(`itineraries.${index}.dayOrder`)}
                />
              </div>
              <div className="w-full border-t border-black/6 border-0 my-6" />
            </div>

            {/* Activities Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">Activities</p>

                <IconButton
                  action={() => addActivity(index)}
                  style="bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
                  title="Add Activity"
                  icon={<RiAddFill size={16} />}
                />
              </div>
              <div className="space-y-4">
                {watchItineraries?.[index]?.activities?.map(
                  (_, activityIndex) => renderActivityForm(index, activityIndex)
                )}
              </div>
            </div>

            {/* Meals Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">Meals</p>
                <IconButton
                  action={() => addMeal(index)}
                  style="bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
                  title="Add Meal"
                  icon={<RiAddFill size={16} />}
                />
              </div>
              <div className="space-y-4">
                {watchItineraries?.[index]?.meals?.map((_, mealIndex) =>
                  renderMealForm(index, mealIndex)
                )}
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <p>
                • Day order determines the sequence of days in the itinerary
              </p>
              <p>• Add all activities planned for this day</p>
              <p>• Include all meals provided during this day</p>
              <p>• Location should be the primary destination for the day</p>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6">
        <div className="relative w-full flex justify-center">
          <IconButton
            action={() => appendItinerary({ ...DEFAULT_ITINERARY })}
            style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="New Itinerary Day"
            icon={<RiAddFill size={16} />}
          />
        </div>

        <div className="w-full space-y-6">
          {itineraryFields.map(renderItineraryForm)}
        </div>
      </div>
    );
  }
);

EditItineraryForm.displayName = "EditItineraryForm";

export default EditItineraryForm;
