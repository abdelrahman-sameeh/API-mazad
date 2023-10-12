const expressAsyncHandler = require("express-async-handler");
const Product = require("../model/productModel");

const stripe = require("stripe")(process.env.STRIPE_SECRET);

// @access   create stripe session
// @route   /api/v1/checkout-session/:productId
exports.getCheckoutSession = expressAsyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        quantity: 1,
        price_data: {
          currency: "egp",
          unit_amount: +product.biggestValue.content * 100,
          product_data: {
            name: req.user.name,
          },
        },
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/mazad/${
      product.chatId
    }`,
    customer_email: req.user.email,
  });

  res.status(200).json({ status: "success", session });
});