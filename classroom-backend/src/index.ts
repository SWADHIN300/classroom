import  express  from "express";

const app = express();
const port = 8000;

app.use(express.json());



app.listen(port, () => {
    console.log(`server running at port:${port}`)
});