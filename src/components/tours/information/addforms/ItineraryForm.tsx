import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import IconButton from "../../../button/IconButton";
import Input from "../../../input/Input";
import TextArea from "../../../input/TextArea";
import InputOption from "../../../input/InputOption";
import NumberInput from "../../../input/NumberInput";

export interface ItineraryFormHandle {
  getFormData: () => Promise<{
    itineraryData: {
      title: string;
      location: string;
      dayOrder: string;
      activities: Array<{
        activityType: string;
        information: string;
      }>;
      meals: Array<{
        mealType: string;
        mealCount: string;
        mealUnit: string;
        description: string;
      }>;
    }[];
  } | null>;
}

const hasActivityContent = (activity: {
  activityType?: string;
  information?: string;
}): boolean => {
  return (
    (activity.activityType?.trim() ?? "").length > 0 ||
    (activity.information?.trim() ?? "").length > 0
  );
};

const hasCompleteActivity = (activity: {
  activityType?: string;
  information?: string;
}): boolean => {
  return (
    (activity.activityType?.trim() ?? "").length > 0 &&
    (activity.information?.trim() ?? "").length > 0
  );
};

const hasMealContent = (meal: {
  mealType?: string;
  mealCount?: string;
  mealUnit?: string;
  description?: string;
}): boolean => {
  return (
    (meal.mealType?.trim() ?? "").length > 0 ||
    (meal.mealCount?.trim() ?? "").length > 0 ||
    (meal.mealUnit?.trim() ?? "").length > 0 ||
    (meal.description?.trim() ?? "").length > 0
  );
};

const hasCompleteMeal = (meal: {
  mealType?: string;
  mealCount?: string;
  mealUnit?: string;
  description?: string;
}): boolean => {
  return (
    (meal.mealType?.trim() ?? "").length > 0 &&
    (meal.mealCount?.trim() ?? "").length > 0 &&
    (meal.mealUnit?.trim() ?? "").length > 0 &&
    (meal.description?.trim() ?? "").length > 0
  );
};

const hasItineraryContent = (itinerary: {
  title?: string;
  location?: string;
  dayOrder?: string;
  activities?: Array<{ activityType?: string; information?: string }>;
  meals?: Array<{
    mealType?: string;
    mealCount?: string;
    mealUnit?: string;
    description?: string;
  }>;
}): boolean => {
  const hasMainFields =
    (itinerary.title?.trim() ?? "").length > 0 ||
    (itinerary.location?.trim() ?? "").length > 0 ||
    (itinerary.dayOrder?.trim() ?? "").length > 0;

  const hasActivitiesContent =
    itinerary.activities?.some(hasActivityContent) || false;
  const hasMealsContent = itinerary.meals?.some(hasMealContent) || false;

  return hasMainFields || hasActivitiesContent || hasMealsContent;
};

const activitySchema = z.object({
  activityType: z.string().min(1, "Activity type is required"),
  information: z.string().min(1, "Information is required"),
});

const mealSchema = z.object({
  mealType: z.string().min(1, "Meal type is required"),
  mealCount: z.string().min(1, "Meal count is required"),
  mealUnit: z.string().min(1, "Meal unit is required"),
  description: z.string().min(1, "Description is required"),
});

const itinerarySchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  dayOrder: z.string().min(1, "Day order is required"),
  activities: z.array(activitySchema),
  meals: z.array(mealSchema),
});

type ItinerarySchemaType = z.infer<typeof itinerarySchema>;
type FormData = { itineraries: ItinerarySchemaType[] };

