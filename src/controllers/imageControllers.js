import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllImages = async (req, res) => {
  let { page, size } = req.query;
  let num_page = Number(page);
  let num_size = Number(size);
  let index = (num_page - 1) * num_size;
    try {
      // Assuming prisma.products represents your product model
      let products = await prisma.image.findMany(
        {skip:index,
        take:num_size,}
      );
    
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

  export { getAllImages,uploadImg,uploadMultiImg };
  