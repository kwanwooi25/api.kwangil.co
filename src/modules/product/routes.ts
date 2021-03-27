import { Router } from 'express';
import {
  createProduct,
  createProducts,
  deleteProducts,
  getAllProducts,
  getProductById,
  getProducts,
  updateProduct,
} from './controller';
import {
  createProductsValidation,
  createProductValidation,
  deleteProductsValidation,
  getProductsValidation,
  updateProductValidation,
} from './validation';

const router: Router = Router();

router.get('/list', getProductsValidation, getProducts);
router.get('/list/all', getProductsValidation, getAllProducts);
router.get('/:id', getProductById);

router.post('/bulk', createProductsValidation, createProducts);
router.post('/', createProductValidation, createProduct);

router.patch('/:id', updateProductValidation, updateProduct);

router.delete('/', deleteProductsValidation, deleteProducts);

export { router as productRouter };
