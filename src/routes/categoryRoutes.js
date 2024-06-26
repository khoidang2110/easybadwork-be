import express from "express";
import { createProductCategory, deleteCategory, getAllCategory, updateCategory } from "../controllers/categoryControllers.js";
import { verifyToken } from "../config/jwt.js";

const categoryRoutes = express.Router();

// tạo category
categoryRoutes.post('/create-products-category',createProductCategory);

// xoá category ( update deleted true)
categoryRoutes.put('/delete-category/:category_id',deleteCategory);

// cập nhật category ( có cập nhật deleted)
categoryRoutes.put('/update-category',updateCategory);

categoryRoutes.get(`/get-all-category`,getAllCategory);
export default categoryRoutes;