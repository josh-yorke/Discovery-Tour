import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

export interface AccommodationFormHandle {
  getFormData: () => Promise<{
    accommodationData: addAccomodationData[];
  } | null>;
}

// Types - Make images required
const accommodationFormSchema = addAccomodationSchema;

type AccommodationFormData = z.infer<typeof accommodationFormSchema>;

const formSchema = z.object({
  accommodations: z.array(accommodationFormSchema),
});

type FormData = z.infer<typeof formSchema>;

// Constants
const DEFAULT_ACCOMMODATION: AccommodationFormData = {
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
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accommodations: [DEFAULT_ACCOMMODATION],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "accommodations",
  });

  const watchAccommodations = watch("accommodations");

  // Handlers
  const addAccommodation = useCallback(() => {
    append(DEFAULT_ACCOMMODATION);
  }, [append]);

  const removeAccommodation = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const handleClearImages = useCallback(
    (index: number) => {
      setValue(`accommodations.${index}.images`, undefined as any, {
        shouldValidate: true,
      });
    },
    [setValue]
  );

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const isValid = await trigger();
      if (!isValid) return null;

      const formData = getValues();
      const accommodationData: addAccomodationData[] = [];

      console.log(
        "🔍 AccommodationForm - formData.accommodations:",
        formData.accommodations
      );
      console.log(
        "🔍 AccommodationForm - isArray:",
        Array.isArray(formData.accommodations)
      );

      // Ensure we're always working with an array
      const accommodationsArray = Array.isArray(formData.accommodations)
        ? formData.accommodations
        : [formData.accommodations];

      accommodationsArray.forEach((accommodation, index) => {
        console.log(`🔍 Processing accommodation ${index}:`, accommodation);

        accommodationData.push({
          accommodationName: accommodation.accommodationName,
          accommodationDescription: accommodation.accommodationDescription,
          accommodationStar: accommodation.accommodationStar,
          accommodationWebsite: accommodation.accommodationWebsite,
          images: accommodation.images,
        });
      });

      console.log(
        "🔍 AccommodationForm - final accommodationData:",
        accommodationData
      );

      return { accommodationData };
    },
  }));

  // FIXED: Updated ImageInput usage
  const renderImagesSection = (index: number) => {
    const currentAccommodation = watchAccommodations?.[index];
    const hasNewImages = !!currentAccommodation?.images;
    const imageCount = currentAccommodation?.images?.length || 0;
    const firstImageName = currentAccommodation?.images?.[0]?.name || "";

    return (
      <div className="space-y-4">
        <CustomImageInput
          title="Accommodation Images"
          disabled={false}
          register={register}
          setValue={setValue}
          error={
            typeof errors.accommodations?.[index]?.images?.message === "string"
              ? errors.accommodations[index]?.images?.message
              : ""
          }
          fieldName={`accommodations.${index}.images`}
        />

        {hasNewImages && imageCount > 0 && (
          <NewImagesDisplay
            imageCount={imageCount}
            firstImageName={firstImageName}
            onClear={() => handleClearImages(index)}
          />
        )}

        <div className="text-xs text-gray-500">
          <p>• At least one image is required for each accommodation</p>
          <p>• Supported formats: JPG, PNG, WebP, GIF</p>
          <p>• Recommended size: 1920x1080 pixels</p>
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
              title="Accommodation Name"
              placeholder="Enter accommodation name (e.g., Luxury Hotel, Beach Resort)"
              type="text"
              {...register(`accommodations.${index}.accommodationName`)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={
                errors.accommodations?.[index]?.accommodationStar?.message || ""
              }
              title="Star Rating"
              placeholder="Enter star rating (e.g., 5-star, 4-star, Budget)"
              type="text"
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
            title="Accommodation Description"
            placeholder="Enter detailed description of the accommodation including amenities, location, and features"
            {...register(`accommodations.${index}.accommodationDescription`)}
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

// Sub-component for new images display
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
    <p className="text-sm text-green-700 font-medium">
      {imageCount} image{imageCount > 1 ? "s" : ""} selected
      {imageCount > 1 ? `, first: ${firstImageName}` : `: ${firstImageName}`}
    </p>
    <p className="text-xs text-green-600 mt-1">
      These will be uploaded as new accommodation images.
    </p>
    <button
      type="button"
      onClick={onClear}
      className="text-xs text-green-700 hover:text-green-900 underline mt-2"
    >
      Clear selection
    </button>
  </div>
);

AccommodationForm.displayName = "AccommodationForm";

export default AccommodationForm;
