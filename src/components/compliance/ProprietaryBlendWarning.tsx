import { AlertTriangle } from "lucide-react";

export function ProprietaryBlendWarning() {
  return (
    <div className="flex items-start gap-2 rounded-md border border-dashed border-sky-300 bg-sky-50/50 p-3">
      <AlertTriangle
        size={16}
        className="text-sky-600 mt-0.5 shrink-0"
        aria-hidden="true"
      />
      <p className="text-sm text-sky-800">
        This product contains a proprietary blend with partial ingredient
        disclosure. Compliance cannot be guaranteed for undisclosed ingredients.
        Consult destination customs authorities before traveling.
      </p>
    </div>
  );
}
