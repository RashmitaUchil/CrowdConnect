const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const create_checkout_session=require("./stripe.js")

const app = express();
app.use(express.static('public'));


//router imports
const userRouter = require("./routers/userRouter");
const campaignRouter = require("./routers/campaignRouter");
const paymentRouter = require("./routers/paymentRouter");
const donationRouter = require("./routers/donationRouter");
const authRouter = require("./routers/authRouter");


// middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




app.use("/api/user", userRouter);
app.use("/api/campaign", campaignRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/donation", donationRouter);
app.use("/auth", authRouter);
app.post("/create-checkout-session", create_checkout_session)

// database connection
mongoose.connect("mongodb+srv://rashmitauchil20212:McaProject2@cluster0.iewvd.mongodb.net/").then(console.log("Connected to db"));

// opening up port
app.listen(5050, () => {
  console.log("Server listening at http://localhost:5050");
});
