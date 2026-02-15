import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback, useEffect } from "react";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import {
  type addActivityData,
  type addItineraryData,
  type addMealData,
  type editItineraryData,
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

const hasActivityContent = (activity: addActivityData): boolean => {
  return (
    (activity.activityType?.trim() ?? "").length > 0 ||
    (activity.information?.trim() ?? "").length > 0
  );
};

const hasCompleteActivity = (activity: addActivityData): boolean => {
  return (
    (activity.activityType?.trim() ?? "").length > 0 &&
    (activity.information?.trim() ?? "").length > 0
  );
};

const hasMealContent = (meal: addMealData): boolean => {
  const mealCountStr = meal.mealCount ? String(meal.mealCount) : "";
  return (
    (meal.mealType?.trim() ?? "").length > 0 ||
    mealCountStr.trim().length > 0 ||
    (meal.mealUnit?.trim() ?? "").length > 0 ||
    (meal.description?.trim() ?? "").length > 0
  );
};

const hasCompleteMeal = (meal: addMealData): boolean => {
  const mealCountStr = meal.mealCount ? String(meal.mealCount) : "";
  return (
    (meal.mealType?.trim() ?? "").length > 0 &&
    mealCountStr.trim().length > 0 &&
    (meal.mealUnit?.trim() ?? "").length > 0 &&
    (meal.description?.trim() ?? "").length > 0
  );
};

const hasItineraryContent = (itinerary: {
  title?: string;
  location?: string;
  dayOrder?: string;
  activities?: addActivityData[];
  meals?: addMealData[];
}): boolean => {
  const hasMainContent =
    (itinerary.title?.trim() ?? "").length > 0 ||
    (itinerary.location?.trim() ?? "").length > 0 ||
    (itinerary.dayOrder?.trim() ?? "").length > 0;

  const hasActivitiesContent =
    itinerary.activities?.some(hasActivityContent) || false;

  return hasMainContent || hasActivitiesContent;
};

const hasCompleteItinerary = (itinerary: {
  title?: string;
  location?: string;
  dayOrder?: string;
  activities?: addActivityData[];
  meals?: addMealData[];
}): boolean => {
  const hasMainFields =
    (itinerary.title?.trim() ?? "").length > 0 &&
    (itinerary.location?.trim() ?? "").length > 0 &&
    (itinerary.dayOrder?.trim() ?? "").length > 0;

  if (!hasMainFields) return false;

  const hasValidActivities =
    itinerary.activities?.some(hasCompleteActivity) || false;
  if (!hasValidActivities) return false;

  return true;
};

type ItinerarySchemaType = {
  title: string;
  location: string;
  dayOrder: string;
  activities: addActivityData[];
  meals: addMealData[];
};

type FormData = { itineraries: ItinerarySchemaType[] };

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

const DEFAULT_ITINERARY: ItinerarySchemaType = {
  title: "",
  location: "",
  dayOrder: "",
  activities: [DEFAULT_ACTIVITY],
  meals: [DEFAULT_MEAL],
};

const mapEditDataToDefaultValues = (
  editData: editItineraryData[],
): ItinerarySchemaType[] => {
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
      setValue,
      watch,
      getValues,
      clearErrors,
      setError,
      reset,
    } = useForm<FormData>({
      mode: "onChange",
      defaultValues: {
        itineraries: mapEditDataToDefaultValues(editData),
      },
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
      [getValues, setValue],
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
            currentActivities,
          );
        }
      },
      [getValues, setValue],
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
      [getValues, setValue],
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
      [getValues, setValue],
    );

    const validateAndGetFormData = useCallback(() => {
      const values = getValues();
      const itineraryData: addItineraryData[] = [];
      let isValid = true;

      clearErrors();

      values.itineraries.forEach((itinerary, itineraryIndex) => {
        const hasContent = hasItineraryContent(itinerary);
        const hasCompleteData = hasCompleteItinerary(itinerary);

        if (hasContent) {
          if (!itinerary.title?.trim()) {
            isValid = false;
            setError(`itineraries.${itineraryIndex}.title` as any, {
              type: "manual",
              message: "Day title is required",
            });
          }

          if (!itinerary.location?.trim()) {
            isValid = false;
            setError(`itineraries.${itineraryIndex}.location` as any, {
              type: "manual",
              message: "Location is required",
            });
          }

          if (!itinerary.dayOrder?.trim()) {
            isValid = false;
            setError(`itineraries.${itineraryIndex}.dayOrder` as any, {
              type: "manual",
              message: "Day order is required",
            });
          }

          if (itinerary.activities) {
            const hasAnyActivityContent =
              itinerary.activities.some(hasActivityContent);
            const hasAnyCompleteActivity =
              itinerary.activities.some(hasCompleteActivity);

            if (hasAnyActivityContent && !hasAnyCompleteActivity) {
              isValid = false;
              itinerary.activities.forEach((activity, activityIndex) => {
                if (!activity.activityType?.trim()) {
                  setError(
                    `itineraries.${itineraryIndex}.activities.${activityIndex}.activityType` as any,
                    { type: "manual", message: "Activity type is required" },
                  );
                }
                if (!activity.information?.trim()) {
                  setError(
                    `itineraries.${itineraryIndex}.activities.${activityIndex}.information` as any,
                    {
                      type: "manual",
                      message: "Activity description is required",
                    },
                  );
                }
              });
            }

            itinerary.activities.forEach((activity, activityIndex) => {
              if (hasActivityContent(activity)) {
                if (!activity.activityType?.trim()) {
                  isValid = false;
                  setError(
                    `itineraries.${itineraryIndex}.activities.${activityIndex}.activityType` as any,
                    { type: "manual", message: "Activity type is required" },
                  );
                }
                if (!activity.information?.trim()) {
                  isValid = false;
                  setError(
                    `itineraries.${itineraryIndex}.activities.${activityIndex}.information` as any,
                    {
                      type: "manual",
                      message: "Activity description is required",
                    },
                  );
                }
              }
            });
          }

          if (itinerary.meals) {
            itinerary.meals.forEach((meal, mealIndex) => {
              const hasContent = hasMealContent(meal);
              const isComplete = hasCompleteMeal(meal);

              if (hasContent && !isComplete) {
                isValid = false;

                if (!meal.mealType?.trim()) {
                  setError(
                    `itineraries.${itineraryIndex}.meals.${mealIndex}.mealType` as any,
                    { type: "manual", message: "Meal type is required" },
                  );
                }

                const mealCountStr = meal.mealCount
                  ? String(meal.mealCount)
                  : "";
                if (!mealCountStr.trim()) {
                  setError(
                    `itineraries.${itineraryIndex}.meals.${mealIndex}.mealCount` as any,
                    { type: "manual", message: "Meal count is required" },
                  );
                }

                if (!meal.mealUnit?.trim()) {
                  setError(
                    `itineraries.${itineraryIndex}.meals.${mealIndex}.mealUnit` as any,
                    { type: "manual", message: "Meal unit is required" },
                  );
                }

                if (!meal.description?.trim()) {
                  setError(
                    `itineraries.${itineraryIndex}.meals.${mealIndex}.description` as any,
                    { type: "manual", message: "Meal description is required" },
                  );
                }
              }
            });
          }

          if (hasCompleteData) {
            const completeActivities =
              itinerary.activities?.filter(hasCompleteActivity) || [];

            const mealsWithContent =
              itinerary.meals?.filter(hasMealContent) || [];
            const completeMeals = mealsWithContent.filter(hasCompleteMeal);
            const processedMeals = completeMeals.map((meal) => ({
              ...meal,
              mealCount: String(meal.mealCount || ""),
            }));

            itineraryData.push({
              title: itinerary.title,
              location: itinerary.location,
              dayOrder: itinerary.dayOrder,
              activities: completeActivities,
              meals: processedMeals.length > 0 ? processedMeals : [],
            });
          }
        }
      });

      return { isValid, itineraryData };
    }, [getValues, setError, clearErrors]);

    const handleDeleteItinerary = useCallback(
      (index: number) => {
        const itineraryItem = editData[index];

        if (itineraryItem?._id && onDeleteItinerary) {
          onDeleteItinerary(itineraryItem._id, index);
        } else {
          removeItinerary(index);
          clearErrors(`itineraries.${index}` as any);
        }
      },
      [removeItinerary, editData, onDeleteItinerary, clearErrors],
    );

    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const { isValid, itineraryData } = validateAndGetFormData();

        if (!isValid) {
          return null;
        }

        if (itineraryData.length === 0) {
          const values = getValues();
          const anyItineraryHasContent = values.itineraries.some((itinerary) =>
            hasItineraryContent(itinerary),
          );
          if (anyItineraryHasContent) {
            return null;
          }
          return { itineraryData: [] };
        }

        return { itineraryData };
      },
      removeItineraryField: (index: number) => {
        handleDeleteItinerary(index);
      },
    }));

    const renderActivityForm = (
      itineraryIndex: number,
      activityIndex: number,
    ) => {
      const activityTypeError =
        errors.itineraries?.[itineraryIndex]?.activities?.[activityIndex]
          ?.activityType?.message;
      const informationError =
        errors.itineraries?.[itineraryIndex]?.activities?.[activityIndex]
          ?.information?.message;

      return (
        <div
          key={`activity-${itineraryIndex}-${activityIndex}`}
          className="space-y-3"
        >
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => removeActivity(itineraryIndex, activityIndex)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove Activity
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <div>
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
                  `itineraries.${itineraryIndex}.activities.${activityIndex}.activityType` as const,
                )}
              />
              {activityTypeError && (
                <p className="text-red-500 text-sm mt-1">{activityTypeError}</p>
              )}
            </div>
            <TextArea
              disabled={false}
              error={informationError ? String(informationError) : ""}
              title="Activity Description"
              placeholder="Describe the activity"
              {...register(
                `itineraries.${itineraryIndex}.activities.${activityIndex}.information` as const,
              )}
            />
            <div className="w-full border-t border-black/6 border-0 my-6" />
          </div>
        </div>
      );
    };

    const renderMealForm = (itineraryIndex: number, mealIndex: number) => {
      const mealTypeError =
        errors.itineraries?.[itineraryIndex]?.meals?.[mealIndex]?.mealType
          ?.message;
      const mealCountError =
        errors.itineraries?.[itineraryIndex]?.meals?.[mealIndex]?.mealCount
          ?.message;
      const mealUnitError =
        errors.itineraries?.[itineraryIndex]?.meals?.[mealIndex]?.mealUnit
          ?.message;
      const descriptionError =
        errors.itineraries?.[itineraryIndex]?.meals?.[mealIndex]?.description
          ?.message;

      return (
        <div key={`meal-${itineraryIndex}-${mealIndex}`} className="space-y-3">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => removeMeal(itineraryIndex, mealIndex)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove Meal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Meal Type"
                options={["breakfast", "lunch", "dinner", "snacks", "others"]}
                {...register(
                  `itineraries.${itineraryIndex}.meals.${mealIndex}.mealType` as const,
                )}
              />
              {mealTypeError && (
                <p className="text-red-500 text-sm mt-1">{mealTypeError}</p>
              )}
            </div>
            <Input
              style="bg-white"
              disabled={false}
              error={mealCountError ? String(mealCountError) : ""}
              title="Meal Count"
              placeholder="e.g., 2, 1, 3"
              type="text"
              {...register(
                `itineraries.${itineraryIndex}.meals.${mealIndex}.mealCount` as const,
              )}
            />

            <div>
              <InputOption
                disabled={false}
                style="bg-white w-full"
                title="Meal Unit"
                options={["person", "group", "team"]}
                {...register(
                  `itineraries.${itineraryIndex}.meals.${mealIndex}.mealUnit` as const,
                )}
              />
              {mealUnitError && (
                <p className="text-red-500 text-sm mt-1">{mealUnitError}</p>
              )}
            </div>
            <Input
              style="bg-white"
              disabled={false}
              error={descriptionError ? String(descriptionError) : ""}
              title="Meal Description"
              placeholder="e.g., Hotel breakfast, Buffet lunch"
              type="text"
              {...register(
                `itineraries.${itineraryIndex}.meals.${mealIndex}.description` as const,
              )}
            />
          </div>
          <div className="w-full border-t border-black/6 border-0 my-6" />
        </div>
      );
    };

    const renderItineraryForm = (field: { id: string }, index: number) => {
      const titleError = errors.itineraries?.[index]?.title?.message;
      const locationError = errors.itineraries?.[index]?.location?.message;
      const dayOrderError = errors.itineraries?.[index]?.dayOrder?.message;

      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {itineraryFields.length >= 1 && (
            <IconButton
              action={() => handleDeleteItinerary(index)}
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
                  error={titleError ? String(titleError) : ""}
                  title="Day Title"
                  placeholder="e.g., Day 1: Arrival in Paris"
                  type="text"
                  {...register(`itineraries.${index}.title` as const)}
                />
                <Input
                  style="bg-white"
                  disabled={false}
                  error={locationError ? String(locationError) : ""}
                  title="Location"
                  placeholder="e.g., Paris, France"
                  type="text"
                  {...register(`itineraries.${index}.location` as const)}
                />
                <Input
                  style="bg-white"
                  disabled={false}
                  error={dayOrderError ? String(dayOrderError) : ""}
                  title="Day Order"
                  placeholder="e.g., 1, 2, 3"
                  type="text"
                  {...register(`itineraries.${index}.dayOrder` as const)}
                />
              </div>
              <div className="w-full border-t border-black/6 border-0 my-6" />
            </div>

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
                  (_, activityIndex) =>
                    renderActivityForm(index, activityIndex),
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">Meals</p>
                <IconButton
                  action={() => addMeal(index)}
                  style="bg-gray-600 hover:bg-gray-700 text-xs text-white duration-300 px-6 py-3 rounded-lg"
                  title="Add Meal"
                  icon={<RiAddFill size={16} />}
                />
              </div>
              <div className="space-y-4">
                {watchItineraries?.[index]?.meals?.map((_, mealIndex) =>
                  renderMealForm(index, mealIndex),
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

    const addItinerary = useCallback(() => {
      appendItinerary({ ...DEFAULT_ITINERARY });
    }, [appendItinerary]);

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6">
        <div className="relative w-full flex justify-center">
          <IconButton
            action={addItinerary}
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
  },
);

EditItineraryForm.displayName = "EditItineraryForm";

export default EditItineraryForm;
