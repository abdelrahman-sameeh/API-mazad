const { default: mongoose } = require("mongoose");

const categorySchema = mongoose.Schema({
  image: String,
  title: String
})

categorySchema.post("init", (doc) => {
  if (doc.image) {
    const image = `${process.env.BASE_URL}/uploads/category/${doc.image}`;
    doc.image = image;
  }
});

categorySchema.post("save", (doc) => {
  if (doc.image) {
    const image = `${process.env.BASE_URL}/uploads/category/${doc.image}`;
    doc.image = image;
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;