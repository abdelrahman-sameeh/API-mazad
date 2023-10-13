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
    client_reference_id: req.params.productId,
    metadata: "test",
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
    console.log(event.data.object);
    // const order = new Order({
    //   user: req.user._id,
    //   product: event.data.object.client_reference_id,
    //   price: event.data.object.amount_subtotal,
    // })
    // await order.save()
    // console.log(order);
    // if (order) {
    //   await Product.findByIdAndUpdate(event.data.object.client_reference_id, {
    //     isPaid: true,
    //   });
    // }
  }

  res.status(200).json({ received: true });
});
