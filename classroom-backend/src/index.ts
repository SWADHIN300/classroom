import  express  from "express";
import cors from "cors";
import subjectRouter from "./routes/subjects.js";
import securitymiddleware from "./middleware/security.js";

const app = express();
const PORT = 8000;

if(!process.env.FRONTEND_URL) throw new Error('FRONTEND_URL is not in .env file');

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET','POST','PUT','DELETE'],
    credentials:true
}))

app.use(express.json());
app.use(securitymiddleware);

app.use('/api/subjects',subjectRouter);

app.get('/',(req,res) => {
    res.send('Hello,welcome to the Classroom API!');
});

app.listen(PORT, ()=>{
    console.log(`server run in port: ${PORT}`);
});
