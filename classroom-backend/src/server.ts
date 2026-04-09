import "dotenv/config";
import express from "express";
import router from "./routes/subjects.js";
import cors from "cors";

const app = express();
const port = 8000;
const allowedOrigins = [
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin?.trim()));

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());
app.use("/api/subjects", router);

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

app.listen(port, () => {
  console.log(`server running at port:${port}`);
});
