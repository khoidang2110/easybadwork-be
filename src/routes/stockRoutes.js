import express from "express";
import { createStock, getAllStocks, getStockById, updateStock } from "../controllers/stockControllers.js";
import { verifyToken } from "../config/jwt.js";



const stockRoutes = express.Router();

stockRoutes.get('/get-all-stocks',getAllStocks);

stockRoutes.get('/get-stock-by-id',getStockById);
stockRoutes.post('/create-stock',createStock);

// cập nhật số lượng sp
stockRoutes.put('/update-stock',updateStock)
export default stockRoutes;