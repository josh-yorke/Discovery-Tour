import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback } from "react";
import { z } from "zod";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import {
  type addScopeData,
  type editScopeData,
} from "../../../../types/scope/addScope";
import IconButton from "../../../button/IconButton";
import Input from "../../../input/Input";
import TextArea from "../../../input/TextArea";
import InputOption from "../../../input/InputOption";

export interface ScopeFormHandle {
  getFormData: () => Promise<{
    scopeData: addScopeData[];
  } | null>;
  removeScopeField: (index: number) => void;
}

interface ScopeFormProps {
  editData?: editScopeData[];
  onDeleteScope?: (scopeId: string, index: number) => void;
  isDeletingScope?: boolean;
}

// Helper functions similar to pricelist form
const hasScopeContent = (scope: {
  scopeCategory?: string;
  scopeType?: string;
  scopeTitle?: string;
  scopeDescription?: string;
}): boolean => {
  return (
    (scope.scopeCategory?.trim() ?? "").length > 0 ||
    (scope.scopeType?.trim() ?? "").length > 0 ||
    (scope.scopeTitle?.trim() ?? "").length > 0 ||
    (scope.scopeDescription?.trim() ?? "").length > 0
  );
};

const hasCompleteScope = (scope: {
  scopeCategory?: string;
  scopeType?: string;
  scopeTitle?: string;
  scopeDescription?: string;
}): boolean => {
  return (
    (scope.scopeCategory?.trim() ?? "").length > 0 &&
    (scope.scopeType?.trim() ?? "").length > 0 &&
    (scope.scopeTitle?.trim() ?? "").length > 0 &&
    (scope.scopeDescription?.trim() ?? "").length > 0
  );
};

const scopeSchema = z.object({
  scopeCategory: z.string().min(1, "Scope category is required"),
  scopeType: z.string().min(1, "Scope type is required"),
  scopeTitle: z.string().min(1, "Scope title is required"),
  scopeDescription: z.string().min(1, "Scope description is required"),
});

type ScopeSchemaType = {
  scopeCategory: string;
  scopeType: string;
  scopeTitle: string;
  scopeDescription: string;
};

type FormData = { scopes: ScopeSchemaType[] };

const DEFAULT_SCOPE: ScopeSchemaType = {
  scopeCategory: "",
  scopeType: "",
  scopeTitle: "",
  scopeDescription: "",
};

const mapEditDataToDefaultValues = (
  editData: editScopeData[],
): ScopeSchemaType[] => {
  if (editData.length === 0) return [DEFAULT_SCOPE];

  return editData.map((data) => ({
    scopeCategory: data?.scopeCategory || "",
    scopeType: data?.scopeType || "",
    scopeTitle: data?.scopeTitle || "",
    scopeDescription: data?.scopeDescription || "",
  }));
};

