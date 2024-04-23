import express from "express";


import productRoutes from "./productRoutes.js";
import imageRoutes from "./imageRoutes.js";
import orderRoutes from './orderRoutes.js'
import stockRoutes from "./stockRoutes.js";

const rootRoutes = express.Router();

rootRoutes.use('/order',orderRoutes)
rootRoutes.use("/product",productRoutes);
rootRoutes.use("/image",imageRoutes);
rootRoutes.use('/stock',stockRoutes);

export default rootRoutes;
