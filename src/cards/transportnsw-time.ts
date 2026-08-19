import { isValid, parseISO } from 'date-fns';

const timeFormatter = new Intl.DateTimeFormat('en-AU', {
  hour: '2-digit',
  minute: '2-digit',
});

const unavailableTimeStates = new Set(['unknown', 'unavailable']);

export const formatTransportTime = (
  timestamp: string | null | undefined,
): string => {
  if (!timestamp || unavailableTimeStates.has(timestamp)) {
    return '—';
  }

  const date = parseISO(timestamp);
  return isValid(date) ? timeFormatter.format(date) : '—';
};
