import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const createOrder = async (req, res) => {
    try {
      let day = new Date();
      let strDay = day.toISOString();
      let { full_name, email, address,cart} = req.body;
      let newData = {
        date:strDay,
        full_name,
         email, 
        address, 
       
      };
      const createdOrder =  await prisma.orders.create({
        data: newData
      }
       );
// lay stock
let stock = await prisma.stock.findMany();

      //  if (stock.length === 0) {
      //    res.send("No products found");
      //  } else {
      //    res.send(products);
      //  }

// filter stock theo ten cua cart
const stockFilter = stock.filter(stockItem => {
  return cart.some(item => item.size === stockItem.size && item.product_id === stockItem.product_id);
});

// kiem tra neu quantity > stock

stockFilter.forEach(stockItem => {
  const matchingItem = cart.find(item => item.size === stockItem.size && item.product_id === stockItem.product_id);
  if (matchingItem.quantity > stockItem.stock) {
      throw new Error(`Quantity (${matchingItem.quantity}) exceeds available stock (${stockItem.stock}) for product_id ${stockItem.product_id}`);
  }
});

console.log('filter',stockFilter);

// check cart xem hàng order có tồn tại ko

cart.forEach(item => {
  const foundItem = stock.find(stockItem => stockItem.product_id === item.product_id && stockItem.size === item.size);
  if (!foundItem) {
      throw new Error(`Product ${item.product_id} with size ${item.size} not found in arr1`);
  }
});

// tạo order_cart



       for (const item of cart) {
        const cartItemData = {
          size: item.size,
          quantity: item.quantity,
          order_id: createdOrder.order_id*1, // Use the ID of the created order
          product_id: item.product_id*1,
        };
  
        // Insert each item into the order_cart table
        await prisma.order_cart.create({
          data: cartItemData,
        });
      }


// trừ trong stock:

cart.forEach(item => {
  const stockItem = stockFilter.find(stock => stock.product_id === item.product_id && stock.size === item.size);
  if (stockItem) {
      stockItem.stock -= item.quantity;
  } else {
      console.error(`Stock item not found for product_id: ${item.product_id} and size: ${item.size}`);
  }
});
console.log(stockFilter); 
// cập nhật stock:
for (const stockItem of stockFilter) {
  await prisma.stock.updateMany({
      where: {
          stock_id: stockItem.stock_id // Assuming stock_id is the unique identifier
      },
      data: {
          stock: stockItem.stock // Update the stock value
      }
  });
}




      res.send("create order successfully");
    } catch (error) {
      res.send(`BE error ${error}`);
    }
  };

  
  
  export { createOrder };