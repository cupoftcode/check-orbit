import { Leaf } from "lucide-react";

type Props = {
  details: string | null;
};

export function BiosecurityWarning({ details }: Props) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-2 rounded-md border border-dashed border-amber-300 bg-amber-50/50 p-3"
    >
      <Leaf
        size={16}
        className="text-amber-600 mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <p className="text-sm text-amber-800">
        {details ??
          "This product may be subject to agricultural biosecurity restrictions at the destination."}{" "}
        Declare on arrival.
      </p>
    </div>
  );
}
