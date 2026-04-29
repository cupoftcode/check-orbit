import { task } from "@trigger.dev/sdk/v3";
import { dispatchRegulationChange } from "../notifications/dispatch-regulation-change";
import * as Sentry from "@sentry/nextjs";

export type RegulationApprovedPayload = {
  compoundId: string;
  compoundName: string;
  countryId: string;
  countryCode: string;
  countryName: string;
  previousStatus: string;
  newStatus: string;
  sourceDocument: string;
  sourceUrl: string;
  approvedAt: string;
};

/**
 * Event handler for regulation approval.
 * Fire-and-forget — does not block the approval flow.
 * Dispatches notification emails to subscribed users via Epic 7.
 */
export const regulationApproved = task({
  id: "regulation-approved",
  retry: { maxAttempts: 2 },
  run: async (payload: RegulationApprovedPayload) => {
    try {
      await dispatchRegulationChange.trigger({
        compoundId: payload.compoundId,
        compoundName: payload.compoundName,
        countryCode: payload.countryCode,
        countryName: payload.countryName,
        previousStatus: payload.previousStatus,
        newStatus: payload.newStatus,
        sourceDocument: payload.sourceDocument,
        sourceUrl: payload.sourceUrl,
      });

      return { dispatched: true };
    } catch (err) {
      // Fire-and-forget: log but don't fail the approval
      Sentry.captureException(err, {
        extra: { payload, context: "regulation-approved-event" },
      });
      return { dispatched: false };
    }
  },
});
