import express from "express";
import { createOrder, deleteOrder, getOrderByDay, getOrderById } from "../controllers/orderControllers.js";



const orderRoutes = express.Router();

orderRoutes.post('/create-order',createOrder);

orderRoutes.get('/get-order-by-id',getOrderById);

orderRoutes.get('/get-order-by-day',getOrderByDay);

orderRoutes.put('/delete-order/:order_id',deleteOrder);
export default orderRoutes;