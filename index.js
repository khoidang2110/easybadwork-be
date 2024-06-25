import express from 'express';
import rootRoutes from './src/routes/rootRoutes.js';
import cors from 'cors';

const app = express();
const port = 8081;



app.use(express.json()); //middleware để  parse body string -> body json
app.use(express.static(".")); // middleware để xác định nơi lưu file ( dùng lấy hình show browser)
app.use(cors()); //middleware cho tất cả các request từ bên ngoài vào( front end) để trước rootroutes để bypass (backend chạy từ trên xuống)

const allowedOrigins = [
    'https://easybadwork-fe.vercel.app',
    'http://localhost:3000',
    'https://www.easybadwork.com',  // Add more domains as needed
  ];
  
  const corsOptions = {
    origin: (origin, callback) => {
      // Check if the incoming origin is in the allowedOrigins list
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