const EditScopeForm = forwardRef<ScopeFormHandle, ScopeFormProps>(
  ({ editData = [], onDeleteScope }, ref) => {
    const {
      register,
      control,
      formState: { errors },
      watch,
      getValues,
      clearErrors,
      setError,
    } = useForm<FormData>({
      mode: "onChange",
      defaultValues: {
        scopes: mapEditDataToDefaultValues(editData),
      },
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "scopes",
    });

    const watchScopes = watch("scopes");

    const validateAndGetFormData = useCallback(() => {
      const values = getValues();
      const scopeData: addScopeData[] = [];
      let isValid = true;
      let hasAnyCompleteData = false;

      clearErrors();

      values.scopes.forEach((scope, index) => {
        const hasContent = hasScopeContent(scope);
        const hasCompleteData = hasCompleteScope(scope);

        // If there's any content at all, validate it
        if (hasContent) {
          const result = scopeSchema.safeParse(scope);

          if (!result.success) {
            isValid = false;
            result.error.issues.forEach((issue) => {
              const path = issue.path[0];
              if (typeof path === "string") {
                setError(`scopes.${index}.${path}` as any, {
                  type: "manual",
                  message: issue.message,
                });
              }
            });
          }

          // Only add to data array if it's complete
          if (hasCompleteData) {
            hasAnyCompleteData = true;
            scopeData.push({
              scopeCategory: scope.scopeCategory,
              scopeType: scope.scopeType,
              scopeTitle: scope.scopeTitle,
              scopeDescription: scope.scopeDescription,
            });
          } else if (hasContent && !hasCompleteData) {
            // If there's content but it's incomplete, show validation errors
            isValid = false;
            if (!scope.scopeCategory?.trim()) {
              setError(`scopes.${index}.scopeCategory` as any, {
                type: "manual",
                message: "Scope category is required",
              });
            }
            if (!scope.scopeType?.trim()) {
              setError(`scopes.${index}.scopeType` as any, {
                type: "manual",
                message: "Scope type is required",
              });
            }
            if (!scope.scopeTitle?.trim()) {
              setError(`scopes.${index}.scopeTitle` as any, {
                type: "manual",
                message: "Scope title is required",
              });
            }
            if (!scope.scopeDescription?.trim()) {
              setError(`scopes.${index}.scopeDescription` as any, {
                type: "manual",
                message: "Scope description is required",
              });
            }
          }
        }
      });

      // Additional check: if there's at least one scope with content but none are complete
      const anyScopeHasContent = values.scopes.some((scope) =>
        hasScopeContent(scope),
      );
      if (anyScopeHasContent && !hasAnyCompleteData) {
        isValid = false;
        // Find the first incomplete scope and highlight its error
        const firstIncompleteIndex = values.scopes.findIndex(
          (scope) => hasScopeContent(scope) && !hasCompleteScope(scope),
        );
        if (firstIncompleteIndex >= 0) {
          const incompleteScope = values.scopes[firstIncompleteIndex];
          if (!incompleteScope.scopeCategory?.trim()) {
            setError(`scopes.${firstIncompleteIndex}.scopeCategory` as any, {
              type: "manual",
              message: "Scope category is required",
            });
          }
          if (!incompleteScope.scopeType?.trim()) {
            setError(`scopes.${firstIncompleteIndex}.scopeType` as any, {
              type: "manual",
              message: "Scope type is required",
            });
          }
        }
      }

      return { isValid, scopeData, hasAnyCompleteData };
    }, [getValues, setError, clearErrors]);

    const addScope = useCallback(() => {
      append(DEFAULT_SCOPE);
    }, [append]);

    const removeScope = useCallback(
      (index: number) => {
        const scopeItem = editData[index];
        if (scopeItem?._id && onDeleteScope) {
          onDeleteScope(scopeItem._id, index);
        } else {
          remove(index);
          clearErrors(`scopes.${index}` as any);
        }
      },
      [remove, editData, onDeleteScope, clearErrors],
    );

    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const { isValid, scopeData } = validateAndGetFormData();

        // Only return null if there are validation errors
        if (!isValid) {
          return null;
        }

        // Return data even if arrays are empty (form is valid but has no complete data)
        // But in this case, we should check if we have any data to submit
        if (scopeData.length === 0) {
          // If user has entered any content but it's incomplete, don't submit
          const values = getValues();
          const anyScopeHasContent = values.scopes.some((scope) =>
            hasScopeContent(scope),
          );
          if (anyScopeHasContent) {
            // Show an alert or handle the case where there's partial data
            console.log("Partial scope data exists but is incomplete");
            return null;
          }
          // If no content at all, it's valid but empty
          return { scopeData: [] };
        }

        return { scopeData };
      },
      removeScopeField: (index: number) => {
        remove(index);
      },
    }));

    const renderScopeForm = (field: { id: string }, index: number) => {
      const currentScope = watchScopes?.[index];
      const hasContent = hasScopeContent(currentScope);
      // const categoryError = errors.scopes?.[index]?.scopeCategory?.message;
      const typeError = errors.scopes?.[index]?.scopeType?.message;
      const titleError = errors.scopes?.[index]?.scopeTitle?.message;
      const descriptionError =
        errors.scopes?.[index]?.scopeDescription?.message;

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
                {...register(`scopes.${index}.scopeCategory` as const)}
              />
              <Input
                style="bg-white"
                disabled={false}
                error={hasContent && typeError ? String(typeError) : ""}
                title="Scope Type *"
                placeholder="Enter scope type (e.g., Standard, Premium, Optional)"
                type="text"
                {...register(`scopes.${index}.scopeType` as const)}
              />
            </div>

            <Input
              style="bg-white"
              disabled={false}
              error={hasContent && titleError ? String(titleError) : ""}
              title="Scope Title *"
              placeholder="Enter scope title (e.g., Transportation, Meals, Activities)"
              type="text"
              {...register(`scopes.${index}.scopeTitle` as const)}
            />

            <TextArea
              disabled={false}
              error={
                hasContent && descriptionError ? String(descriptionError) : ""
              }
              title="Scope Description *"
              placeholder="Enter detailed description of what this scope includes"
              {...register(`scopes.${index}.scopeDescription` as const)}
            />

            <div className="text-xs text-gray-500">
              <p>
                • <strong>Scope category</strong> defines the main
                classification (Inclusions/Exclusions/Requirements)
              </p>
              <p>
                • <strong>Scope type</strong> indicates the level or tier of the
                scope
              </p>
              <p>
                • <strong>Scope title</strong> should be clear and descriptive
              </p>
              <p>
                • <strong>Provide comprehensive details</strong> in the
                description
              </p>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6">
        <div className="w-full flex justify-center">
          <IconButton
            action={addScope}
            style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="New Scope"
            icon={<RiAddFill size={16} />}
          />
        </div>

        {fields.map(renderScopeForm)}
      </div>
    );
  },
);

EditScopeForm.displayName = "EditScopeForm";

export default EditScopeForm;
