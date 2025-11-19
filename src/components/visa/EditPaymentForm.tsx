import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useCallback, useEffect } from "react";
import {
  addPaymentSchema,
  type addPaymentData,
  type editPaymentData,
} from "../../types/payments/addPaymentTypes";
import Input from "../input/Input";
import InputOption from "../input/InputOption";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import { z } from "zod";

// UPDATED: Add removePaymentField method
export interface PaymentFormHandle {
  getFormData: () => Promise<{
    paymentData: addPaymentData[];
  } | null>;
  removePaymentField: (index: number) => void;
}

// UPDATED: Interface with new props for multiple payments
interface PaymentFormProps {
  editData?: editPaymentData[];
  onDeletePayment?: (paymentId: string, index: number) => void;
  isDeletingPayment?: boolean;
}

// Create form schema with array of payments
const formSchema = z.object({
  payments: z.array(addPaymentSchema),
});

type FormData = z.infer<typeof formSchema>;

// Constants
const DEFAULT_PAYMENT: addPaymentData = {
  paymentType: "",
  currency: "",
  accountName: "",
  bankName: "",
  accountNo: "",
  bankAddress: "",
  swiftCode: "",
};

// Helper functions
const mapEditDataToDefaultValues = (
  editData: editPaymentData[]
): addPaymentData[] => {
  if (editData.length === 0) return [DEFAULT_PAYMENT];

  return editData.map((data) => ({
    paymentType: data?.type || "",
    currency: data?.currency || "",
    accountName: data?.accountName || "",
    bankName: data?.bankName || "",
    accountNo: data?.accountNo || "",
    bankAddress: data?.bankAddress || "",
    swiftCode: data?.swiftCode || "",
  }));
};

// FIX: Create a type that includes _id for existing payments
interface PaymentWithId extends editPaymentData {
  _id: string;
}

const EditPaymentForm = forwardRef<PaymentFormHandle, PaymentFormProps>(
  ({ editData = [], onDeletePayment }, ref) => {
    const {
      register,
      control,
      formState: { errors },
      trigger,
      getValues,
      reset,
    } = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        payments: mapEditDataToDefaultValues(editData),
      },
      mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "payments",
    });

    // Pre-fill form when editData changes
    useEffect(() => {
      if (editData.length > 0) {
        reset({
          payments: mapEditDataToDefaultValues(editData),
        });
      }
    }, [editData, reset]);

    // Handlers
    const addPayment = useCallback(() => {
      append(DEFAULT_PAYMENT);
    }, [append]);

    // FIXED: Remove payment function with proper type handling
    const removePayment = useCallback(
      (index: number) => {
        if (fields.length > 1) {
          const paymentItem = editData[index];
          // Use type assertion to safely access _id
          const paymentWithId = paymentItem as PaymentWithId;

          // If it's an existing payment (has _id), use API deletion
          if (paymentWithId?._id && onDeletePayment) {
            onDeletePayment(paymentWithId._id, index);
          } else {
            // If it's a new payment (no _id), just remove from local state
            remove(index);
          }
        }
      },
      [fields.length, remove, editData, onDeletePayment]
    );

    // UPDATED: Expose form data and remove method to parent
    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const isValid = await trigger();
        if (!isValid) return null;

        const formData = getValues();
        const paymentData: addPaymentData[] = [];

        console.log(
          "🔍 EditPaymentForm - formData.payments:",
          formData.payments
        );
        console.log(
          "🔍 EditPaymentForm - isArray:",
          Array.isArray(formData.payments)
        );

        // FIX: Ensure we're always working with an array
        const paymentsArray = Array.isArray(formData.payments)
          ? formData.payments
          : [formData.payments];

        paymentsArray.forEach((payment, index) => {
          console.log(`🔍 Processing payment ${index}:`, payment);

          paymentData.push({
            paymentType: payment.paymentType,
            currency: payment.currency,
            accountName: payment.accountName,
            bankName: payment.bankName,
            accountNo: payment.accountNo,
            bankAddress: payment.bankAddress,
            swiftCode: payment.swiftCode,
          });
        });

        console.log("🔍 EditPaymentForm - final paymentData:", paymentData);

        return { paymentData };
      },
      removePaymentField: (index: number) => {
        if (fields.length > 1) {
          remove(index);
        }
      },
    }));

    // FIXED: Render function with proper type handling
    const renderPaymentForm = (field: { id: string }, index: number) => {
      // const paymentItem = editData[index];
      // // Use type assertion to safely access _id
      // const paymentWithId = paymentItem as PaymentWithId;
      // const isExistingPayment = !!paymentWithId?._id;
      // const isThisPaymentDeleting = isExistingPayment && isDeletingPayment;

      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {fields.length > 1 && (
            <IconButton
              action={() => removePayment(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
              // isLoading={isThisPaymentDeleting}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <Input
              disabled={false}
              error={errors.payments?.[index]?.paymentType?.message || ""}
              title="Payment Type"
              placeholder="Enter payment type (e.g., Bank Transfer, Credit Card)"
              type="text"
              {...register(`payments.${index}.paymentType`)}
            />
            <InputOption
              disabled={false}
              options={["PHP", "KRW", "JPY", "USD"]}
              title="Currency"
              {...register(`payments.${index}.currency`)}
              style="bg-white w-full"
            />
            <Input
              disabled={false}
              error={errors.payments?.[index]?.accountName?.message || ""}
              title="Account Name"
              placeholder="Enter account holder name"
              type="text"
              {...register(`payments.${index}.accountName`)}
            />
            <Input
              disabled={false}
              error={errors.payments?.[index]?.bankName?.message || ""}
              title="Bank Name"
              placeholder="Enter bank name"
              type="text"
              {...register(`payments.${index}.bankName`)}
            />
            <Input
              disabled={false}
              error={errors.payments?.[index]?.accountNo?.message || ""}
              title="Account Number"
              placeholder="Enter account number"
              type="text"
              {...register(`payments.${index}.accountNo`)}
            />
            <Input
              disabled={false}
              error={errors.payments?.[index]?.bankAddress?.message || ""}
              title="Bank Address"
              placeholder="Enter bank branch address"
              type="text"
              {...register(`payments.${index}.bankAddress`)}
            />
            <Input
              disabled={false}
              error={errors.payments?.[index]?.swiftCode?.message || ""}
              title="SWIFT Code"
              placeholder="Enter SWIFT/BIC code"
              type="text"
              {...register(`payments.${index}.swiftCode`)}
            />
          </div>
        </div>
      );
    };

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6">
        <div className="w-full flex justify-center">
          <IconButton
            action={addPayment}
            style="bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="New Payment Method"
            icon={<RiAddFill size={16} />}
          />
        </div>

        {fields.map(renderPaymentForm)}
      </div>
    );
  }
);

EditPaymentForm.displayName = "EditPaymentForm";

export default EditPaymentForm;
