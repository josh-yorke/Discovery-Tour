// components/tours/add/addforms/ScopeForm.tsx
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import IconButton from "../../../button/IconButton";
import Input from "../../../input/Input";
import TextArea from "../../../input/TextArea";
import {
  addScopeSchema,
  type addScopeData,
} from "../../../../types/scope/addScope";
import InputOption from "../../../input/InputOption";

export interface ScopeFormHandle {
  getFormData: () => Promise<{
    scopeData: addScopeData[];
  } | null>;
}

// Types
const scopeFormSchema = addScopeSchema;

type ScopeFormData = z.infer<typeof scopeFormSchema>;

const formSchema = z.object({
  scopes: z.array(scopeFormSchema),
});

type FormData = z.infer<typeof formSchema>;

// Constants
const DEFAULT_SCOPE: ScopeFormData = {
  scopeCategory: "",
  scopeType: "",
  scopeTitle: "",
  scopeDescription: "",
};

const ScopeForm = forwardRef<ScopeFormHandle>((_props, ref) => {
  const {
    register,
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scopes: [DEFAULT_SCOPE],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "scopes",
  });

  // Handlers
  const addScope = useCallback(() => {
    append(DEFAULT_SCOPE);
  }, [append]);

  const removeScope = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      const isValid = await trigger();
      if (!isValid) return null;

      const formData = getValues();
      const scopeData: addScopeData[] = [];

      console.log("🔍 ScopeForm - formData.scopes:", formData.scopes);
      console.log("🔍 ScopeForm - isArray:", Array.isArray(formData.scopes));

      // Ensure we're always working with an array
      const scopesArray = Array.isArray(formData.scopes)
        ? formData.scopes
        : [formData.scopes];

      scopesArray.forEach((scope, index) => {
        console.log(`🔍 Processing scope ${index}:`, scope);

        scopeData.push({
          scopeCategory: scope.scopeCategory,
          scopeType: scope.scopeType,
          scopeTitle: scope.scopeTitle,
          scopeDescription: scope.scopeDescription,
        });
      });

      console.log("🔍 ScopeForm - final scopeData:", scopeData);

      return { scopeData };
    },
  }));

  const renderScopeForm = (field: { id: string }, index: number) => {
    return (
      <div
        key={field.id}
        className="w-full flex flex-col items-end justify-center"
      >
        {fields.length >= 1 && (
          <IconButton
            action={() => removeScope(index)}
            style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
            title=""
            icon={<RiDeleteBin4Fill size={16} />}
          />
        )}

        <div className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputOption
              disabled={false}
              style="bg-white w-full"
              title="Scope Category"
              options={["inclusion", "exclusion"]}
              {...register(`scopes.${index}.scopeCategory`)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={errors.scopes?.[index]?.scopeType?.message || ""}
              title="Scope Type"
              placeholder="Enter scope type (e.g., Standard, Premium, Optional)"
              type="text"
              {...register(`scopes.${index}.scopeType`)}
            />
          </div>

          <Input
            style="bg-white"
            disabled={false}
            error={errors.scopes?.[index]?.scopeTitle?.message || ""}
            title="Scope Title"
            placeholder="Enter scope title (e.g., Transportation, Meals, Activities)"
            type="text"
            {...register(`scopes.${index}.scopeTitle`)}
          />

          <TextArea
            disabled={false}
            error={errors.scopes?.[index]?.scopeDescription?.message || ""}
            title="Scope Description"
            placeholder="Enter detailed description of what this scope includes"
            {...register(`scopes.${index}.scopeDescription`)}
          />

          <div className="text-xs text-gray-500">
            <p>
              • Scope category defines the main classification
              (Inclusions/Exclusions)
            </p>
            <p>• Scope type indicates the level or tier of the scope</p>
            <p>• Scope title should be clear and descriptive</p>
            <p>• Provide comprehensive details in the description</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <div className="relative w-full flex justify-center">
        <IconButton
          action={addScope}
          style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
          title="New Scope"
          icon={<RiAddFill size={16} />}
        />
      </div>

      <div className="w-full space-y-6">{fields.map(renderScopeForm)}</div>
    </div>
  );
});

ScopeForm.displayName = "ScopeForm";

export default ScopeForm;
