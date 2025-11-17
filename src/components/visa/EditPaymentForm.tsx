import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef, useEffect } from "react";
import {
  addPaymentSchema,
  type addPaymentData,
  type editPaymentData,
} from "../../types/payments/addPaymentTypes";
import Input from "../input/Input";
import InputOption from "../input/InputOption";

export interface PaymentFormHandle {
  getFormData: () => Promise<{
    paymentData: addPaymentData;
  } | null>;
}

interface PaymentFormProps {
  editData?: editPaymentData;
}

const EditPaymentForm = forwardRef<PaymentFormHandle, PaymentFormProps>(
  ({ editData }, ref) => {
    // Payment form

    const processMethods = useForm<addPaymentData>({
      resolver: zodResolver(addPaymentSchema),
      defaultValues: {
        paymentType: editData?.type || "",
        currency: editData?.currency || "",
        accountName: editData?.accountName || "",
        bankName: editData?.bankName || "",
        accountNo: editData?.accountNo || "",
        bankAddress: editData?.bankAddress || "",
        swiftCode: editData?.swiftCode || "",
      },
      mode: "onChange",
    });

    const {
      register: registerPayment,
      formState: { errors: paymentErrors },
      trigger: triggerProcess,
      getValues: getProcessValues,
      reset: resetPayment,
    } = processMethods;

    // Pre-fill form when editData changes
    useEffect(() => {
      if (editData) {
        resetPayment({
          paymentType: editData?.type || "",
          currency: editData?.currency || "",
          accountName: editData?.accountName || "",
          bankName: editData?.bankName || "",
          accountNo: editData?.accountNo || "",
          bankAddress: editData?.bankAddress || "",
          swiftCode: editData?.swiftCode || "",
        });
      }
    }, [editData, resetPayment]);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      getFormData: async (): Promise<{
        paymentData: addPaymentData;
      } | null> => {
        const isProcessValid = await triggerProcess();

        if (!isProcessValid) {
          return null;
        }

        const paymentData = getProcessValues();

        return {
          paymentData,
        };
      },
    }));

    return (
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col gap-4">
          <Input
            disabled={false}
            error={paymentErrors.paymentType?.message || ""}
            title="Payment Type"
            placeholder="Enter payment type (e.g., Bank Transfer, Credit Card)"
            type="text"
            {...registerPayment("paymentType")}
          />
          <InputOption
            disabled={false}
            options={["PHP", "KRW", "JPY", "USD"]}
            title="Currency"
            {...registerPayment("currency")}
            style="bg-white w-full"
          />
          <Input
            disabled={false}
            error={paymentErrors.accountName?.message || ""}
            title="Account Name"
            placeholder="Enter account holder name"
            type="text"
            {...registerPayment("accountName")}
          />
          <Input
            disabled={false}
            error={paymentErrors.bankName?.message || ""}
            title="Bank Name"
            placeholder="Enter bank name"
            type="text"
            {...registerPayment("bankName")}
          />
          <Input
            disabled={false}
            error={paymentErrors.accountNo?.message || ""}
            title="Account Number"
            placeholder="Enter account number"
            type="text"
            {...registerPayment("accountNo")}
          />
          <Input
            disabled={false}
            error={paymentErrors.bankAddress?.message || ""}
            title="Bank Address"
            placeholder="Enter bank branch address"
            type="text"
            {...registerPayment("bankAddress")}
          />
          <Input
            disabled={false}
            error={paymentErrors.swiftCode?.message || ""}
            title="SWIFT Code"
            placeholder="Enter SWIFT/BIC code"
            type="text"
            {...registerPayment("swiftCode")}
          />
        </div>
      </div>
    );
  }
);

EditPaymentForm.displayName = "EditPaymentForm";

export default EditPaymentForm;
