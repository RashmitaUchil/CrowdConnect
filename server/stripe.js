
const stripe = require('stripe')('sk_test_51MaL6pSEfjueS3xIMQ6M4e5HfDZlKloQTqIFkQFBrmI3c9sC3xgsZrVe9sh95LCqmQMG7YGFGAIAbfqFhAS0A1Ur00ttVvB0gZ');
const YOUR_DOMAIN = 'http://localhost:5050';
const create_checkout_session=async (req, res) => {
    try {
      
      const {amount,product_id,username,user_id}=req.body
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Donation",
              },
              unit_amount: amount*100 ,
            },
            quantity: 1,
          },
        ],
        metadata : {
          product_id : product_id,
          username : username,
          user_id : user_id
        },
        mode: "payment",
        customer_email: 'customer@example.com',
        billing_address_collection: 'auto', 
        shipping_address_collection: {
          allowed_countries: ['IN'], // This limits to Indian addresses
        },
        success_url: `http://localhost:5173/success`,
        cancel_url: `${YOUR_DOMAIN}/?canceled=true`,
      });
      console.log(session.url)
      res.status(200).json({ url: session.url });
  
    } catch (error) {
      console.error("Error creating checkout session:", error.message);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  };

  module.exports=create_checkout_session;