import { USER_ROLE } from '../user/user.constant';
import { User } from '../user/user.model';
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

export const DashboardServices = {
  getTotalUsersFromDB,
  getTotalTrainersFromDB,
};
