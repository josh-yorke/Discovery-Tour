import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import {
  addAccomodationSchema,
  type addAccomodationData,
} from "../../../../types/accomodation/addAccomodation";
import CustomImageInput from "../../../input/CustomImageInput";
import IconButton from "../../../button/IconButton";
import Input from "../../../input/Input";
import TextArea from "../../../input/TextArea";
import StarInput from "../../../input/StarInput";

export interface AccommodationFormHandle {
  getFormData: () => Promise<{
    accommodationData: addAccomodationData[];
    isValid?: boolean;
  } | null>;
}

const hasAccommodationContent = (accommodation: {
  accommodationName?: string;
  accommodationDescription?: string;
  accommodationStar?: string;
  accommodationWebsite?: string;
  images?: FileList;
}): boolean => {
  return (
    (accommodation.accommodationName?.trim() ?? "").length > 0 ||
    (accommodation.accommodationDescription?.trim() ?? "").length > 0 ||
    (accommodation.accommodationStar?.trim() ?? "").length > 0 ||
    (accommodation.accommodationWebsite?.trim() ?? "").length > 0 ||
    (accommodation.images?.length ?? 0) > 0
  );
};

const accommodationSchema = addAccomodationSchema;

type AccommodationSchemaType = z.infer<typeof accommodationSchema>;
type FormData = { accommodations: AccommodationSchemaType[] };

const DEFAULT_ACCOMMODATION: AccommodationSchemaType = {
  accommodationName: "",
  accommodationDescription: "",
  accommodationStar: "",
  accommodationWebsite: "",
  images: undefined as any,
};

const AccommodationForm = forwardRef<AccommodationFormHandle>((_props, ref) => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
    getValues,
    clearErrors,
    setError,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      accommodations: [DEFAULT_ACCOMMODATION],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "accommodations",
  });

  const watchAccommodations = watch("accommodations");

  const validateAndGetFormData = useCallback(() => {
    const values = getValues();
    const accommodationData: addAccomodationData[] = [];
    let isValid = true;

    clearErrors();

    values.accommodations.forEach((accommodation, index) => {
      const hasContent = hasAccommodationContent(accommodation);

      if (hasContent) {
        const result = accommodationSchema.safeParse(accommodation);

        if (!result.success) {
          isValid = false;
          result.error.issues.forEach((issue) => {
            const path = issue.path[0];
            if (typeof path === "string") {
              setError(`accommodations.${index}.${path}` as any, {
                type: "manual",
                message: issue.message,
              });
            }
          });
        }

        accommodationData.push({
          accommodationName: accommodation.accommodationName || "",
          accommodationDescription:
            accommodation.accommodationDescription || "",
          accommodationStar: accommodation.accommodationStar || "",
          accommodationWebsite: accommodation.accommodationWebsite || "",
          images: accommodation.images,
        });
      }
    });

    return { isValid, accommodationData };
  }, [getValues, setError, clearErrors]);

  const addAccommodation = useCallback(() => {
    append(DEFAULT_ACCOMMODATION);
  }, [append]);

  const removeAccommodation = useCallback(
    (index: number) => {
      remove(index);
      clearErrors(`accommodations.${index}` as any);
    },
    [remove, clearErrors],
  );

  const handleClearImages = useCallback(
    (index: number) => {
      setValue(`accommodations.${index}.images`, undefined as any);
      clearErrors(`accommodations.${index}.images` as any);
    },
    [setValue, clearErrors],
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, accommodationData } = validateAndGetFormData();

      if (accommodationData.length === 0) {
        return null;
      }

      return { accommodationData, isValid };
    },
  }));

  const renderImagesSection = (index: number) => {
    const currentAccommodation = watchAccommodations?.[index];
    const hasNewImages = !!currentAccommodation?.images;
    const imageCount = currentAccommodation?.images?.length || 0;
    const firstImageName = currentAccommodation?.images?.[0]?.name || "";
    const hasContent = hasAccommodationContent(currentAccommodation);
    const imagesError = errors.accommodations?.[index]?.images?.message;

    return (
      <div className="space-y-4">
        <CustomImageInput
          title="Accommodation Images"
          disabled={false}
          register={register}
          setValue={setValue}
          error={hasContent && imagesError ? String(imagesError) : ""}
          fieldName={`accommodations.${index}.images`}
        />

        {hasNewImages && imageCount > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700 font-medium">
              {imageCount} image{imageCount > 1 ? "s" : ""} selected
              {imageCount > 1
                ? `, first: ${firstImageName}`
                : `: ${firstImageName}`}
            </p>
            <p className="text-xs text-green-600 mt-1">
              These will be uploaded as new accommodation images.
            </p>
            <button
              type="button"
              onClick={() => handleClearImages(index)}
              className="text-xs text-green-700 hover:text-green-900 underline mt-2"
            >
              Clear selection
            </button>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>• Upload images of the accommodation (optional)</p>
          <p>• Supported formats: JPG, PNG, WebP, GIF</p>
          <p>• Recommended size: 1920x1080 pixels</p>
        </div>
      </div>
    );
  };

  const renderAccommodationForm = (field: { id: string }, index: number) => {
    const nameError =
      errors.accommodations?.[index]?.accommodationName?.message;
    const starError =
      errors.accommodations?.[index]?.accommodationStar?.message;
    const websiteError =
      errors.accommodations?.[index]?.accommodationWebsite?.message;
    const descriptionError =
      errors.accommodations?.[index]?.accommodationDescription?.message;

    return (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center"
      >
        {fields.length >= 1 && (
          <IconButton
            action={() => removeAccommodation(index)}
            style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
          />
        )}

        <div className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={nameError ? String(nameError) : ""}
              title="Accommodation Name *"
              placeholder="Enter accommodation name (e.g., Luxury Hotel, Beach Resort)"
              type="text"
              required
              {...register(
                `accommodations.${index}.accommodationName` as const,
              )}
            />
            <StarInput
              style="bg-white"
              disabled={false}
              error={starError ? String(starError) : ""}
              title="Star Rating"
              placeholder="Enter star rating (e.g., 5-star, 4-star, Budget)"
              type="number"
              {...register(
                `accommodations.${index}.accommodationStar` as const,
              )}
            />
          </div>

          <Input
            style="bg-white"
            disabled={false}
            error={websiteError ? String(websiteError) : ""}
            title="Website URL"
            placeholder="Enter accommodation website URL"
            type="url"
            {...register(
              `accommodations.${index}.accommodationWebsite` as const,
            )}
          />

          <TextArea
            disabled={false}
            error={descriptionError ? String(descriptionError) : ""}
            title="Accommodation Description (Optional)"
            placeholder="Enter detailed description of the accommodation including amenities, location, and features (optional)"
            {...register(
              `accommodations.${index}.accommodationDescription` as const,
            )}
          />

          {renderImagesSection(index)}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="relative w-full flex justify-center">
        <IconButton
          action={addAccommodation}
          style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="New Accommodation"
          icon={<RiAddFill size={16} />}
        />
      </div>

      <div className="w-full space-y-6">
        {fields.map(renderAccommodationForm)}
      </div>
    </div>
  );
});

AccommodationForm.displayName = "AccommodationForm";

export default AccommodationForm;
