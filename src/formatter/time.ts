import { format, formatRelative, isPast, isAfter, sub } from 'date-fns';


export const readableTime = (time: Date, verb?: string) => {
  let formatted: string;
  if (isPast(time) && isAfter(time, sub(Date.now(), { days: 1 }))) {
    // if is less than 1 day before, show relative time
    formatted = formatRelative(time, Date.now());
  } else {
    // otherwise, absolute time
    formatted = "at " + format(time, 'yyyy-MM-dd HH:mm:ss');
  }

  const prefix = verb ? `${verb} ` : '';
  return prefix + formatted;
}
