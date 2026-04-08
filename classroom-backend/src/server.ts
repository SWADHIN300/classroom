import express from "express";
import router from "./routes/subjects.js";
import cors from "cors";

const app = express();
const port = 8000;

app.use(express.json());
app.use("/api/subjects", router);
if (!process.env.FRONTEND_URL) throw new Error('fontend url not found')
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
})) ;

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

app.listen(port, () => {
  console.log(`server running at port:${port}`);
});
