import { PrismaClient } from "@prisma/client";
import { checkToken } from "../config/jwt.js";
const prisma = new PrismaClient();



const getProductByCategory = async (req, res) => {
  // let { token } = req.headers;
  // checkToken(token);
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
  // let { token } = req.headers;
  // checkToken(token);
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
        }
      },
      
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
  
      console.log("getProducts", getProducts);
  
  
        res.send(getProducts);
    
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send(`Internal server error: ${error}`);
  }
};
const findProductById = async (req, res) => {
  try {
    let { product_id } = req.query;

    const product = await prisma.product.findUnique({
      where: {
        product_id: Number(product_id)
      },
      include: {
        category: true,
        image: true,
        stock: true, // Include related category information
      }
    });

    if (product) {
      console.log('product', product);
      const transformedProduct = {
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
          }))
      };

      res.status(200).send(transformedProduct);
    } else {
      res.status(404).send(`No product found with id ${product_id}`);
    }
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
};
const getAllProduct= async (req, res) => {
  try {
   

    const products = await prisma.product.findMany({
    
      include: {
        category: true,
        image: true,
        stock: true, // Include related category information
      }
    });

    if (products.length > 0) {
      // Transform products into desired format
      const transformedProducts = products.map((product) => ({
        product_id: product.product_id,
        name: product.name,
        price_vnd: product.price_vnd * 1,
        price_usd: product.price_usd * 1,
        decs_vi: product.decs_vi,
        decs_en: product.decs_en,
        category: product.category?.category_name || 'Uncategorized',
        image: product.image.map((item) => item.img_link),
        stock: product.stock
          .filter((item) => item.stock > 0)
          .map((item) => ({
            size: item.size,
            stock: item.stock,
          })),
      }));

      res.status(200).send(transformedProducts);
    } else {
      res.status(404).send('No products found'); // Handle case where no products are found
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send(`Internal server error: ${error.message}`);
  }
};
// const findMultiProductById = async (req, res) => {
//   try {
//     let { idArray } = req.body;
 
   
//     // Use Promise.all to fetch products for all ids concurrently
//     const productPromises = await idArray.map(async (productId) => {
//       const products = await prisma.product.findMany({
//         where: {
//           product_id: productId,
//         },
//         include: {
//           category: true,
//           image: true,
//           stock: true,
//         }
//       });
//       return products; // Return the products found for this productId
//     });

//     // Wait for all promises to resolve
//     const allProducts = await Promise.all(productPromises);

//     // Flatten the array of arrays into a single array of products
//     const flattenedProducts = allProducts.flat();

//     if (flattenedProducts.length > 0) {
//       const transformedProducts = flattenedProducts.map((product) => ({
//         product_id: product.product_id,
//         name: product.name,
//         price_vnd: product.price_vnd * 1,
//         price_usd: product.price_usd * 1,
//         decs_vi: product.decs_vi,
//         decs_en: product.decs_en,
//         category: product.category?.category_name || 'Uncategorized', // Ensure category_name is accessed safely
//         image: product.image.map((item) => item.img_link),
//         stock: product.stock
//           .filter((item) => item.stock > 0)
//           .map((item) => ({
//             size: item.size,
//             stock: item.stock,
//           })),
//       }));

//       res.status(200).send(transformedProducts);
//     } else {
//       res.status(404).send('No products found with the provided IDs');
//     }
//   } catch (error) {
//     res.status(500).send(`Internal server error: ${error.message}`);
//   }
// };
const createProduct = async (req,res) => {

  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }
  const imagePaths = req.files.map(file => file.path);
  const random8Number = Math.floor(Math.random() * 90000000) + 10000000;
  try {

  
  // Sử dụng hàm
  
 
    let { name,price_vnd,price_usd,decs_vi,decs_en,category_id} = req.body;
    let newDataProduct = {
      product_id:random8Number,
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
      product_id:random8Number,
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
  // let { token } = req.headers;
  // checkToken(token);
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
  // let { token } = req.headers;
  // checkToken(token);
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

export { getProductByCategory, findProductByName,createProduct, deleteProduct,updateProduct,findProductById,getAllProduct };
