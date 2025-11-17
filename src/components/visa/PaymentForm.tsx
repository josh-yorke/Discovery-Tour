import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImperativeHandle, forwardRef } from "react";
import {
  addPaymentSchema,
  type addPaymentData,
} from "../../types/payments/addPaymentTypes";
import Input from "../input/Input";
import InputOption from "../input/InputOption";

export interface PaymentFormHandle {
  getFormData: () => Promise<{
    paymentData: addPaymentData;
  } | null>;
}

const PaymentForm = forwardRef<PaymentFormHandle>((_props, ref) => {
  // Payment form
  const paymentMethods = useForm<addPaymentData>({
    resolver: zodResolver(addPaymentSchema),
  });

  const {
    register: registerPayment,
    formState: { errors: paymentErrors },
    trigger: triggerPayment,
    getValues: getPaymentValues,
  } = paymentMethods;

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getFormData: async (): Promise<{
      paymentData: addPaymentData;
    } | null> => {
      const isPaymentValid = await triggerPayment();

      if (!isPaymentValid) {
        return null;
      }

      const paymentData = getPaymentValues();

      return { paymentData };
    },
  }));

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="w-full flex flex-col gap-4">
          <Input
            disabled={false}
            error={paymentErrors.paymentType?.message || ""}
            title="Payment Type"
            placeholder="payment type"
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
            placeholder="account name"
            type="text"
            {...registerPayment("accountName")}
          />
          <Input
            disabled={false}
            error={paymentErrors.bankName?.message || ""}
            title="Bank Name"
            placeholder="bank name"
            type="text"
            {...registerPayment("bankName")}
          />
          <Input
            disabled={false}
            error={paymentErrors.accountNo?.message || ""}
            title="Account Number"
            placeholder="account number"
            type="text"
            {...registerPayment("accountNo")}
          />
          <Input
            disabled={false}
            error={paymentErrors.bankAddress?.message || ""}
            title="Bank Address"
            placeholder="bank address"
            type="text"
            {...registerPayment("bankAddress")}
          />
          <Input
            disabled={false}
            error={paymentErrors.swiftCode?.message || ""}
            title="Swift Code"
            placeholder="swift code"
            type="text"
            {...registerPayment("swiftCode")}
          />
        </div>
      </div>
    </>
  );
});

PaymentForm.displayName = "PaymentForm";

export default PaymentForm;
