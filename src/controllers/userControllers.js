import { PrismaClient } from "@prisma/client";
//import { checkToken, createToken } from "../../config/jwt.js";
import bcrypt from "bcrypt";
import { checkToken, createToken } from "../config/jwt.js";

const prisma = new PrismaClient();

// dang ky
// cap nhat

const login = async (req, res) => {
  try {
    let { user_id, password } = req.body;
    // check email
    let data = await prisma.users.findUnique({
      where: {
        user_id,
      },
    });

    if (data) {
      // check pass đúng -> tạo token
      // so sánh pass nhập và pass ở db
      let checkPassword = bcrypt.compareSync(password, data.password);
      if (checkPassword) {
        // có => tạo token
        // tạo token -> jsonwebtoken jwt
        // mã hoá password->bcrypt
        let payload = {
          user_id: data.user_id,
          name: data.name,
          phone_number:data.phone_number,
          email: data.email,
          password: data.password,
       
         
        };
        let token = createToken(payload);
        res.status(200).send(token);
      } else {
        res.status(400).send("password incorrect!");
      }
    } else {
      res.status(404).send("login fail");
    }

    // => báo lỗi
  } catch (error) {
    res.send(`Backend error: ${error}`);
  }

  // res.send({email,password})
};

const signUp = async (req, res) => {
  try {
    let { user_id, name, phone_number,email,password } = req.body;

    const data = await prisma.users.findUnique({
      where: {
        user_id,
      },
    });

    if (data) {
      res.status(400).send("User exists!!!");
    } else {
      // mã hoá pass
      let encodePassword = bcrypt.hashSync(password, 10);
      let newUser = {
       user_id,
     name,
     phone_number,
     email,
        password: encodePassword
      
      };
      await prisma.users.create({
        data: newUser,
      });
      res.status(201).send("user is created!");
    }
  } catch (error) {
    res.status(500).send(`Backend error: ${error}`);
  }
};
const updateUser = async (req, res) => {
  let { user_id, name,phone_number,email,password } = req.body;
  let { token } = req.headers;
  let isValidToken = checkToken(token);
  let encodePassword = bcrypt.hashSync(password, 10);

  // isvalidtoken status code 200 là trùng token
  // 401  là invalid
//   console.log('isValidToken',isValidToken.statusCode)
// if(isValidToken.statusCode==401){
//     res.send("token incorrect");
// }else 
if (user_id == Number(isValidToken.data.data.user_id)) {
   const updatedUser =  await prisma.users.update({
      where: {
        user_id,
      },
      data: {
        name: name ? name : isValidToken.data.data.name,
        phone_number: phone_number ? phone_number : isValidToken.data.data.phone_number,
        email: email ? email : isValidToken.data.data.email,
        password: password ? encodePassword : isValidToken.data.data.password,
       
      
      },
    });

    let payload = {
      user_id: updatedUser.user_id,
      name: updatedUser.name,
phone_number:updateUser.phone_number,
      email: updatedUser.email,
      password: updatedUser.password,
      
     
    };

    let newToken = createToken(payload);
    res.status(200).send({
      message: "User updated, please use the new token to access",
      token: newToken,
    });
  } else {
    res.send("you are not the owner");
  }
};
const getUser = async (req, res) => {
    let { user_id } = req.params;
    let { token } = req.headers;
    let isValidToken = checkToken(token);
    console.log(isValidToken)
    try {
      let data = await prisma.users.findMany({
        where: {
          user_id: Number(user_id),
        },
      });
  
      if (data.length === 0) {
        res.send("user id does not exits");
      } else {
        if (data.user_id == isValidToken.data.data.user_id) {
          // neu id tìm giống id token thì show info token (info token ko có avatar)
          res.send(isValidToken.data);
        } else {
          // show info data
          res.send(data);
        }
      }
    } catch (error) {
      res.send(`BE error ${error}`);
    }
  };
export { signUp, login, updateUser ,getUser};
