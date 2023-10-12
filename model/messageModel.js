const { default: mongoose } = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.ObjectId,
      ref: "Chat",
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    content: Number,
  },
  { timestamps: true }
);

messageSchema.pre(/^find/, function (next) {
  this.populate({ path: "sender", select: "name" });
  next();
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
