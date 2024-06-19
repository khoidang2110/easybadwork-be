import { PrismaClient } from "@prisma/client";
import { checkToken } from "../config/jwt.js";
const prisma = new PrismaClient();

const getAllStocks = async (req, res) => {
  // let { token } = req.headers;
  // checkToken(token);
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
// get stock by product  id
const getStockById = async (req,res)=>{
//console.log('chay get stock by id')
  try {
    let { product_id } = req.query;

     const stock = await prisma.stock.findMany({
    
       where: {
         product_id:Number(product_id)
       
       }
      //  ,
      //  include: {
      //   order_cart: true,
 
      // },
     });
     if (stock.length > 0) {
       res.send(stock);
     } else {
       res.send(`No stock found with id ${product_id}`);
     }
   } catch (error) {
     res.status(500).send(`Internal server error: ${error}`);
   }
};

//create stock
const createStock = async (req, res) => {
  // let { token } = req.headers;
  // checkToken(token);
  try {
    let { size, stock, product_id } = req.body;

    const findProductId = await prisma.product.findUnique({
      where: {
        product_id: Number(product_id),
      },
    });
    if (!findProductId) {
      res.send("product id does not exits");
    } else {
      const findItem = await prisma.stock.findMany({
        where: {
          product_id: Number(product_id),
          size: size,
        },
      });
      if (findItem.length > 0) {
        res.send("this size of product already exits ");
      } else {
        let newData = {
          size,
          stock: Number(stock),
          product_id: Number(product_id),
        };
        await prisma.stock.create({
          data: newData,
        });
        res.send("create stock successfully");
      }
    }
  } catch (error) {
    res.send(`BE error ${error}`);
  }
};
//update stock
const updateStock = async (req, res) => {
  // let { token } = req.headers;
  // checkToken(token);
  try {
    let { size, stock, product_id } = req.body;

    const findItem = await prisma.stock.findMany({
      where: {
        product_id: Number(product_id),
        size: size,
      },
    });

    if (findItem && findItem.length > 0) {
      await prisma.stock.updateMany({
        where: {
          product_id: Number(product_id),
          size: size,
        },
        data: {
          stock: Number(stock),
        },
      });
      res.send("Stock updated successfully");
    } else {
      res.send("Stock not found");
    }
  } catch (error) {
    console.error(`Backend error: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};
//delete sotck
const deleteStock = async (req,res) => {
  try {
    let { stock_id } = req.query;
    console.log('chay delete stock',stock_id )
    const findStock = await prisma.stock.findUnique({
      where: {
        stock_id: Number(stock_id),
      },
    });
    if (findStock) {
      await prisma.stock.delete({
        where: {
          stock_id: Number(stock_id),
        },
      });
      res.send("You just deleted the stock");
    } else {
      res.send("stock not found");
    }
  } catch (error) {
    console.error(`Backend error: ${error}`);
    res.status(500).send("Internal Server Error");
  }

}

export { getAllStocks, createStock, updateStock,getStockById,deleteStock };
