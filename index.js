import express from "express";
import cors from "cors";
import mysql from "mysql";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import webroute from "./routes/routes.js";

import crypto from "crypto";
const secretKey = crypto.randomBytes(32).toString("hex");
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use(webroute);


export const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "seaauth",
});
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database Connected");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
