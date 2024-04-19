import express from "express";


import productRoutes from "./productRoutes.js";

const rootRoutes = express.Router();

rootRoutes.use("/product",productRoutes)
export default rootRoutes;
