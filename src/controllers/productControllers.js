import { PrismaClient } from "@prisma/client";
import { checkToken } from "../config/jwt.js";
const prisma = new PrismaClient();



const getProductByCategory = async (req, res) => {
  let { token } = req.headers;
  checkToken(token);
  try {
    // Assuming prisma.products represents your product model
    let { categoryName, page, size } = req.query;
    let num_page = Number(page);
    let num_size = Number(size);
    let index = (num_page - 1) * num_size;
    let products = await prisma.product.findMany({
      skip:index,
      take:num_size,
      include: {
        category: true,
        image: true,
        stock: true, // Include related category information
      },
    });

    if (products.length === 0) {
      res.send("No products found");
    } else {
      const getProducts = products.map((product) => ({
        product_id: product.product_id , // Ensure the field name matches the response
        name: product.name,
        price_vnd: product.price_vnd * 1,
        price_usd: product.price_usd * 1,
        decs_vi: product.decs_vi,
        decs_en: product.decs_en,
        category: product.category.category_name,
        image: product.image.map((item) => item.img_link),
        stock: product.stock
          .filter((item) => item.stock > 0) // stock = 0 ko render ra size
          .map((item) => ({
            size: item.size,
            stock: item.stock,
          })),
      }));
      const filterProduct = getProducts.filter(
        (product) => product.category == categoryName
      );
      console.log("getProducts", getProducts);
      //res.send(products);
      //  res.send(getProducts);
      if (categoryName) {
        res.send(filterProduct);
      } else {
        res.send(getProducts);
      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send(`Internal server error: ${error}`);
  }
};
const findProductByName = async (req, res) => {
  let { token } = req.headers;
  checkToken(token);
  try {
   // let { keyword } = req.query;
    let { keyword, page, size } = req.query;
    let num_page = Number(page);
    let num_size = Number(size);
    let index = (num_page - 1) * num_size;
    const products = await prisma.product.findMany({
      skip:index,
      take:num_size,
      where: {
        name: {
          contains: keyword,
          mode: "insensitive", // case-insensitive search ( uppercase)
        },
      },
    });
    if (products.length > 0) {
      res.send(products);
    } else {
      console.log(`No products found with name ${keyword}`);
    }
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
};

const createProduct = async (req,res) => {
  const imagePaths = req.files.map(file => file.path);
  let { token } = req.headers;
  checkToken(token);
  try {

    let { product_id,name,price_vnd,price_usd,decs_vi,decs_en,category_id} = req.body;
    let newDataProduct = {
      product_id:Number(product_id),
      name,
      price_vnd:Number(price_vnd),
      price_usd:Number(price_usd),
      decs_vi,
      decs_en,
      category_id:Number(category_id)
    };
    await prisma.product.create({
      data: newDataProduct
    }
     );
   


   
    const newData = imagePaths.map(item => ({
      product_id:product_id*1,
      img_link: item,
    }));

    await prisma.image.createMany({
      data: newData,
    });
    
    res.send("Created product successfully");
  } catch (error) {
    res.send(`BE error ${error}`);
  }

  // res.send(req.files);
}
const deleteProduct = async (req,res) => {
  let { token } = req.headers;
  checkToken(token);
  try {
    let { product_id } = req.params;

    const findItem = await prisma.product.findUnique({
      where: {
        product_id: Number(product_id),
      },
    });
    if (findItem&&findItem.deleted===false) {
      await prisma.product.update({
        where: {
          product_id: Number(product_id),
        },
        data: {
          deleted: true,
        },
      });
      res.send("You just deleted the product");
    } else {
      res.send("product not found");
    }
  } catch (error) {
    console.error(`Backend error: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};
const updateProduct = async (req,res) => {
  let { token } = req.headers;
  checkToken(token);
  try {
    let { product_id,name,price_vnd,price_usd,decs_vi,decs_en,category_id,deleted } = req.query;

    const findItem = await prisma.product.findUnique({
      where: {
        product_id: Number(product_id),
      },
    });
    if (findItem) {
      await prisma.product.update({
        where: {
          product_id: Number(product_id),
        },
        data: {
          name: name || findItem.name,
          price_vnd: price_vnd ? price_vnd : findItem.price_vnd,
          price_usd: price_usd || findItem.price_usd,
          decs_vi: decs_vi || findItem.decs_vi,
          decs_en: decs_en || findItem.decs_en,
          category_id: category_id || findItem.category_id, 
          deleted: deleted ? JSON.parse(deleted) : findItem.deleted
        },
      });
      res.send("You just update the product");
    } else {
      res.send("product not found");
    }
  } catch (error) {
    console.error(`Backend error: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};

export { getProductByCategory, findProductByName,createProduct, deleteProduct,updateProduct };
