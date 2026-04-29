import { ExternalLink } from "lucide-react";

type Props = {
  authority?: string | null;
  documentTitle: string;
  documentUrl: string;
  lastVerifiedAt: string;
};

export function SourceCitation({
  authority,
  documentTitle,
  documentUrl,
  lastVerifiedAt,
}: Props) {
  const date = new Date(lastVerifiedAt);
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="text-xs text-muted-foreground space-y-0.5">
      {authority && <p className="font-medium">{authority}</p>}
      <p>
        <a
          href={documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline hover:text-foreground"
        >
          {documentTitle}
          <ExternalLink size={10} aria-hidden="true" />
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </p>
      <p>Verified: {formatted}</p>
    </div>
  );
}
