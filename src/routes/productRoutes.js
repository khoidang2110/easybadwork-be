import express from "express";
import {
  findProductByName,
  getProductByCategory,
} from "../controllers/productControllers.js";

const productRoutes = express.Router();

// liệt kê danh sách sp theo loại (category)

productRoutes.get("/get-products-category", getProductByCategory);

// tìm sản phẩm theo tên
productRoutes.get("/find-product", findProductByName);

export default productRoutes;