const DEFAULT_ACTIVITY = { activityType: "", information: "" };
const DEFAULT_MEAL = {
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

const ItineraryForm = forwardRef<ItineraryFormHandle>((_props, ref) => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    setError,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: { itineraries: [DEFAULT_ITINERARY] },
  });

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({ control, name: "itineraries" });

  const validateAndGetFormData = useCallback(() => {
    const values = getValues();
    const itineraryData: any[] = [];
    let isValid = true;

    clearErrors();

    values.itineraries.forEach((itinerary, itineraryIndex) => {
      const hasContent = hasItineraryContent(itinerary);

      if (!hasContent) return;

      const hasMainFields =
        (itinerary.title?.trim() ?? "").length > 0 ||
        (itinerary.location?.trim() ?? "").length > 0 ||
        (itinerary.dayOrder?.trim() ?? "").length > 0;

      if (hasMainFields) {
        const mainResult = itinerarySchema.safeParse(itinerary);
        if (!mainResult.success) {
          isValid = false;
          mainResult.error.issues.forEach((issue) => {
            const path = issue.path[0];
            if (typeof path === "string") {
              setError(`itineraries.${itineraryIndex}.${path}` as any, {
                type: "manual",
                message: issue.message,
              });
            }
          });
        }
      }

      let hasAnyActivityContent = false;
      let hasAnyCompleteActivity = false;

      itinerary.activities?.forEach((activity, activityIndex) => {
        const activityHasContent = hasActivityContent(activity);
        const activityIsComplete = hasCompleteActivity(activity);
        hasAnyActivityContent = hasAnyActivityContent || activityHasContent;
        hasAnyCompleteActivity = hasAnyCompleteActivity || activityIsComplete;

        if (activityHasContent) {
          const activityResult = activitySchema.safeParse(activity);
          if (!activityResult.success) {
            isValid = false;
            activityResult.error.issues.forEach((issue) => {
              const path = issue.path[0];
              if (typeof path === "string") {
                setError(
                  `itineraries.${itineraryIndex}.activities.${activityIndex}.${path}` as any,
                  { type: "manual", message: issue.message },
                );
              }
            });
          }
        }
      });

      if (hasMainFields && !hasAnyCompleteActivity) {
        isValid = false;
        setError(`itineraries.${itineraryIndex}.activities` as any, {
          type: "manual",
          message: hasAnyActivityContent
            ? "Complete all activity fields (type and information)"
            : "At least one activity is required",
        });
      }

      let hasAnyMealContent = false;
      let hasAnyCompleteMeal = false;

      itinerary.meals?.forEach((meal, mealIndex) => {
        const mealHasContent = hasMealContent(meal);
        const mealIsComplete = hasCompleteMeal(meal);
        hasAnyMealContent = hasAnyMealContent || mealHasContent;
        hasAnyCompleteMeal = hasAnyCompleteMeal || mealIsComplete;

        if (mealHasContent) {
          const mealResult = mealSchema.safeParse(meal);
          if (!mealResult.success) {
            isValid = false;
            mealResult.error.issues.forEach((issue) => {
              const path = issue.path[0];
              if (typeof path === "string") {
                setError(
                  `itineraries.${itineraryIndex}.meals.${mealIndex}.${path}` as any,
                  { type: "manual", message: issue.message },
                );
              }
            });
          }
        }
      });

      if (hasMainFields && !hasAnyCompleteMeal) {
        isValid = false;
        setError(`itineraries.${itineraryIndex}.meals` as any, {
          type: "manual",
          message: hasAnyMealContent
            ? "Complete all meal fields (type, count, unit, and description)"
            : "At least one meal is required",
        });
      }

      const hasCompleteMainFields =
        (itinerary.title?.trim() ?? "").length > 0 &&
        (itinerary.location?.trim() ?? "").length > 0 &&
        (itinerary.dayOrder?.trim() ?? "").length > 0;

      const completeActivities =
        itinerary.activities?.filter(hasCompleteActivity) || [];
      const completeMeals = itinerary.meals?.filter(hasCompleteMeal) || [];

      if (
        hasCompleteMainFields &&
        completeActivities.length > 0 &&
        completeMeals.length > 0
      ) {
        itineraryData.push({
          title: itinerary.title,
          location: itinerary.location,
          dayOrder: itinerary.dayOrder,
          activities: completeActivities,
          meals: completeMeals.map((meal) => ({
            ...meal,
            mealCount: String(meal.mealCount || ""),
          })),
        });
      } else if (hasContent) {
        isValid = false;
        if (!itinerary.title?.trim()) {
          setError(`itineraries.${itineraryIndex}.title` as any, {
            type: "manual",
            message: "Title is required",
          });
        }
        if (!itinerary.location?.trim()) {
          setError(`itineraries.${itineraryIndex}.location` as any, {
            type: "manual",
            message: "Location is required",
          });
        }
        if (!itinerary.dayOrder?.trim()) {
          setError(`itineraries.${itineraryIndex}.dayOrder` as any, {
            type: "manual",
            message: "Day order is required",
          });
        }
      }
    });

    return { isValid, itineraryData };
  }, [getValues, setError, clearErrors]);

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
        setValue(`itineraries.${itineraryIndex}.activities`, currentActivities);
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

  const removeItineraryHandler = useCallback(
    (index: number) => {
      removeItinerary(index);
      clearErrors(`itineraries.${index}` as any);
    },
    [removeItinerary, clearErrors],
  );

  const addItinerary = useCallback(() => {
    appendItinerary({ ...DEFAULT_ITINERARY });
  }, [appendItinerary]);

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, itineraryData } = validateAndGetFormData();
      if (!isValid || itineraryData.length === 0) return null;
      return { itineraryData };
    },
  }));

  const renderActivityForm = (
    itineraryIndex: number,
    activityIndex: number,
  ) => {
    const currentItinerary = getValues().itineraries[itineraryIndex];
    const activities = Array.isArray(currentItinerary?.activities)
      ? currentItinerary.activities
      : [currentItinerary?.activities || DEFAULT_ACTIVITY];
    const currentActivity = activities[activityIndex];
    const hasContent = hasActivityContent(currentActivity);
    const informationError =
      errors.itineraries?.[itineraryIndex]?.activities?.[activityIndex]
        ?.information?.message;

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
              `itineraries.${itineraryIndex}.activities.${activityIndex}.activityType` as const,
            )}
          />
          <TextArea
            disabled={false}
            error={
              hasContent && informationError ? String(informationError) : ""
            }
            title="Information"
            placeholder="Describe the activity in detail"
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
    const currentItinerary = getValues().itineraries[itineraryIndex];
    const meals = Array.isArray(currentItinerary?.meals)
      ? currentItinerary.meals
      : [currentItinerary?.meals || DEFAULT_MEAL];
    const currentMeal = meals[mealIndex];
    const hasContent = hasMealContent(currentMeal);
    const mealCountError =
      errors.itineraries?.[itineraryIndex]?.meals?.[mealIndex]?.mealCount
        ?.message;
    const descriptionError =
      errors.itineraries?.[itineraryIndex]?.meals?.[mealIndex]?.description
        ?.message;

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
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Meal Type"
              options={["breakfast", "lunch", "dinner", "snacks", "others"]}
              {...register(
                `itineraries.${itineraryIndex}.meals.${mealIndex}.mealType` as const,
              )}
            />
            <NumberInput
              style="bg-white"
              disabled={false}
              error={hasContent && mealCountError ? String(mealCountError) : ""}
              title="Meal Count"
              placeholder="e.g., 2, 1, 3"
              type="text"
              {...register(
                `itineraries.${itineraryIndex}.meals.${mealIndex}.mealCount` as const,
              )}
            />
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Meal Unit"
              options={["person", "group", "team"]}
              {...register(
                `itineraries.${itineraryIndex}.meals.${mealIndex}.mealUnit` as const,
              )}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={
                hasContent && descriptionError ? String(descriptionError) : ""
              }
              title="Description"
              placeholder="e.g., Hotel breakfast, Buffet lunch"
              type="text"
              {...register(
                `itineraries.${itineraryIndex}.meals.${mealIndex}.description` as const,
              )}
            />
          </div>
          <div className="w-full border-t border-black/6 border-0 my-6" />
        </div>
      </div>
    );
  };

  const renderItineraryForm = (field: { id: string }, index: number) => {
    const currentItinerary = getValues().itineraries[index];
    const hasMainFields =
      (currentItinerary?.title?.trim() ?? "").length > 0 ||
      (currentItinerary?.location?.trim() ?? "").length > 0 ||
      (currentItinerary?.dayOrder?.trim() ?? "").length > 0;
    const titleError = errors.itineraries?.[index]?.title?.message;
    const locationError = errors.itineraries?.[index]?.location?.message;
    const dayOrderError = errors.itineraries?.[index]?.dayOrder?.message;
    const activitiesError = errors.itineraries?.[index]?.activities?.message;
    const mealsError = errors.itineraries?.[index]?.meals?.message;

    return (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center"
      >
        {itineraryFields.length >= 1 && (
          <IconButton
            action={() => removeItineraryHandler(index)}
            style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
          />
        )}

        <div className="w-full flex flex-col gap-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={hasMainFields && titleError ? String(titleError) : ""}
              title="Day Title"
              placeholder="e.g., Day 1: Arrival in Paris"
              type="text"
              {...register(`itineraries.${index}.title` as const)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={
                hasMainFields && locationError ? String(locationError) : ""
              }
              title="Location"
              placeholder="e.g., Paris, France"
              type="text"
              {...register(`itineraries.${index}.location` as const)}
            />
            <NumberInput
              style="bg-white"
              disabled={false}
              error={
                hasMainFields && dayOrderError ? String(dayOrderError) : ""
              }
              title="Day Order"
              placeholder="e.g., 1, 2, 3"
              type="text"
              {...register(`itineraries.${index}.dayOrder` as const)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Activities</p>
              {hasMainFields && activitiesError && (
                <p className="text-red-500 text-sm">{activitiesError}</p>
              )}
              <IconButton
                action={() => addActivity(index)}
                style="bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
                title="Add Activity"
                icon={<RiAddFill size={16} />}
              />
            </div>
            <div className="space-y-4">
              {currentItinerary?.activities?.map((_, activityIndex) =>
                renderActivityForm(index, activityIndex),
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Meals</p>
              {hasMainFields && mealsError && (
                <p className="text-red-500 text-sm">{mealsError}</p>
              )}
              <IconButton
                action={() => addMeal(index)}
                style="bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
                title="Add Meal"
                icon={<RiAddFill size={16} />}
              />
            </div>
            <div className="space-y-4">
              {currentItinerary?.meals?.map((_, mealIndex) =>
                renderMealForm(index, mealIndex),
              )}
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <p>• Day order determines the sequence of days in the itinerary</p>
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
});

ItineraryForm.displayName = "ItineraryForm";

export default ItineraryForm;
