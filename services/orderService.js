const expressAsyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const handleFactory = require("./handleFactory");
const Order = require("../model/orderModel");

exports.setFilterObj = (req, res, next) => {
  req.body.filter = { user: req.user._id };
  next();
};

exports.getLoggedUserOrders = handleFactory.getListOfItems(Order, "Order");

exports.getSpecificOrder = expressAsyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ product: req.params.id }, { user: 1 });
  res.status(200).json({ data: order });
});

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
    success_url: `https://master--mazad.netlify.app`,
    cancel_url: `https://master--mazad.netlify.app`,
    customer_email: req.user.email,
    client_reference_id: JSON.stringify({
      productId: req.params.productId,
      userId: req.user._id,
    }),
  });

  res.status(200).json({ status: "success", session });
});

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = expressAsyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    //  Create order
    const data = JSON.parse(event.data.object.client_reference_id);
    const order = await Order.findOne({
      user: data.userId,
      product: data.productId,
    });
    if (!order) {
      const newOrder = new Order({
        user: data.userId,
        product: data.productId,
        price: event.data.object.amount_subtotal,
      });
      await newOrder.save();
    }
  }

  res.status(200).json({ received: true });
});
