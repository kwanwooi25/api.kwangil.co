import { Router } from 'express';
import { getCurrentUser } from './controller';

const router: Router = Router();

router.get('/me', getCurrentUser);

export { router as userRouter };
