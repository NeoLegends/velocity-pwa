import { postJsonEnsureOk } from "./fetch";
import { feedbackUrl } from "./urls";

/**
 * Submits general feedback.
 *
 * @param subject the feedback subject
 * @param content the feedback message
 */
export const submitFeedback = (subject: string, content: string) =>
  postJsonEnsureOk(feedbackUrl("feedback"), { subject, content });

/**
 * Submits error feedback for a pedelec.
 *
 * @param content the feedback message
 * @param error the actual error
 * @param pedelecId the ID of the pedelec with the error
 */
export const submitPedelecError = (
  content: string,
  error: string,
  pedelecId: number,
) => postJsonEnsureOk(feedbackUrl("pedelec"), { content, error, pedelecId });

/**
 * Submits error feedback for a station.
 *
 * @param content the feedback message
 * @param error the actual error
 * @param stationId the ID of the station with the error
 */
export const submitStationError = (
  content: string,
  error: string,
  stationId: number,
) => postJsonEnsureOk(feedbackUrl("station"), { content, error, stationId });
