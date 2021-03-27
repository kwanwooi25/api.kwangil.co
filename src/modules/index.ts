import { Router } from 'express';
import { errors } from 'celebrate';
import { requestLogger } from '~middlewares/requestLogger';
import { isAuthorized } from '~middlewares/isAuthorized';
import { handleError } from '~utils/error';
import { authRouter } from './auth/routes';
import { userRouter } from './user/routes';
import { accountRouter } from './account/routes';
import { productRouter } from './product/routes';
import { plateRouter } from './plate/routes';
import { workOrderRouter } from './workOrder/routes';

export const getRoutes = (): Router => {
  const router: Router = Router();

  router.get('/', (req, res) => res.json({ message: 'Welcome to @kwangil.co/api!' }));

  router.use(requestLogger);

  router.use('/auth', authRouter);
  router.use('/user', isAuthorized, userRouter);
  router.use('/account', isAuthorized, accountRouter);
  router.use('/product', isAuthorized, productRouter);
  router.use('/plate', isAuthorized, plateRouter);
  router.use('/workOrder', isAuthorized, workOrderRouter);

  router.use(errors());
  router.use(handleError);

  return router;
};
