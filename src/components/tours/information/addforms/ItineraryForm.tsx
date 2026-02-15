import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
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
      meals?: Array<{
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

const hasPartialMeal = (meal: {
  mealType?: string;
  mealCount?: string;
  mealUnit?: string;
  description?: string;
}): boolean => {
  return hasMealContent(meal) && !hasCompleteMeal(meal);
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

type ItinerarySchemaType = {
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
};

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

  const { append: appendActivity, remove: removeActivity } = useFieldArray({
    control,
    name: "itineraries.0.activities",
  });

  const { append: appendMeal, remove: removeMeal } = useFieldArray({
    control,
    name: "itineraries.0.meals",
  });

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
        if (!itinerary.title?.trim()) {
          isValid = false;
          setError(`itineraries.${itineraryIndex}.title` as any, {
            type: "manual",
            message: "Title is required",
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
      }

      let hasAnyActivityContent = false;
      let hasAnyCompleteActivity = false;

      itinerary.activities?.forEach((activity, activityIndex) => {
        const activityHasContent = hasActivityContent(activity);
        const activityIsComplete = hasCompleteActivity(activity);
        hasAnyActivityContent = hasAnyActivityContent || activityHasContent;
        hasAnyCompleteActivity = hasAnyCompleteActivity || activityIsComplete;

        if (activityHasContent && !activityIsComplete) {
          isValid = false;
          if (!activity.activityType?.trim()) {
            setError(
              `itineraries.${itineraryIndex}.activities.${activityIndex}.activityType` as any,
              { type: "manual", message: "Activity type is required" },
            );
          }
          if (!activity.information?.trim()) {
            setError(
              `itineraries.${itineraryIndex}.activities.${activityIndex}.information` as any,
              { type: "manual", message: "Information is required" },
            );
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
      let hasAnyPartialMeal = false;

      itinerary.meals?.forEach((meal, mealIndex) => {
        const mealHasContent = hasMealContent(meal);
        const mealIsComplete = hasCompleteMeal(meal);
        const mealIsPartial = hasPartialMeal(meal);

        hasAnyMealContent = hasAnyMealContent || mealHasContent;
        hasAnyPartialMeal = hasAnyPartialMeal || mealIsPartial;

        if (mealHasContent && !mealIsComplete) {
          isValid = false;

          if (!meal.mealType?.trim()) {
            setError(
              `itineraries.${itineraryIndex}.meals.${mealIndex}.mealType` as any,
              { type: "manual", message: "Meal type is required" },
            );
          }
          if (!meal.mealCount?.trim()) {
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
              { type: "manual", message: "Description is required" },
            );
          }
        }
      });

      if (hasAnyPartialMeal) {
        isValid = false;
        setError(`itineraries.${itineraryIndex}.meals` as any, {
          type: "manual",
          message:
            "Complete all meal fields (type, count, unit, and description) or leave all empty",
        });
      }

      const hasCompleteMainFields =
        (itinerary.title?.trim() ?? "").length > 0 &&
        (itinerary.location?.trim() ?? "").length > 0 &&
        (itinerary.dayOrder?.trim() ?? "").length > 0;

      const completeActivities =
        itinerary.activities?.filter(hasCompleteActivity) || [];

      const completeMeals = itinerary.meals?.filter(hasCompleteMeal) || [];

      if (hasCompleteMainFields && completeActivities.length > 0) {
        const itineraryItem: any = {
          title: itinerary.title,
          location: itinerary.location,
          dayOrder: itinerary.dayOrder,
          activities: completeActivities,
        };

        if (completeMeals.length > 0) {
          itineraryItem.meals = completeMeals.map((meal) => ({
            ...meal,
            mealCount: String(meal.mealCount || ""),
          }));
        }

        itineraryData.push(itineraryItem);
      } else if (hasContent && !hasCompleteMainFields) {
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

  const addActivity = useCallback(() => {
    appendActivity(
      { ...DEFAULT_ACTIVITY },
      {
        shouldFocus: false,
        focusIndex: -1,
      },
    );
  }, [appendActivity]);

  const removeActivityHandler = useCallback(
    (activityIndex: number) => {
      removeActivity(activityIndex);
    },
    [removeActivity],
  );

  const addMeal = useCallback(() => {
    appendMeal(
      { ...DEFAULT_MEAL },
      {
        shouldFocus: false,
        focusIndex: -1,
      },
    );
  }, [appendMeal]);

  const removeMealHandler = useCallback(
    (mealIndex: number) => {
      removeMeal(mealIndex);
    },
    [removeMeal],
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
          {activities.length > 1 && (
            <button
              type="button"
              onClick={() => removeActivityHandler(activityIndex)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          )}
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
            {hasContent && activityTypeError && (
              <p className="text-red-500 text-sm mt-1">{activityTypeError}</p>
            )}
          </div>
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
          {meals.length > 1 && (
            <button
              type="button"
              onClick={() => removeMealHandler(mealIndex)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          )}
        </div>
        <div className="space-y-3">
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
              {hasContent && mealTypeError && (
                <p className="text-red-500 text-sm mt-1">{mealTypeError}</p>
              )}
            </div>

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
              {hasContent && mealUnitError && (
                <p className="text-red-500 text-sm mt-1">{mealUnitError}</p>
              )}
            </div>

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
        {itineraryFields.length > 1 && (
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
                action={addActivity}
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
              <p className="text-sm font-medium text-gray-700">
                Meals (Optional)
              </p>
              {hasMainFields && mealsError && (
                <p className="text-red-500 text-sm">{mealsError}</p>
              )}
              <IconButton
                action={addMeal}
                style="bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
                title="Add Meal"
                icon={<RiAddFill size={16} />}
              />
            </div>
            {currentItinerary?.meals && currentItinerary.meals.length > 0 && (
              <div className="space-y-4">
                {currentItinerary.meals.map((_, mealIndex) =>
                  renderMealForm(index, mealIndex),
                )}
              </div>
            )}
            {(!currentItinerary?.meals ||
              currentItinerary.meals.length === 0) && (
              <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 text-sm">
                  No meals added. Meals are optional.
                </p>
                <button
                  type="button"
                  onClick={addMeal}
                  className="mt-2 text-[#1d2087] hover:text-[#3b3eac] text-sm font-medium"
                >
                  + Add Meal
                </button>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500">
            <p>• Day order determines the sequence of days in the itinerary</p>
            <p>• Add all activities planned for this day</p>
            <p>• Meals are optional - include if provided during this day</p>
            <p>• If adding a meal, all meal fields must be completed</p>
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
