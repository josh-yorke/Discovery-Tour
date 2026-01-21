import { useForm, useFieldArray } from "react-hook-form";
import { useImperativeHandle, forwardRef, useCallback, useEffect } from "react";
import {
  type addPaymentData,
  type editPaymentData,
} from "../../types/payments/addPaymentTypes";
import Input from "../input/Input";
import InputOption from "../input/InputOption";
import IconButton from "../button/IconButton";
import { RiAddFill, RiDeleteBin4Fill } from "react-icons/ri";
import { z } from "zod";

export interface PaymentFormHandle {
  getFormData: () => Promise<{
    paymentData: addPaymentData[];
  } | null>;
  removePaymentField: (index: number) => void;
}

interface PaymentFormProps {
  editData?: editPaymentData[];
  onDeletePayment?: (paymentId: string, index: number) => void;
  isDeletingPayment?: boolean;
}

const hasPaymentContent = (payment: addPaymentData): boolean => {
  return (
    (payment.paymentType?.trim() ?? "").length > 0 ||
    (payment.currency?.trim() ?? "").length > 0 ||
    (payment.accountName?.trim() ?? "").length > 0 ||
    (payment.bankName?.trim() ?? "").length > 0 ||
    (payment.accountNo?.trim() ?? "").length > 0 ||
    (payment.bankAddress?.trim() ?? "").length > 0 ||
    (payment.swiftCode?.trim() ?? "").length > 0
  );
};

const hasCompletePayment = (payment: addPaymentData): boolean => {
  return (
    (payment.paymentType?.trim() ?? "").length > 0 &&
    (payment.currency?.trim() ?? "").length > 0 &&
    (payment.accountName?.trim() ?? "").length > 0 &&
    (payment.bankName?.trim() ?? "").length > 0 &&
    (payment.accountNo?.trim() ?? "").length > 0 &&
    (payment.bankAddress?.trim() ?? "").length > 0 &&
    (payment.swiftCode?.trim() ?? "").length > 0
  );
};

const mergedSchema = z.object({
  paymentType: z.string().min(1, "Payment type is required"),
  currency: z.string().min(1, "Currency is required"),
  accountName: z.string().min(1, "Account name is required"),
  bankName: z.string().min(1, "Bank name is required"),
  accountNo: z.string().min(1, "Account number is required"),
  bankAddress: z.string().min(1, "Bank address is required"),
  swiftCode: z.string().min(1, "SWIFT code is required"),
});

type FormData = { payments: addPaymentData[] };

const DEFAULT_PAYMENT: addPaymentData = {
  paymentType: "",
  currency: "",
  accountName: "",
  bankName: "",
  accountNo: "",
  bankAddress: "",
  swiftCode: "",
};

