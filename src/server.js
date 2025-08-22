import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import routes from "./routes/index.routes.js";
import { verifyToken } from "./middlewares/verifyToken.js";
import db from "./config/Database.js";

const corsOption = {
  origin: "https://jlabs-developer-internship-assessment-web.vercel.app",
  credentials: true,
};

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));
app.use("/api", routes);

app.get("/api/auth/verify-user", verifyToken, (req, res) => {
  const { token } = req.cookies;
  const user = req.currentUser;
  if (!token)
    return res.status(400).json({ message: "Invalid token not found" });

  return res.status(200).json(user);
});

app.get("/", (req, res) => {
  return res.json("Hello Test");
});

const PORT = process.env.PORT || 3000;

const startServer = () => {
  try {
    db.startdb();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
