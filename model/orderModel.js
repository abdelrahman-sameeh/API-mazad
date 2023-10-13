const { default: mongoose } = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    price: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function(next){
  this.populate('product')
  next()
})

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
