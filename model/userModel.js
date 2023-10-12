const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "username is required"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "email is required"],
    unique: [true, "email must be unique"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [4, "Too short password"],
  },
  role: {
    type: String,
    enum: ["admin", "user", "trader"],
    default: "user",
  },
  favorites: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
  addresses: [
    {
      alias: {
        type: String,
        trim: true,
      },
      details: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
