import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const buildDateFilter = (month?: string): Record<string, unknown> => {
  if (!month) return {};

  const selectedMonth = Number(month); // 1 = January, 12 = December

  if (selectedMonth < 1 || selectedMonth > 12) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid month value');
  }

  const currentYear = new Date().getFullYear();

  const startDate = new Date(currentYear, selectedMonth - 1, 1);
  const endDate = new Date(currentYear, selectedMonth, 1);

  return {
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  };
};

export default buildDateFilter;
