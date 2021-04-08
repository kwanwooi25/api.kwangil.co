import { Router } from 'express';
import { accountRouter } from './account/routes';
import { authRouter } from './auth/routes';
import { errors } from 'celebrate';
import { handleError } from '~utils/error';
import { isAuthorized } from '~middlewares/isAuthorized';
import { plateRouter } from './plate/routes';
import { productRouter } from './product/routes';
import { requestLogger } from '~middlewares/requestLogger';
import { userRouter } from './user/routes';
import { workOrderRouter } from './workOrder/routes';

export const getRoutes = (): Router => {
  const router: Router = Router();

  router.get('/', (req, res) => res.json({ message: 'Welcome to api.kwangil.co!' }));

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
