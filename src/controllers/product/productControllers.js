import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllProducts = async (req, res) => {
    try {
      // Assuming prisma.products represents your product model
      let products = await prisma.product.findMany({
        include: {
            category: true,
            image: true,
            stock:true, // Include related category information
        },
    });
    
      if (products.length === 0) {
        res.send("No products found");
      } else {


        const getProducts = products.map(product => ({
          product_id: product.product_id*1, // Ensure the field name matches the response
          name: product.name,
          price_vnd: product.price_vnd*1,
          price_usd: product.price_usd*1,
          decs_vi: product.decs_vi,
          decs_en: product.decs_en,
          category: product.category.category_name,
          image: product.image.map(item=>item.img_link),
          stock:product.stock.map(item=>({
            size : item.size,
            stock : item.stock,
          }))
      }));


//res.send(products);
        res.send(getProducts);
      }
    } catch (error) {
      res.status(500).send(`Internal server error: ${error}`);
    }
  };
const getProductByCategory = async (req, res) => {
    try {
      // Assuming prisma.products represents your product model
      let { category_name } = req.params;


      let products = await prisma.product.findMany({
      
        include: {
            category: true,
            image: true,
            stock:true, // Include related category information
        },
  
    });
    
      if (products.length === 0) {
        res.send("No products found");
      } else {


        const getProducts = products.map(product => ({
          product_id: product.product_id*1, // Ensure the field name matches the response
          name: product.name,
          price_vnd: product.price_vnd*1,
          price_usd: product.price_usd*1,
          decs_vi: product.decs_vi,
          decs_en: product.decs_en,
          category: product.category.category_name,
          image: product.image.map(item=>item.img_link),
          stock:product.stock.map(item=>({
            size : item.size,
            stock : item.stock,
          }))
      }));
const filterProduct = getProducts.filter(product=>product.category==category_name)

//res.send(products);
      //  res.send(getProducts);
      res.send(filterProduct);
      }
    } catch (error) {
      res.status(500).send(`Internal server error: ${error}`);
    }
  };

  const getAllImages = async (req, res) => {
    try {
      // Assuming prisma.products represents your product model
      let products = await prisma.image.findMany();
    
      if (products.length === 0) {
        res.send("No products found");
      } else {
        res.send(products);
      }
    } catch (error) {
      res.status(500).send(`Internal server error: ${error}`);
    }
  };
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

const uploadImg = (req,res) => {
  res.send(req.file);
}

const uploadMultiImg = async (req,res) => {
  const arrLink = req.files.map(file => file.path);

  try {
    const { product_id } = req.body;
    const newData = arrLink.map(item => ({
      product_id:product_id*1,
      img_link: item,
    }));

    await prisma.image.createMany({
      data: newData,
    });
    
    res.send("Created images successfully");
  } catch (error) {
    res.send(`BE error ${error}`);
  }

  // res.send(req.files);
}

  export { getAllProducts,getAllImages,getAllStocks,uploadImg,uploadMultiImg,getProductByCategory };
  