const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const create_checkout_session=require("./stripe.js")
const getRawBody = require("raw-body");
const axios = require("axios");



const app = express();
app.use(express.static('public'));




//router imports
const userRouter = require("./routers/userRouter");
const campaignRouter = require("./routers/campaignRouter");
const paymentRouter = require("./routers/paymentRouter");
const donationRouter = require("./routers/donationRouter");
const authRouter = require("./routers/authRouter");

app.post('/webhook',async (request, response) => {

  try{
    const rawBody = await getRawBody(request);
  const stripe = require('stripe')('sk_test_51MaL6pSEfjueS3xIMQ6M4e5HfDZlKloQTqIFkQFBrmI3c9sC3xgsZrVe9sh95LCqmQMG7YGFGAIAbfqFhAS0A1Ur00ttVvB0gZ');
  const endpointSecret = "whsec_8f18bd7d42dddb1b36c647eb13f24bef6a1748a94aca69682ee336f32bf0c927";



  let event;
  const signature = request.headers['stripe-signature'];

  event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object; // Contains the checkout session
    const sessionId = session.id;



    console.log('Checkout Session ID:', sessionId);
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    const lineItems = checkoutSession.line_items.data;
    const product_id =  checkoutSession.metadata.product_id
    const username = checkoutSession.metadata.username;
    const user_id = checkoutSession.metadata.user_id;
  
      lineItems.forEach((item) => {

        const data = {
          campaignId: product_id,
          donationAmount: item.price.unit_amount / 100,
          orderId: item.id,
          paymentId: item.id,
          user_id : user_id,
          username : username
        }
        axios.post('http://localhost:5050/api/donation', data)
          .then(response => {
            console.log('Success:', response.data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      
      });
  }

  response.status(200).send('Webhook received');
}catch(err){
  console.log(err)
}
});



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
