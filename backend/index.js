import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.js";
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/property.js";
import issueRoutes from "./routes/issue.js";
import aiRoutes from "./routes/ai.js";
import session from "express-session";
import passport from "passport";
import configurePassport from "./config/passport.js";
import userRoute from "./routes/user.js";

dotenv.config();
connectDB();
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

const app = express();
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(express.json());



app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
  })
);
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/properties", propertyRoutes);
app.use("/user", userRoute);
app.use("/issues", issueRoutes);
app.use("/ai", aiRoutes);

app.get("/", (req, res) => res.send("Rentify API is running..."));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
