import { Router } from 'express';
import { loginUser, signUpUser } from './controller';
import { loginValidation, signUpValidation } from './validation';

const router: Router = Router();

router.post('/signup', signUpValidation, signUpUser);
router.post('/login', loginValidation, loginUser);

export { router as authRouter };
