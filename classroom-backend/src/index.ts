import  express  from "express";
import subjectRouter from "./routes/subjects.js";

const app = express();
const PORT = 8000;

app.use(express.json());

app.use('/api/subjects',subjectRouter);


app.listen(PORT, ()=>{
    console.log(`server run in port: ${PORT}`);
});