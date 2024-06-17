import express from "express";
import {
  createProduct,
  deleteProduct,
  findMultiProductById,
  findProductById,
  findProductByName,
  getProductByCategory,
  updateProduct,
} from "../controllers/productControllers.js";
import storage from "../controllers/storageControllers.js";
import { verifyToken } from "../config/jwt.js";
const productRoutes = express.Router();


// liệt kê danh sách sp theo loại (category)
productRoutes.get("/get-products-category",getProductByCategory);

// tìm sản phẩm theo tên
productRoutes.get("/find-product",findProductByName);

productRoutes.get('/find-product-by-id',findProductById);
productRoutes.get('/find-multi-product-by-id',findMultiProductById);
// tạo sản phẩm, add hình sản phẩm
productRoutes.post('/create-product',storage.array('file'),createProduct);

// xoá product ( update deleted true)
productRoutes.put('/delete-product/:product_id',deleteProduct);

// update product
productRoutes.put('/update-product/',updateProduct);
export default productRoutes;
