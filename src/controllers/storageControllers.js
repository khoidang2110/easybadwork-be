import multer, {diskStorage } from 'multer';

const storage = multer({
    
    storage:diskStorage({
        destination: process.cwd() + '/public/img',
        filename:(req,file,callback)=>{
            //req: upload fail report
            //file: name file before save
            callback(null,new Date().getTime() + `_${file.originalname}`)
        }
    })
});
console.log('chay multer',storage.array)
export default storage;