import express from "express";
import { getAllStocks } from "../controllers/stockControllers.js";




const stockRoutes = express.Router();

stockRoutes.get('/get-all-stocks',getAllStocks);

export default stockRoutes;