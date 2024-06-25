import { PrismaClient } from "@prisma/client";
import sendMail from '../config/sendmail.js';

const prisma = new PrismaClient();


const createOrder = async (req, res) => {
    try {
      let { full_name, email, address,cart,city,dist,note,payment,phone} = req.body;
      let currentDate = new Date();
      let strDay = currentDate.toISOString();
      const timestamp = currentDate.getTime().toString();
      console.log('khi bam ', timestamp);

   
   
     
      let newData = {
        order_id:timestamp,
        date:strDay,
        full_name,
         email, 
        address, 
city:city ? city : '',
dist:dist ? dist : '',
note:note ? note : '',
payment,
phone

       
      };

// tạo order
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
          order_id: createdOrder.order_id, // Use the ID of the created order
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

if (email){
       // gửi mail shop
       await sendMail({
        //email: 'easybadwork@gmail.com',
         email: 'easybadwork.02@gmail.com',
        subject:`ebw shop ${timestamp}`,
        html: `<h1>Có khách mua hàng!!! mã đơn hàng là: ${timestamp} </h1> `
      })
      // gửi mail khách hàng
 
      await sendMail({
        email,
        subject:`ebw shop ${timestamp}`,
        html: `<h1>Bạn đã đặt thành công đơn hàng từ easybadwork, mã đơn hàng của bạn là: ${timestamp}, easybadwork xin cảm ơn. </h1>
        <h1>You have successfully placed an order from EasyBadWork. Your order code is: ${timestamp}, Thank you.</h1>`
      })
    }


      res.send(`${timestamp}`);
    } catch (error) {
      res.send(`BE error ${error}`);
    }
  };
const getOrderById = async (req,res)=>{

  try {
    let { order_id } = req.query;

     const order = await prisma.orders.findMany({
    
       where: {
         order_id
       
       },
       include: {
        order_cart: true,
 
      },
     });
     if (order.length > 0) {
       res.send(order);
     } else {
       res.send(`No order found with id ${order_id}`);
     }
   } catch (error) {
     res.status(500).send(`Internal server error: ${error}`);
   }
};

const deleteOrder = async (req, res) => {
  try {
    let { order_id } = req.params;

    const findItem = await prisma.orders.findUnique({
      where: {
        order_id,
      },
    });

    if (findItem &&findItem.deleted===false) {
      await prisma.orders.update({
        where: {
         order_id,
        },
        data: {
          deleted: true,
        },
      });
      res.send("You just deleted the order");
    } else {
      res.send("order not found");
    }
  } catch (error) {
    console.error(`Backend error: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};
const getOrderByDay = async (req,res)=>{
console.log('click')
  try {
    let { start_day,end_day,page,size } = req.query;
    let num_page = Number(page);
    let num_size = Number(size);
    let index = (num_page - 1) * num_size;


console.log('startday',start_day);
//console.log('newstarday',new Date(start_day))

     const order = await prisma.orders.findMany({
      skip:index,
      take:num_size,
       where: {
        date: {
          gte: new Date(start_day), // Start date
          lte: new Date(end_day),   // End date
        },
       
       },
       include: {
        order_cart: true,
 
      },
     });
     if (order.length > 0) {
       res.send(order);
     } else {
       res.send(`No order found`);
     }
   } catch (error) {
     res.status(500).send(`Internal server error: ${error}`);
   }
};


  export { createOrder,getOrderById,deleteOrder,getOrderByDay };