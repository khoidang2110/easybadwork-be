import express from "express";
import {  getAllImages, uploadImg, uploadMultiImg } from "../controllers/imageControllers.js";
import storage from "../controllers/storageControllers.js";

const imageRoutes = express.Router();

imageRoutes.post('/upload-image',storage.single('file'),uploadImg);
imageRoutes.get('/get-all-images',getAllImages);

// upload hình (max 8 hinh 1 lan)
imageRoutes.post('/upload-multi-images',storage.array('file'),uploadMultiImg);

export default imageRoutes;