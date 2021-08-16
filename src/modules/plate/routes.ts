import { Router } from 'express';
import { isPermitted } from '~middlewares/isPermitted';

import { Permissions } from '@prisma/client';

import { createPlate, deletePlates, getPlateById, getPlates, updatePlate } from './controller';
import {
    createPlateValidation, deletePlatesValidation, getPlatesValidation, updatePlateValidation
} from './validation';

const router: Router = Router();

router.get('/list', isPermitted([Permissions.PLATE_READ]), getPlatesValidation, getPlates);
router.get('/:id', isPermitted([Permissions.PLATE_READ]), getPlateById);

router.post('/', isPermitted([Permissions.PLATE_CREATE]), createPlateValidation, createPlate);

router.patch('/:id', isPermitted([Permissions.PLATE_UPDATE]), updatePlateValidation, updatePlate);

router.delete('/', isPermitted([Permissions.PLATE_DELETE]), deletePlatesValidation, deletePlates);

export { router as plateRouter };
