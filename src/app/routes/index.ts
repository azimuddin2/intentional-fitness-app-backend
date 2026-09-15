import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { OtpRoutes } from '../modules/otp/otp.route';
import { TermsRoutes } from '../modules/terms/terms.route';
import { PrivacyRoutes } from '../modules/privacy/privacy.route';
import { AboutRoutes } from '../modules/about/about.route';
import { SupportRoutes } from '../modules/support/support.route';
import { NotificationRoutes } from '../modules/notification/notification.route';
import { StabilizeCategoryRoutes } from '../modules/stabilizeCategory/stabilizeCategory.route';
import { TrainingProgramRoutes } from '../modules/trainingProgram/trainingProgram.route';
import { WeeklyJournalTaskRoutes } from '../modules/weeklyJournalTask/weeklyJournalTask.route';
import { StabilizeExerciseRoutes } from '../modules/stabilizeExercise/stabilizeExercise.route';
import { ProgramExerciseRoutes } from '../modules/programExercise/programExercise.route';
import { GoalRoutes } from '../modules/goal/goal.route';
import { MetricRoutes } from '../modules/metrics/metrics.route';
import { CheckInRoutes } from '../modules/checkIn/checkIn.route';
import { WeeklyJournalRoutes } from '../modules/weeklyJournal/weeklyJournal.route';
import { DocRoutes } from '../modules/doc/doc.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/otp',
    route: OtpRoutes,
  },
  {
    path: '/terms',
    route: TermsRoutes,
  },
  {
    path: '/privacy',
    route: PrivacyRoutes,
  },
  {
    path: '/about',
    route: AboutRoutes,
  },
  {
    path: '/supports',
    route: SupportRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/stabilize-categories',
    route: StabilizeCategoryRoutes,
  },
  {
    path: '/stabilize-exercise',
    route: StabilizeExerciseRoutes,
  },
  {
    path: '/training-programs',
    route: TrainingProgramRoutes,
  },
  {
    path: '/training-exercise',
    route: ProgramExerciseRoutes,
  },
  {
    path: '/goals',
    route: GoalRoutes,
  },
  {
    path: '/metrics',
    route: MetricRoutes,
  },
  {
    path: '/check-ins',
    route: CheckInRoutes,
  },
  {
    path: '/weekly-journal-tasks',
    route: WeeklyJournalTaskRoutes,
  },
  {
    path: '/weekly-journals',
    route: WeeklyJournalRoutes,
  },
  {
    path: '/docs',
    route: DocRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
