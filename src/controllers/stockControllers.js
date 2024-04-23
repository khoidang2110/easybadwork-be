import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const getAllStocks = async (req, res) => {
    try {
      // Assuming prisma.products represents your product model
      let products = await prisma.stock.findMany();

      if (products.length === 0) {
        res.send("No products found");
      } else {
        res.send(products);
      }
    } catch (error) {
      res.status(500).send(`Internal server error: ${error}`);
    }
  };

  export { getAllStocks };