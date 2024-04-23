import express from "express";
import { createOrder } from "../controllers/orderControllers.js";



const orderRoutes = express.Router();

orderRoutes.post('/create-order',createOrder)

export default orderRoutes;