import express from 'express';
const router = express.Router();
import { createProduct, getProduct, updateProduct, deleteProduct } from '../controllers/products';
router
    .route('/')
    .post(createProduct)
    .get(getProduct)
    .patch(updateProduct)
    .delete(deleteProduct);
export default router;
