import express from "express";
import {
  createProduct,
  deleteProduct,
  findProductByName,
  getProductByCategory,
  updateProduct,
} from "../controllers/productControllers.js";
import storage from "../controllers/storageControllers.js";
import { verifyToken } from "../config/jwt.js";
const productRoutes = express.Router();


// liệt kê danh sách sp theo loại (category)
productRoutes.get("/get-products-category",verifyToken,getProductByCategory);

// tìm sản phẩm theo tên
productRoutes.get("/find-product",verifyToken,findProductByName);

// tạo sản phẩm, add hình sản phẩm
productRoutes.post('/create-product',storage.array('file'),verifyToken,createProduct);

// xoá product ( update deleted true)
productRoutes.put('/delete-product/:product_id',verifyToken,deleteProduct);

// update product
productRoutes.put('/update-product/',verifyToken,updateProduct);
export default productRoutes;
