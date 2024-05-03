import { PrismaClient } from "@prisma/client";
import { checkToken } from "../config/jwt.js";

const prisma = new PrismaClient();
const createProductCategory = async (req,res) => {

  let { token } = req.headers;
 checkToken(token);

    try {
  
      let {category_name} = req.body;
      let newData = {
      category_name
      };
const findCategory = await prisma.category.findMany({
  where: {
   category_name: category_name,
  },
})

if(findCategory.length !==0){
  console.log('findCategory',findCategory)
  res.send("your category already exits");
} else {
  await prisma.category.create({
    data: newData
  }
   );
  res.send("create category successfully");
}
     
    } catch (error) {
      res.send(`BE error ${error}`);
    }
  };
const deleteCategory = async (req, res) => {
  let { token } = req.headers;
  checkToken(token);
    try {
      let { category_id } = req.params;
  
      const findItem = await prisma.category.findUnique({
        where: {
          category_id: Number(category_id),
        },
      });
  
      if (findItem&&findItem.deleted===false) {
        await prisma.category.update({
          where: {
            category_id: Number(category_id),
          },
          data: {
            deleted: true,
          },
        });
        res.send("You just deleted the category");
      } else {
        res.send("Category not found");
      }
    } catch (error) {
      console.error(`Backend error: ${error}`);
      res.status(500).send("Internal Server Error");
    }
  };
  const updateCategory = async (req, res) => {
    let { token } = req.headers;
    checkToken(token);
    try {
      let { category_id,category_name, deleted } = req.query;
  console.log(deleted)
      const findItem = await prisma.category.findUnique({
        where: {
          category_id: Number(category_id),
        },
      });
  
      if (findItem) {
        await prisma.category.update({
          where: {
            category_id: Number(category_id),
          },
          data: {
            category_name,
            deleted:JSON.parse(deleted)
          },
        });
        res.send("You just update the category");
      } else {
        res.send("Category not found");
      }
    } catch (error) {
      console.error(`Backend error: ${error}`);
      res.status(500).send("Internal Server Error");
    }
  };
export { createProductCategory,deleteCategory,updateCategory };
