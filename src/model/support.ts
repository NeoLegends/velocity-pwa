import { postJsonEnsureOk } from './fetch';
import { feedbackUrl } from './urls';

export const submitFeedback = (subject: string, content: string) =>
  postJsonEnsureOk(feedbackUrl('feedback'), { subject, content });

export const submitPedelecError = (
  content: string,
  error: string,
  pedelecId: number,
) =>
  postJsonEnsureOk(feedbackUrl('pedelec'), { content, error, pedelecId });

export const submitStationError = (
  content: string,
  error: string,
  stationId: number,
) =>
  postJsonEnsureOk(feedbackUrl('station'), { content, error, stationId });
