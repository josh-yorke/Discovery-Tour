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

const hasCompleteAccommodation = (accommodation: {
  accommodationName?: string;
  accommodationDescription?: string;
  accommodationStar?: string;
}): boolean => {
  return (
    (accommodation.accommodationName?.trim() ?? "").length > 0 &&
    (accommodation.accommodationDescription?.trim() ?? "").length > 0 &&
    (accommodation.accommodationStar?.trim() ?? "").length > 0
  );
};

const mergedSchema = z
  .object({
    accommodationName: z.string().min(1, "Accommodation name is required"),
    accommodationDescription: z
      .string()
      .min(1, "Accommodation description is required"),
    accommodationStar: z.string().min(1, "Star rating is required"),
    accommodationWebsite: z.string().optional(),
    images: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.images && data.images.length > 0) {
        return true;
      }
      return true;
    },
    {
      message: "Images are required for new accommodations",
      path: ["images"],
    },
  );

type MergedSchemaType = {
  accommodationName: string;
  accommodationDescription: string;
  accommodationStar: string;
  accommodationWebsite?: string;
  images?: FileList | File[];
};

type FormData = { accommodations: MergedSchemaType[] };

const DEFAULT_ACCOMMODATION: MergedSchemaType = {
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
): MergedSchemaType[] => {
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

  useEffect(() => {
    const getImages = async () => {
      if (!editData || editData.length === 0) {
        setFetchedImages([]);
        return;
      }

      setIsLoadingImages(true);
      try {
        const imagesPromises = editData.map(async (accommodation) => {
          if (
            !accommodation?.accommodationImages ||
            accommodation.accommodationImages.length === 0
          ) {
            return [];
          }

          return await fetchImageFiles(accommodation.accommodationImages);
        });

        const allImages = await Promise.all(imagesPromises);
        setFetchedImages(allImages);
      } catch (error) {
        console.error("Error fetching accommodation images:", error);
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

  useEffect(() => {
    if (fetchedImages.length > 0 && editData.length > 0) {
      const newDefaultValues = editData.map((data, index) => ({
        accommodationName: data?.accommodationName || "",
        accommodationDescription: data?.accommodationDescription || "",
        accommodationStar: data?.accommodationStar?.toString() || "",
        accommodationWebsite: data?.accommodationWebsite || "",
        images:
          fetchedImages[index] && fetchedImages[index].length > 0
            ? (fetchedImages[index] as any)
            : undefined,
      }));

      setValue("accommodations", newDefaultValues);
    }
  }, [fetchedImages, editData, setValue]);

  const validateAndGetFormData = useCallback(() => {
    const values = getValues();
    const accommodationData: addAccomodationData[] = [];
    let isValid = true;
    let hasAnyCompleteData = false;

    clearErrors();

    values.accommodations.forEach((accommodation, index) => {
      const hasContent = hasAccommodationContent(accommodation);
      const hasImages =
        (accommodation.images instanceof FileList &&
          accommodation.images.length > 0) ||
        (Array.isArray(accommodation.images) &&
          accommodation.images.length > 0);
      const hasCompleteData = hasCompleteAccommodation(accommodation);

      if (hasContent) {
        const result = mergedSchema.safeParse(accommodation);

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

        if (hasCompleteData) {
          hasAnyCompleteData = true;
          accommodationData.push({
            accommodationName: accommodation.accommodationName,
            accommodationDescription: accommodation.accommodationDescription,
            accommodationStar: accommodation.accommodationStar,
            accommodationWebsite: accommodation.accommodationWebsite || "",
            images: accommodation.images,
          });
        } else if (hasContent && !hasCompleteData) {
          isValid = false;
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
          if (!accommodation.accommodationStar?.trim()) {
            setError(`accommodations.${index}.accommodationStar` as any, {
              type: "manual",
              message: "Star rating is required",
            });
          }
        }

        const isNewAccommodation = !editData[index]?._id;
        if (hasImages && !hasCompleteData) {
          isValid = false;
          setError(`accommodations.${index}.accommodationName` as any, {
            type: "manual",
            message: "Complete all fields before uploading images",
          });
        }

        if (isNewAccommodation && !hasImages && hasCompleteData) {
          isValid = false;
          setError(`accommodations.${index}.images` as any, {
            type: "manual",
            message: "At least one image is required for new accommodations",
          });
        }
      }
    });

    return { isValid, accommodationData, hasAnyCompleteData };
  }, [getValues, setError, clearErrors, editData]);

  const addAccommodation = useCallback(() => {
    append(DEFAULT_ACCOMMODATION);
  }, [append]);

  const removeAccommodation = useCallback(
    (index: number) => {
      const accommodationItem = editData[index];
      if (accommodationItem?._id && onDeleteAccommodation) {
        onDeleteAccommodation(accommodationItem._id, index);
      } else {
        remove(index);
        clearErrors(`accommodations.${index}` as any);
      }
    },
    [remove, editData, onDeleteAccommodation, clearErrors],
  );

  const handleImageSelect = useCallback(
    (files: FileList | null, index: number) => {
      if (!files || files.length === 0) {
        setValue(`accommodations.${index}.images`, undefined);
        clearErrors(`accommodations.${index}.images` as any);
        return;
      }

      const currentAccommodation = watchAccommodations?.[index];
      if (!hasCompleteAccommodation(currentAccommodation)) {
        setError(`accommodations.${index}.accommodationName` as any, {
          type: "manual",
          message: "Complete all fields before uploading images",
        });
        return;
      }

      setValue(`accommodations.${index}.images`, files);
      clearErrors(`accommodations.${index}.images` as any);
    },
    [setValue, watchAccommodations, clearErrors, setError],
  );

  const handleClearImages = useCallback(
    (index: number) => {
      setValue(`accommodations.${index}.images`, undefined);
      clearErrors(`accommodations.${index}.images` as any);
    },
    [setValue, clearErrors],
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const { isValid, accommodationData } = validateAndGetFormData();

      if (!isValid) {
        return null;
      }

      return { accommodationData };
    },
    removeAccommodationField: (index: number) => {
      remove(index);
    },
  }));

  const renderImageSection = (index: number) => {
    const accommodationEditData = editData[index];
    const hasExistingImages =
      accommodationEditData?.accommodationImages?.length > 0;

    const formImages = watchAccommodations?.[index]?.images;
    const hasNewImages =
      (formImages instanceof FileList && formImages.length > 0) ||
      (Array.isArray(formImages) && formImages.length > 0);

    const currentAccommodation = watchAccommodations?.[index];
    const hasContent = hasAccommodationContent(currentAccommodation);
    const imagesError = errors.accommodations?.[index]?.images?.message;
    const nameError =
      errors.accommodations?.[index]?.accommodationName?.message;
    const isNewAccommodation = !accommodationEditData?._id;

    return (
      <div className="space-y-4">
        <CustomImageInput
          title={`Accommodation Images ${isNewAccommodation ? "*" : ""}`}
          disabled={false}
          register={register}
          setValue={(fieldName, value) => {
            if (fieldName === "images") {
              handleImageSelect(value as FileList, index);
            }
          }}
          error={
            hasContent && imagesError
              ? String(imagesError)
              : nameError
                ? String(nameError)
                : ""
          }
          fieldName={`accommodations.${index}.images`}
          initialFiles={fetchedImages[index] || []}
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
                      .slice(0, 3)
                      .map((fileName, imgIndex) => (
                        <li key={imgIndex} className="truncate">
                          • {getCleanImageName(fileName)}
                        </li>
                      ))}
                    {accommodationEditData.accommodationImages.length > 3 && (
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
              New images selected:{" "}
              {formImages instanceof FileList
                ? formImages.length
                : formImages.length}{" "}
              image
              {(formImages instanceof FileList
                ? formImages.length
                : formImages.length) > 1
                ? "s"
                : ""}
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
          <p>• Complete all fields before uploading images</p>
          <p>• At least one image is required for new accommodations</p>
          <p>• If you upload new images, they will replace the existing ones</p>
          <p>• Supported formats: JPG, PNG, WebP, GIF</p>
          <p>• Max file size: 5MB per image</p>
        </div>
      </div>
    );
  };

  const renderAccommodationForm = (field: { id: string }, index: number) => {
    const currentAccommodation = watchAccommodations?.[index];
    const hasContent = hasAccommodationContent(currentAccommodation);
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
              error={hasContent && nameError ? String(nameError) : ""}
              title="Accommodation Name *"
              placeholder="Enter accommodation name (e.g., Luxury Hotel, Beach Resort)"
              type="text"
              {...register(
                `accommodations.${index}.accommodationName` as const,
              )}
            />
            <StarInput
              style="bg-white"
              disabled={false}
              error={hasContent && starError ? String(starError) : ""}
              title="Star Rating *"
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
            error={hasContent && websiteError ? String(websiteError) : ""}
            title="Website URL"
            placeholder="Enter accommodation website URL"
            type="url"
            {...register(
              `accommodations.${index}.accommodationWebsite` as const,
            )}
          />

          <TextArea
            disabled={false}
            error={
              hasContent && descriptionError ? String(descriptionError) : ""
            }
            title="Accommodation Description *"
            placeholder="Enter detailed description of the accommodation including amenities, location, and features"
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
