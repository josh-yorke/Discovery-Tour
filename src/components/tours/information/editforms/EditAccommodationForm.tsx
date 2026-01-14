import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const accommodationWithImagesSchema = z
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
    }
  );

type AccommodationWithImagesData = {
  accommodationName: string;
  accommodationDescription: string;
  accommodationStar: string;
  accommodationWebsite?: string;
  images?: FileList | File[];
};

const formSchema = z.object({
  accommodations: z
    .array(accommodationWithImagesSchema)
    .min(1, "At least one accommodation is required")
    .refine(
      (accommodations) => {
        return accommodations.every(
          (accommodation) =>
            accommodation.accommodationName.trim() !== "" &&
            accommodation.accommodationDescription.trim() !== "" &&
            accommodation.accommodationStar.trim() !== ""
        );
      },
      {
        message:
          "All accommodations must have Name, Description, and Star Rating filled out",
      }
    ),
});

type FormData = z.infer<typeof formSchema>;

const DEFAULT_ACCOMMODATION: AccommodationWithImagesData = {
  accommodationName: "",
  accommodationDescription: "",
  accommodationStar: "",
  accommodationWebsite: "",
  images: undefined,
};

const mapEditDataToDefaultValues = (
  editData: editAccommodationData[]
): AccommodationWithImagesData[] => {
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
>(({ editData = [], onDeleteAccommodation, isDeleting }, ref) => {
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
    trigger,
    getValues,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accommodations: mapEditDataToDefaultValues(editData),
    },
    mode: "onChange",
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

      reset({
        accommodations: newDefaultValues,
      });
    }
  }, [fetchedImages, editData, reset]);

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
      }
    },
    [remove, editData, onDeleteAccommodation]
  );

  const handleClearImages = useCallback(
    (index: number) => {
      setValue(`accommodations.${index}.images`, undefined);
    },
    [setValue]
  );

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      console.log("🔄 Validating accommodation form...");

      const isValid = await trigger();
      if (!isValid) {
        console.log("❌ Zod validation failed");
        return null;
      }

      const formData = getValues();
      const accommodationData: addAccomodationData[] = [];

      const accommodationsArray = Array.isArray(formData.accommodations)
        ? formData.accommodations
        : [formData.accommodations];

      console.log("📋 Raw accommodations data:", accommodationsArray);

      for (let i = 0; i < accommodationsArray.length; i++) {
        const accommodation = accommodationsArray[i];

        const hasName =
          accommodation.accommodationName &&
          accommodation.accommodationName.trim() !== "";
        const hasDescription =
          accommodation.accommodationDescription &&
          accommodation.accommodationDescription.trim() !== "";
        const hasStar =
          accommodation.accommodationStar &&
          accommodation.accommodationStar.trim() !== "";

        const hasImages =
          (accommodation.images instanceof FileList &&
            accommodation.images.length > 0) ||
          (Array.isArray(accommodation.images) &&
            accommodation.images.length > 0);

        console.log(`📝 Accommodation ${i}:`, {
          hasName,
          hasDescription,
          hasStar,
          hasImages,
          name: accommodation.accommodationName,
          star: accommodation.accommodationStar,
          imagesType: accommodation.images?.constructor?.name,
          imagesLength: accommodation.images?.length || 0,
        });

        if ((!hasName || !hasDescription || !hasStar) && hasImages) {
          alert(
            `❌ Accommodation #${
              i + 1
            }: Please fill out Name, Description, and Star Rating before uploading images.`
          );
          return null;
        }

        const isNewAccommodation = !editData[i]?._id;
        if (isNewAccommodation && !hasImages) {
          alert(
            `❌ Accommodation #${
              i + 1
            }: At least one image is required for new accommodations.`
          );
          return null;
        }

        if (hasName && hasDescription && hasStar) {
          accommodationData.push({
            accommodationName: accommodation.accommodationName,
            accommodationDescription: accommodation.accommodationDescription,
            accommodationStar: accommodation.accommodationStar,
            accommodationWebsite: accommodation.accommodationWebsite || "",
            images: accommodation.images,
          });
        } else {
          console.log(
            `⚠️ Skipping accommodation ${i} - missing required fields`
          );
        }
      }

      if (accommodationData.length === 0) {
        alert(
          "❌ Please fill out all required fields (Name, Description, and Star Rating) for at least one accommodation."
        );
        return null;
      }

      console.log("✅ Valid accommodations:", accommodationData.length);
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

    const isNewAccommodation = !accommodationEditData?._id;

    return (
      <div className="space-y-4">
        <CustomImageInput
          title={`Accommodation Images ${isNewAccommodation ? "*" : ""}`}
          disabled={false}
          register={register}
          setValue={setValue}
          error={
            typeof errors.accommodations?.[index]?.images?.message === "string"
              ? errors.accommodations[index]?.images?.message
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
            <ExistingImagesDisplay
              imageFiles={accommodationEditData.accommodationImages || []}
              isDeleting={isDeleting}
            />
          )}

        {hasNewImages && formImages && (
          <NewImagesDisplay
            imageCount={
              formImages instanceof FileList
                ? formImages.length
                : formImages.length
            }
            firstImageName={
              formImages instanceof FileList
                ? formImages[0]?.name || ""
                : formImages[0]?.name || ""
            }
            onClear={() => handleClearImages(index)}
          />
        )}

        <div className="text-xs text-gray-500">
          <p>
            •{" "}
            <strong>
              {isNewAccommodation
                ? "At least one image is required for new accommodations"
                : "Images are optional for existing accommodations"}
            </strong>
          </p>
          <p>• If you upload new images, they will replace the existing ones</p>
          <p>• Supported formats: JPG, PNG, WebP, GIF</p>
          <p>• Max file size: 5MB per image</p>
        </div>
      </div>
    );
  };

  const renderAccommodationForm = (field: { id: string }, index: number) => {
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
              error={
                errors.accommodations?.[index]?.accommodationName?.message || ""
              }
              title="Accommodation Name *"
              placeholder="Enter accommodation name (e.g., Luxury Hotel, Beach Resort)"
              type="text"
              {...register(`accommodations.${index}.accommodationName`)}
            />
            <StarInput
              style="bg-white"
              disabled={false}
              error={
                errors.accommodations?.[index]?.accommodationStar?.message || ""
              }
              title="Star Rating *"
              placeholder="Enter star rating (e.g., 5-star, 4-star, Budget)"
              type="number"
              {...register(`accommodations.${index}.accommodationStar`)}
            />
          </div>

          <Input
            style="bg-white"
            disabled={false}
            error={
              errors.accommodations?.[index]?.accommodationWebsite?.message ||
              ""
            }
            title="Website URL"
            placeholder="Enter accommodation website URL"
            type="url"
            {...register(`accommodations.${index}.accommodationWebsite`)}
          />

          <TextArea
            disabled={false}
            error={
              errors.accommodations?.[index]?.accommodationDescription
                ?.message || ""
            }
            title="Accommodation Description *"
            placeholder="Enter detailed description of the accommodation including amenities, location, and features"
            {...register(`accommodations.${index}.accommodationDescription`)}
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

interface ExistingImagesDisplayProps {
  imageFiles: string[];
  isDeleting?: boolean;
}

const ExistingImagesDisplay: React.FC<ExistingImagesDisplayProps> = ({
  imageFiles,
}) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div className="flex flex-row items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-900">Current Images:</p>
        <ul className="text-sm text-blue-700 mt-1 space-y-1">
          {imageFiles.slice(0, 3).map((fileName, index) => (
            <li key={index} className="truncate">
              • {fileName}
            </li>
          ))}
          {imageFiles.length > 3 && (
            <li className="text-xs text-blue-600">
              • ...and {imageFiles.length - 3} more
            </li>
          )}
        </ul>
        <p className="text-xs text-blue-600 mt-2">
          Total: {imageFiles.length} image{imageFiles.length > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  </div>
);

interface NewImagesDisplayProps {
  imageCount: number;
  firstImageName: string;
  onClear: () => void;
}

const NewImagesDisplay: React.FC<NewImagesDisplayProps> = ({
  imageCount,
  firstImageName,
  onClear,
}) => (
  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-green-700 font-medium">
          {imageCount} new image{imageCount > 1 ? "s" : ""} selected
          {imageCount > 1
            ? `, first: ${firstImageName}`
            : `: ${firstImageName}`}
        </p>
        <p className="text-xs text-green-600 mt-1">
          These will be uploaded as new accommodation images.
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="text-xs text-green-700 hover:text-green-900 underline ml-4"
      >
        Clear selection
      </button>
    </div>
  </div>
);

EditAccommodationForm.displayName = "EditAccommodationForm";

export default EditAccommodationForm;
