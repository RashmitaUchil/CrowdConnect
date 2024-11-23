
const stripe = require('stripe')('sk_test_51QOFhLI3THdeQF13JKmNMmMDBuclGlGQBWK4VSTYfDkAWN7r2pS9WWIfTgoV5nL1YhPZUEfpuZ2x5zB78Juhlf1L004CxNz3ay');
const YOUR_DOMAIN = 'http://localhost:5050';
const create_checkout_session=async (req, res) => {
    try {
      
        const {amount}=req.body
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Donation",
              },
              unit_amount: amount*100 , // Stripe expects amount in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/?success=true`,
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