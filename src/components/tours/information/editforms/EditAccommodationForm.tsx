import { useForm, useFieldArray } from "react-hook-form";
import {
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { z } from "zod";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import {
  type addAccomodationData,
  type editAccommodationData,
} from "../../../../types/accomodation/addAccomodation";
import CustomImageInput from "../../../input/CustomImageInput";
import IconButton from "../../../button/IconButton";
import Input from "../../../input/Input";
import TextArea from "../../../input/TextArea";
import { fetchImageFiles } from "../../../../utils/fetchImageFiles";
import StarInput from "../../../input/StarInput";

export interface AccommodationFormHandle {
  getFormData: () => Promise<{
    accommodationData: addAccomodationData[];
    isValid?: boolean;
  } | null>;
  removeAccommodationField: (index: number) => void;
}

interface AccommodationFormProps {
  editData?: editAccommodationData[];
  onDeleteFile?: (index: number, fileId: string) => void;
  onDeleteAccommodation?: (accommodationId: string, index: number) => void;
  isDeleting?: boolean;
  isDeletingAccommodation?: boolean;
}

// Check if accommodation has any content (for showing/hiding form)
const hasAccommodationContent = (accommodation: {
  accommodationName?: string;
  accommodationDescription?: string;
  accommodationStar?: string;
  accommodationWebsite?: string;
  images?: FileList | File[];
}): boolean => {
  return (
    (accommodation.accommodationName?.trim() ?? "").length > 0 ||
    (accommodation.accommodationDescription?.trim() ?? "").length > 0 ||
    (accommodation.accommodationStar?.trim() ?? "").length > 0 ||
    (accommodation.accommodationWebsite?.trim() ?? "").length > 0 ||
    (accommodation.images instanceof FileList &&
      accommodation.images.length > 0) ||
    (Array.isArray(accommodation.images) && accommodation.images.length > 0)
  );
};

// Check if accommodation has BOTH required fields
const hasBothRequiredFields = (accommodation: {
  accommodationName?: string;
  accommodationDescription?: string;
}): boolean => {
  return (
    (accommodation.accommodationName?.trim() ?? "").length > 0 &&
    (accommodation.accommodationDescription?.trim() ?? "").length > 0
  );
};

// Only validate required fields
const accommodationSchema = z.object({
  accommodationName: z.string().min(1, "Accommodation name is required"),
  accommodationDescription: z.string().min(1, "Description is required"),
  accommodationStar: z.string().optional(),
  accommodationWebsite: z.string().url().optional().or(z.literal("")),
  images: z.any().optional(),
});

type AccommodationSchemaType = {
  accommodationName: string;
  accommodationDescription: string;
  accommodationStar: string;
  accommodationWebsite?: string;
  images?: FileList | File[];
};

type FormData = { accommodations: AccommodationSchemaType[] };

const DEFAULT_ACCOMMODATION: AccommodationSchemaType = {
  accommodationName: "",
  accommodationDescription: "",
  accommodationStar: "",
  accommodationWebsite: "",
  images: undefined,
};

const getCleanImageName = (imageName: string): string => {
  return imageName?.replace(/^accommodation\s*-\s*/i, "") || "";
};

const mapEditDataToDefaultValues = (
  editData: editAccommodationData[],
): AccommodationSchemaType[] => {
  if (editData.length === 0) return [DEFAULT_ACCOMMODATION];

  return editData.map((data) => ({
    accommodationName: data?.accommodationName || "",
    accommodationDescription: data?.accommodationDescription || "",
    accommodationStar: data?.accommodationStar?.toString() || "",
    accommodationWebsite: data?.accommodationWebsite || "",
    images: undefined,
  }));
};

const EditAccommodationForm = forwardRef<
  AccommodationFormHandle,
  AccommodationFormProps
>(({ editData = [], onDeleteAccommodation }, ref) => {
  const [fetchedImages, setFetchedImages] = useState<File[][]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [hasSetInitialImages, setHasSetInitialImages] = useState<boolean[]>(
    () => editData?.map(() => false) || [],
  );

  // Fetch images only when editData changes
  useEffect(() => {
    const getImages = async () => {
      if (!editData || editData.length === 0) {
        setFetchedImages([]);
        return;
      }

      setIsLoadingImages(true);
      try {
        const imagesPromises = editData.map(async (accommodation) => {
          if (!accommodation?.accommodationImages?.length) {
            return [];
          }
          return await fetchImageFiles(accommodation.accommodationImages);
        });

        const allImages = await Promise.all(imagesPromises);
        setFetchedImages(allImages);
      } finally {
        setIsLoadingImages(false);
      }
    };

    getImages();
  }, [editData]);

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
      accommodations: mapEditDataToDefaultValues(editData),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "accommodations",
  });

  const watchAccommodations = watch("accommodations");

  // Set initial images when fetched
  useEffect(() => {
    if (fetchedImages.length > 0 && editData.length > 0) {
      const newHasSetInitialImages = [...hasSetInitialImages];
      let shouldUpdate = false;

      fetchedImages.forEach((images, index) => {
        if (
          index < newHasSetInitialImages.length &&
          !newHasSetInitialImages[index] &&
          images?.length > 0
        ) {
          const currentField = watchAccommodations?.[index];
          const hasUserSelectedImages =
            (currentField?.images instanceof FileList &&
              currentField.images.length > 0) ||
            (Array.isArray(currentField?.images) &&
              currentField.images.length > 0);

          if (!hasUserSelectedImages) {
            setValue(`accommodations.${index}.images`, images, {
              shouldValidate: true,
            });
            newHasSetInitialImages[index] = true;
            shouldUpdate = true;
          }
        }
      });

      if (shouldUpdate) {
        setHasSetInitialImages(newHasSetInitialImages);
      }
    }
  }, [fetchedImages]);

  const validateAndGetFormData = useCallback(() => {
    const values = getValues();
    const accommodationData: addAccomodationData[] = [];
    let isValid = true;
    let hasAnyContent = false;

    clearErrors();

    values.accommodations.forEach((accommodation, index) => {
      const hasContent = hasAccommodationContent(accommodation);
      const hasBothRequired = hasBothRequiredFields(accommodation);

      // If there's any content in this accommodation
      if (hasContent) {
        hasAnyContent = true;

        // Check if it has both required fields
        if (hasBothRequired) {
          // Validate with schema
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

          // Only add to data if validation passed
          if (result.success) {
            accommodationData.push({
              accommodationName: accommodation.accommodationName,
              accommodationDescription: accommodation.accommodationDescription,
              accommodationStar: accommodation.accommodationStar || "",
              accommodationWebsite: accommodation.accommodationWebsite || "",
              images: accommodation.images,
            });
          }
        } else {
          // Has content but missing one or both required fields
          isValid = false;

          // Set specific errors for missing fields
          if (!accommodation.accommodationName?.trim()) {
            setError(`accommodations.${index}.accommodationName` as any, {
              type: "manual",
              message: "Accommodation name is required",
            });
          }
          if (!accommodation.accommodationDescription?.trim()) {
            setError(
              `accommodations.${index}.accommodationDescription` as any,
              {
                type: "manual",
                message: "Accommodation description is required",
              },
            );
          }
        }
      }
    });

    // If there's no content at all (all fields are empty), return empty data (valid)
    if (!hasAnyContent) {
      return { isValid: true, accommodationData: [] };
    }

    // If there's content but validation failed, return invalid
    if (!isValid) {
      return { isValid: false, accommodationData: [] };
    }

    return { isValid, accommodationData };
  }, [getValues, setError, clearErrors]);

  const addAccommodation = useCallback(() => {
    append({
      ...DEFAULT_ACCOMMODATION,
      images: undefined,
    });

    setHasSetInitialImages((prev) => [...prev, false]);
    setFetchedImages((prev) => [...prev, []]);
  }, [append]);

  const removeAccommodation = useCallback(
    (index: number) => {
      const accommodationItem = editData[index];
      if (accommodationItem?._id && onDeleteAccommodation) {
        onDeleteAccommodation(accommodationItem._id, index);
      } else {
        remove(index);
        clearErrors(`accommodations.${index}` as any);
        setHasSetInitialImages((prev) => {
          const newArray = [...prev];
          newArray.splice(index, 1);
          return newArray;
        });
        setFetchedImages((prev) => {
          const newArray = [...prev];
          newArray.splice(index, 1);
          return newArray;
        });
      }
    },
    [remove, editData, onDeleteAccommodation, clearErrors],
  );

  const handleImageSelect = useCallback(
    (files: File[], index: number) => {
      if (!files || files.length === 0) {
        setValue(`accommodations.${index}.images`, undefined);
        clearErrors(`accommodations.${index}.images` as any);
        return;
      }

      setValue(`accommodations.${index}.images`, files, {
        shouldValidate: true,
      });
      clearErrors(`accommodations.${index}.images` as any);

      setHasSetInitialImages((prev) => {
        const newArray = [...prev];
        newArray[index] = true;
        return newArray;
      });
    },
    [setValue, clearErrors],
  );

  const handleClearImages = useCallback(
    (index: number) => {
      setValue(`accommodations.${index}.images`, undefined);
      clearErrors(`accommodations.${index}.images` as any);

      setHasSetInitialImages((prev) => {
        const newArray = [...prev];
        newArray[index] = false;
        return newArray;
      });
    },
    [setValue, clearErrors],
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, accommodationData } = validateAndGetFormData();

      return {
        accommodationData,
        isValid,
      };
    },
    removeAccommodationField: (index: number) => {
      remove(index);
      setHasSetInitialImages((prev) => {
        const newArray = [...prev];
        newArray.splice(index, 1);
        return newArray;
      });
      setFetchedImages((prev) => {
        const newArray = [...prev];
        newArray.splice(index, 1);
        return newArray;
      });
    },
  }));

  const renderImageSection = (index: number) => {
    const accommodationEditData = editData[index];
    const hasExistingImages =
      accommodationEditData?.accommodationImages &&
      accommodationEditData.accommodationImages.length > 0;

    const currentAccommodation = watchAccommodations?.[index];
    const formImages = currentAccommodation?.images;
    const hasNewImages =
      (formImages instanceof FileList && formImages.length > 0) ||
      (Array.isArray(formImages) && formImages.length > 0);

    const imagesError = errors.accommodations?.[index]?.images?.message;

    return (
      <div className="space-y-4">
        <CustomImageInput
          title="Accommodation Images"
          disabled={false}
          register={register}
          setValue={(fieldName, value) => {
            if (fieldName === `accommodations.${index}.images`) {
              handleImageSelect(value as File[], index);
            }
          }}
          error={imagesError ? String(imagesError) : ""}
          fieldName={`accommodations.${index}.images`}
          initialFiles={fetchedImages[index] || []}
          onFileSelect={(files) => handleImageSelect(files, index)}
        />

        {isLoadingImages && hasExistingImages && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Loading images...</p>
          </div>
        )}

        {!isLoadingImages &&
          hasExistingImages &&
          !hasNewImages &&
          accommodationEditData && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex flex-row items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">
                    Current Images:
                  </p>
                  <ul className="text-sm text-red-700 mt-1 space-y-1">
                    {accommodationEditData.accommodationImages
                      ?.slice(0, 3)
                      .map((fileName, imgIndex) => (
                        <li key={imgIndex} className="truncate">
                          • {getCleanImageName(fileName)}
                        </li>
                      ))}
                    {accommodationEditData.accommodationImages &&
                      accommodationEditData.accommodationImages.length > 3 && (
                        <li className="text-xs text-red-600">
                          • ...and{" "}
                          {accommodationEditData.accommodationImages.length - 3}{" "}
                          more
                        </li>
                      )}
                  </ul>
                </div>
              </div>
            </div>
          )}

        {hasNewImages && formImages && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700 font-medium">
              {formImages instanceof FileList
                ? formImages.length
                : formImages.length}{" "}
              image
              {(formImages instanceof FileList
                ? formImages.length
                : formImages.length) > 1
                ? "s"
                : ""}{" "}
              selected
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
          <p>• If you upload new images, they will replace the existing ones</p>
          <p>• Supported formats: JPG, PNG, WebP, GIF</p>
          <p>• Max file size: 5MB per image</p>
        </div>
      </div>
    );
  };

  const renderAccommodationForm = (field: { id: string }, index: number) => {
    const nameError =
      errors.accommodations?.[index]?.accommodationName?.message;
    const descriptionError =
      errors.accommodations?.[index]?.accommodationDescription?.message;
    const starError =
      errors.accommodations?.[index]?.accommodationStar?.message;
    const websiteError =
      errors.accommodations?.[index]?.accommodationWebsite?.message;

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
            title="Accommodation Description *"
            placeholder="Enter detailed description of the accommodation including amenities, location, and features"
            required
            {...register(
              `accommodations.${index}.accommodationDescription` as const,
            )}
          />

          {renderImageSection(index)}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="w-full flex justify-center">
        <IconButton
          action={addAccommodation}
          style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="New Accommodation"
          icon={<RiAddFill size={16} />}
        />
      </div>

      {fields.map(renderAccommodationForm)}
    </div>
  );
});

EditAccommodationForm.displayName = "EditAccommodationForm";

export default EditAccommodationForm;
