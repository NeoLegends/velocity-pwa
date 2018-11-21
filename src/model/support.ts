import { fetchEnsureOk } from './fetch';
import { feedbackUrl } from './urls';

export const submitFeedback = (subject: string, content: string) =>
  fetchEnsureOk(feedbackUrl('feedback'), {
    body: JSON.stringify({ subject, content }),
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
  });

export const submitPedelecError = (
  content: string,
  error: string,
  pedelecId: number,
) =>
  fetchEnsureOk(feedbackUrl('pedelec'), {
    body: JSON.stringify({ content, error, pedelecId }),
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
  });

export const submitStationError = (
  content: string,
  error: string,
  stationId: number,
) =>
  fetchEnsureOk(feedbackUrl('station'), {
    body: JSON.stringify({ content, error, stationId }),
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
  });
