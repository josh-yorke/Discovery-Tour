import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface DatePickerData {
  title: string;
  name: string;
  placeholder: string;
  error: string | undefined;
  disabled: boolean;
  style: string;
  minDate?: string;
  maxDate?: string;
  compareField?: string;
  comparisonType?: "after" | "before" | "notSame";
  allowSameDay?: boolean;
}

const DatePicker = ({
  disabled,
  title,
  name,
  placeholder,
  error,
  style,
  minDate,
  maxDate,
  compareField,
  comparisonType = "after",
  allowSameDay = false,
}: DatePickerData) => {
  const { register, watch, setError, clearErrors } = useFormContext();

  const currentValue = watch(name);
  const compareValue = compareField ? watch(compareField) : null;

  useEffect(() => {
    if (currentValue && compareValue && compareField) {
      const isValid = validateDateComparison(
        currentValue,
        compareValue,
        comparisonType,
        allowSameDay,
      );

      if (!isValid) {
        const errorMessage = getErrorMessage(
          title,
          compareField,
          comparisonType,
          allowSameDay,
        );
        setError(name, {
          type: "manual",
          message: errorMessage,
        });
      } else {
        clearErrors(name);
      }
    }
  }, [
    currentValue,
    compareValue,
    name,
    compareField,
    comparisonType,
    allowSameDay,
    setError,
    clearErrors,
    title,
  ]);

  const validateDateComparison = (
    date1: string,
    date2: string,
    type: "after" | "before" | "notSame",
    sameDayAllowed: boolean,
  ): boolean => {
    if (!date1 || !date2) return true;

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    if (type === "after") {
      return sameDayAllowed ? d1 >= d2 : d1 > d2;
    } else if (type === "before") {
      return sameDayAllowed ? d1 <= d2 : d1 < d2;
    } else if (type === "notSame") {
      return d1.getTime() !== d2.getTime();
    }

    return true;
  };

  const getErrorMessage = (
    title: string,
    compareField: string,
    type: "after" | "before" | "notSame",
    sameDayAllowed: boolean,
  ): string => {
    const fieldTitles: Record<string, string> = {
      "rental.pickUpDate": "Pick-up Date",
      "rental.dropOffDate": "Drop-off Date",
      pickUpDate: "Pick-up Date",
      dropOffDate: "Drop-off Date",
    };

    const compareTitle = fieldTitles[compareField] || compareField;

    switch (type) {
      case "after":
        return sameDayAllowed
          ? `${title} must be on or after ${compareTitle}`
          : `${title} must be after ${compareTitle}`;
      case "before":
        return sameDayAllowed
          ? `${title} must be on or before ${compareTitle}`
          : `${title} must be before ${compareTitle}`;
      case "notSame":
        return `${title} cannot be the same as ${compareTitle}`;
      default:
        return "Invalid date selection";
    }
  };

  const getMinDate = () => {
    if (minDate) return minDate;

    if (name === "rental.dropOffDate" && compareField === "rental.pickUpDate") {
      const pickUpValue = watch("rental.pickUpDate");
      if (pickUpValue) {
        const pickUpDate = new Date(pickUpValue);

        if (allowSameDay) {
          return pickUpDate.toISOString().split("T")[0];
        } else {
          const nextDay = new Date(pickUpDate);
          nextDay.setDate(pickUpDate.getDate() + 1);
          return nextDay.toISOString().split("T")[0];
        }
      }
    }

    return "";
  };

  const getMaxDate = () => {
    if (maxDate) return maxDate;

    if (name === "rental.pickUpDate" && compareField === "rental.dropOffDate") {
      const dropOffValue = watch("rental.dropOffDate");
      if (dropOffValue) {
        const dropOffDate = new Date(dropOffValue);

        if (allowSameDay) {
          return dropOffDate.toISOString().split("T")[0];
        } else {
          const prevDay = new Date(dropOffDate);
          prevDay.setDate(dropOffDate.getDate() - 1);
          return prevDay.toISOString().split("T")[0];
        }
      }
    }

    return "";
  };

  return (
    <div className="w-full flex flex-col items-start justify-center gap-2 text-sm">
      <p className="font-semibold capitalize">{title}</p>
      <input
        type="date"
        className={`w-full px-6 py-3 outline-none rounded-full font-normal ${style}`}
        placeholder={placeholder}
        disabled={disabled}
        min={getMinDate()}
        max={getMaxDate()}
        {...register(name, {
          setValueAs: (value) => {
            if (!value) return "";
            return new Date(value + "T00:00:00.000Z").toISOString();
          },
        })}
      />
      {error && <p className="text-red-700 text-sm">{error}</p>}
    </div>
  );
};

export default DatePicker;
