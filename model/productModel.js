const { default: mongoose } = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    minLength: 2,
  },
  image: String,
  description: String,
  firstPrice: Number,
  leastIncreasePrice: Number,
  biggestValue: {
    content: Number,
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  startTime: Date,
  endTime: Date,
  phoneNumber: String,
  isPaid: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  whoWon: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
  chatId: {
    type: mongoose.Schema.ObjectId,
    ref: "Chat",
  },
});

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name role" });
  next();
});

productSchema.post("init", (doc) => {
  if (doc.image) {
    const image = `${process.env.BASE_URL}/uploads/products/${doc.image}`;
    doc.image = image;
  }
});

productSchema.post("save", (doc) => {
  if (doc.image) {
    const image = `${process.env.BASE_URL}/uploads/products/${doc.image}`;
    doc.image = image;
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
