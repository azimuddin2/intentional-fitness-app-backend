import { DateTime } from 'luxon';

export const getDayBoundary = () => {
  const now = DateTime.now().setZone('America/Los_Angeles');

  const startOfDay = now.startOf('day').toUTC().toJSDate();
  const endOfDay = now.endOf('day').toUTC().toJSDate();

  return { startOfDay, endOfDay };
};
