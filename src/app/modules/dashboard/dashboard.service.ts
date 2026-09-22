import { USER_ROLE } from '../user/user.constant';
import { User } from '../user/user.model';
import { Months } from './dashboard.constant';
import buildDateFilter from './dashboard.utils';

const getTotalUsersFromDB = async (query: Record<string, unknown>) => {
  const { month } = query;

  const dateFilter = buildDateFilter(month as string);

  const totalUsers = await User.countDocuments({
    role: USER_ROLE.user,
    isDeleted: false,
    ...dateFilter,
  });

  return { totalUsers };
};

const getTotalTrainersFromDB = async (query: Record<string, unknown>) => {
  const { month } = query;

  const dateFilter = buildDateFilter(month as string);

  const totalTrainers = await User.countDocuments({
    role: USER_ROLE.trainer,
    isDeleted: false,
    ...dateFilter,
  });

  return { totalTrainers };
};

const getUserOverviewChart = async (year?: number) => {
  const targetYear = year || new Date().getFullYear();

  // 🧩 Aggregate users by month (creation date)
  const monthlyStats = await User.aggregate([
    {
      $match: {
        role: 'user',
        isDeleted: false,
        createdAt: {
          $gte: new Date(`${targetYear}-01-01`),
          $lte: new Date(`${targetYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const chartData = Months.map((month, index) => {
    const monthStat = monthlyStats.find((item) => item._id === index + 1);
    return {
      month,
      users: monthStat ? monthStat.count : 0,
    };
  });

  return {
    year: targetYear,
    data: chartData,
  };
};

const getTrainerOverviewChart = async (year?: number) => {
  const targetYear = year || new Date().getFullYear();

  // 🧩 Aggregate users by month (creation date)
  const monthlyStats = await User.aggregate([
    {
      $match: {
        role: 'trainer',
        isDeleted: false,
        createdAt: {
          $gte: new Date(`${targetYear}-01-01`),
          $lte: new Date(`${targetYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const chartData = Months.map((month, index) => {
    const monthStat = monthlyStats.find((item) => item._id === index + 1);
    return {
      month,
      users: monthStat ? monthStat.count : 0,
    };
  });

  return {
    year: targetYear,
    data: chartData,
  };
};

export const DashboardServices = {
  getTotalUsersFromDB,
  getTotalTrainersFromDB,
  getUserOverviewChart,
  getTrainerOverviewChart,
};
