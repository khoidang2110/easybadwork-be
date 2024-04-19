import express from "express";
import { getAllImages, getAllProducts, getAllStocks, uploadImg, uploadMultiImg } from "../controllers/product/productControllers.js";
import storage from "../controllers/product/storageControllers.js";


const productRoutes = express.Router();



productRoutes.post('/upload-image',storage.single('file'),uploadImg);

// upload max 8 hinh 1 lan
productRoutes.post('/upload-multi-images',storage.array('file'),uploadMultiImg);


productRoutes.get('/get-all-products',getAllProducts);
productRoutes.get('/get-all-images',getAllImages);
productRoutes.get('/get-all-stocks',getAllStocks);


export default productRoutes;