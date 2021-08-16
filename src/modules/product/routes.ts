import { Router } from 'express';
import { isPermitted } from '~middlewares/isPermitted';

import { Permissions } from '@prisma/client';

import {
    createProduct, createProducts, deleteProducts, getAllProducts, getProductById, getProducts,
    updateProduct
} from './controller';
import {
    createProductsValidation, createProductValidation, deleteProductsValidation,
    getProductsValidation, updateProductValidation
} from './validation';

const router: Router = Router();

router.get('/list', isPermitted([Permissions.PRODUCT_READ]), getProductsValidation, getProducts);
router.get('/list/all', isPermitted([Permissions.PRODUCT_READ]), getProductsValidation, getAllProducts);
router.get('/:id', isPermitted([Permissions.PRODUCT_READ]), getProductById);

router.post('/bulk', isPermitted([Permissions.PRODUCT_CREATE]), createProductsValidation, createProducts);
router.post('/', isPermitted([Permissions.PRODUCT_CREATE]), createProductValidation, createProduct);

router.patch('/:id', isPermitted([Permissions.PRODUCT_UPDATE]), updateProductValidation, updateProduct);

router.delete('/', isPermitted([Permissions.PRODUCT_DELETE]), deleteProductsValidation, deleteProducts);

export { router as productRouter };
