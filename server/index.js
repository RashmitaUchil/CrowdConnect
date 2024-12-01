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

const stripe = require('stripe')('sk_test_51MaL6pSEfjueS3xIMQ6M4e5HfDZlKloQTqIFkQFBrmI3c9sC3xgsZrVe9sh95LCqmQMG7YGFGAIAbfqFhAS0A1Ur00ttVvB0gZ');
const endpointSecret = "whsec_8f18bd7d42dddb1b36c647eb13f24bef6a1748a94aca69682ee336f32bf0c927";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  console.log(`Unhandled event type ${event.type}`);

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


// database connection
mongoose.connect("mongodb+srv://rashmitauchil20212:McaProject2@cluster0.iewvd.mongodb.net/").then(console.log("Connected to db"));

// opening up port
app.listen(5050, () => {
  console.log("Server listening at http://localhost:5050");
});
