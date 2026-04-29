import { ShieldQuestion } from "lucide-react";

type Props = {
  medicationName: string;
  message: string;
};

export function UnableToVerify({ medicationName, message }: Props) {
  return (
    <div
      role="alert"
      className="rounded-md border border-amber-200 bg-amber-50 p-6 text-center"
    >
      <ShieldQuestion
        size={32}
        className="text-amber-600 mx-auto mb-3"
        aria-hidden="true"
      />
      <h2 className="text-lg font-semibold text-amber-800 mb-2">
        Unable to Verify
      </h2>
      <p className="text-sm text-amber-700 mb-3">{message}</p>
      <p className="text-sm text-amber-600">
        Consult destination customs authorities before traveling with{" "}
        <span className="font-medium">{medicationName}</span>.
      </p>
    </div>
  );
}
