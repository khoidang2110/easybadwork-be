import express from 'express';
import rootRoutes from './src/routes/rootRoutes.js';
import cors from 'cors';

const app = express();
const port = 8081;



app.use(express.json()); //middleware để  parse body string -> body json
app.use(express.static(".")); // middleware để xác định nơi lưu file ( dùng lấy hình show browser)
app.use(cors()); //middleware cho tất cả các request từ bên ngoài vào( front end) để trước rootroutes để bypass (backend chạy từ trên xuống)

const corsOptions = {
    origin: 'https://easybadwork-fe.vercel.app', // Replace with your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
app.use(cors(corsOptions));





app.use(rootRoutes);


app.get("/",(req,res)=>{
    res.send("easy bad work be");
})



app.listen(port,()=> {
    console.log(`BE starting with port ${port}`)
})