const mapEditDataToDefaultValues = (
  editData: editPaymentData[],
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

interface PaymentWithId extends editPaymentData {
  _id: string;
}

const EditPaymentForm = forwardRef<PaymentFormHandle, PaymentFormProps>(
  ({ editData = [], onDeletePayment }, ref) => {
    const {
      register,
      control,
      formState: { errors },
      getValues,
      clearErrors,
      setError,
      reset,
    } = useForm<FormData>({
      mode: "onChange",
      defaultValues: {
        payments: mapEditDataToDefaultValues(editData),
      },
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "payments",
    });

    useEffect(() => {
      if (editData.length > 0) {
        reset({
          payments: mapEditDataToDefaultValues(editData),
        });
      }
    }, [editData, reset]);

    const validateAndGetFormData = useCallback(() => {
      const values = getValues();
      const paymentData: addPaymentData[] = [];
      let isValid = true;
      let hasAnyCompleteData = false;

      clearErrors();

      values.payments.forEach((payment, index) => {
        const hasContent = hasPaymentContent(payment);
        const hasCompleteData = hasCompletePayment(payment);

        if (hasContent) {
          const result = mergedSchema.safeParse(payment);

          if (!result.success) {
            isValid = false;
            result.error.issues.forEach((issue) => {
              const path = issue.path[0];
              if (typeof path === "string") {
                setError(`payments.${index}.${path}` as any, {
                  type: "manual",
                  message: issue.message,
                });
              }
            });
          }

          if (hasCompleteData) {
            hasAnyCompleteData = true;
            paymentData.push({
              paymentType: payment.paymentType,
              currency: payment.currency,
              accountName: payment.accountName,
              bankName: payment.bankName,
              accountNo: payment.accountNo,
              bankAddress: payment.bankAddress,
              swiftCode: payment.swiftCode,
            });
          } else if (hasContent && !hasCompleteData) {
            isValid = false;
            if (!payment.paymentType?.trim()) {
              setError(`payments.${index}.paymentType` as any, {
                type: "manual",
                message: "Payment type is required",
              });
            }
            if (!payment.currency?.trim()) {
              setError(`payments.${index}.currency` as any, {
                type: "manual",
                message: "Currency is required",
              });
            }
            if (!payment.accountName?.trim()) {
              setError(`payments.${index}.accountName` as any, {
                type: "manual",
                message: "Account name is required",
              });
            }
            if (!payment.bankName?.trim()) {
              setError(`payments.${index}.bankName` as any, {
                type: "manual",
                message: "Bank name is required",
              });
            }
            if (!payment.accountNo?.trim()) {
              setError(`payments.${index}.accountNo` as any, {
                type: "manual",
                message: "Account number is required",
              });
            }
            if (!payment.bankAddress?.trim()) {
              setError(`payments.${index}.bankAddress` as any, {
                type: "manual",
                message: "Bank address is required",
              });
            }
            if (!payment.swiftCode?.trim()) {
              setError(`payments.${index}.swiftCode` as any, {
                type: "manual",
                message: "SWIFT code is required",
              });
            }
          }
        }
      });

      return { isValid, paymentData, hasAnyCompleteData };
    }, [getValues, setError, clearErrors]);

    const addPayment = useCallback(() => {
      append(DEFAULT_PAYMENT);
    }, [append]);

    const removePayment = useCallback(
      (index: number) => {
        const paymentItem = editData[index] as PaymentWithId;
        if (paymentItem?._id && onDeletePayment) {
          onDeletePayment(paymentItem._id, index);
        } else {
          remove(index);
          clearErrors(`payments.${index}` as any);
        }
      },
      [remove, editData, onDeletePayment, clearErrors],
    );

    useImperativeHandle(ref, () => ({
      getFormData: async () => {
        const { isValid, paymentData } = validateAndGetFormData();

        if (!isValid) {
          return null;
        }

        return { paymentData };
      },
      removePaymentField: (index: number) => {
        remove(index);
      },
    }));

    const renderPaymentForm = (field: { id: string }, index: number) => {
      const payment = getValues().payments?.[index] || DEFAULT_PAYMENT;
      const hasContent = hasPaymentContent(payment);

      return (
        <div
          key={field.id}
          className="w-full flex flex-col items-end justify-center"
        >
          {fields.length >= 1 && (
            <IconButton
              action={() => removePayment(index)}
              style="bg-red-600 hover:bg-red-500 text-xs text-white duration-300 px-4 py-3 rounded-lg mb-4"
              title=""
              icon={<RiDeleteBin4Fill size={16} />}
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <Input
              style="bg-white"
              disabled={false}
              error={
                hasContent && errors.payments?.[index]?.paymentType?.message
                  ? String(errors.payments[index]?.paymentType?.message)
                  : ""
              }
              title="Payment Type *"
              placeholder="Enter payment type (e.g., Bank Transfer, Credit Card)"
              type="text"
              {...register(`payments.${index}.paymentType` as const)}
            />
            <InputOption
              disabled={false}
              options={["PHP", "KRW", "JPY", "USD"]}
              title="Currency *"
              {...register(`payments.${index}.currency` as const)}
              style="bg-white w-full"
            />
            <Input
              style="bg-white"
              disabled={false}
              error={
                hasContent && errors.payments?.[index]?.accountName?.message
                  ? String(errors.payments[index]?.accountName?.message)
                  : ""
              }
              title="Account Name *"
              placeholder="Enter account holder name"
              type="text"
              {...register(`payments.${index}.accountName` as const)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={
                hasContent && errors.payments?.[index]?.bankName?.message
                  ? String(errors.payments[index]?.bankName?.message)
                  : ""
              }
              title="Bank Name *"
              placeholder="Enter bank name"
              type="text"
              {...register(`payments.${index}.bankName` as const)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={
                hasContent && errors.payments?.[index]?.accountNo?.message
                  ? String(errors.payments[index]?.accountNo?.message)
                  : ""
              }
              title="Account Number *"
              placeholder="Enter account number"
              type="text"
              {...register(`payments.${index}.accountNo` as const)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={
                hasContent && errors.payments?.[index]?.bankAddress?.message
                  ? String(errors.payments[index]?.bankAddress?.message)
                  : ""
              }
              title="Bank Address *"
              placeholder="Enter bank branch address"
              type="text"
              {...register(`payments.${index}.bankAddress` as const)}
            />
            <Input
              style="bg-white"
              disabled={false}
              error={
                hasContent && errors.payments?.[index]?.swiftCode?.message
                  ? String(errors.payments[index]?.swiftCode?.message)
                  : ""
              }
              title="SWIFT Code *"
              placeholder="Enter SWIFT/BIC code"
              type="text"
              {...register(`payments.${index}.swiftCode` as const)}
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
            style="fixed bottom-6 right-6 bg-[#1d2087] hover:bg-[#3b3eac] text-xs text-white duration-300 px-6 py-3 rounded-lg"
            title="New Payment Method"
            icon={<RiAddFill size={16} />}
          />
        </div>

        {fields.map(renderPaymentForm)}
      </div>
    );
  },
);

EditPaymentForm.displayName = "EditPaymentForm";

export default EditPaymentForm;
