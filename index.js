import express from 'express';
import rootRoutes from './src/routes/rootRoutes.js';
import cors from 'cors';

const app = express();
const port = 8081;



app.use(express.json()); //middleware để  parse body string -> body json
app.use(express.static(".")); // middleware để xác định nơi lưu file ( dùng lấy hình show browser)
app.use(cors()); //middleware cho tất cả các request từ bên ngoài vào( front end) để trước rootroutes để bypass (backend chạy từ trên xuống)
app.use(rootRoutes);


app.get("/",(req,res)=>{
    res.send("Hello node38 youtube");
})



app.listen(port,()=> {
    console.log(`BE starting with port ${port}`)
})
