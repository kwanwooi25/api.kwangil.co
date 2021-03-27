import { Router } from 'express';
import { createPlate, deletePlates, getPlateById, getPlates, updatePlate } from './controller';
import {
  createPlateValidation,
  deletePlatesValidation,
  getPlatesValidation,
  updatePlateValidation,
} from './validation';

const router: Router = Router();

router.get('/list', getPlatesValidation, getPlates);
router.get('/:id', getPlateById);

router.post('/', createPlateValidation, createPlate);

router.patch('/:id', updatePlateValidation, updatePlate);

router.delete('/', deletePlatesValidation, deletePlates);

export { router as plateRouter };
