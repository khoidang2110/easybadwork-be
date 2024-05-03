import express from "express";
import { createStock, getAllStocks, updateStock } from "../controllers/stockControllers.js";
import { verifyToken } from "../config/jwt.js";



const stockRoutes = express.Router();

stockRoutes.get('/get-all-stocks',verifyToken,getAllStocks);


stockRoutes.post('/create-stock',verifyToken,createStock);

// cập nhật số lượng sp
stockRoutes.put('/update-stock',verifyToken,updateStock)
export default stockRoutes;