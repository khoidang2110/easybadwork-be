import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


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


      const getProducts = products
      .map(product => ({
        product_id: product.product_id*1, // Ensure the field name matches the response
        name: product.name,
        price_vnd: product.price_vnd*1,
        price_usd: product.price_usd*1,
        decs_vi: product.decs_vi,
        decs_en: product.decs_en,
        category: product.category.category_name,
        image: product.image.map(item=>item.img_link),
        stock:product.stock
        .filter(item => item.stock > 0) // stock = 0 ko render ra size
        .map(item=>({
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

const findProductByName = async (req,res)=>{



try {
  let { keyword } = req.params;

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: keyword,
        mode: 'insensitive', // case-insensitive search ( uppercase)
      },
    },
  });
  if(products.length>0){
   res.send(products);
  }else {
    console.log(`No products found with name ${keyword}`)
  }
  
} catch (error) {
  res.status(500).send(`Internal server error: ${error}`);
}
}
  export { getProductByCategory,findProductByName };
  