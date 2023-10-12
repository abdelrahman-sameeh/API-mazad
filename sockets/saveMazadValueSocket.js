const Message = require("../model/messageModel");
const Product = require("../model/productModel");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("sendMazadValue", async (data) => {
      // 1-save message
      await Message.create(data);
      // 2-get product and update the latest value

      await Product.updateOne(
        { chatId: data.chatId },
        {
          $inc: {
            "biggestValue.content": +data.content,
          },
        }
      );

      await Product.updateOne(
        { chatId: data.chatId },
        {
          "biggestValue.sender": data.sender,
        }
      );

      // 3- get message and send to all sockets in room
      const message = await Message.findOne({
        chatId: data.chatId,
        content: data.content,
        sender: data.sender,
      }).populate({ path: "sender", select: "name" });
      if (message) io.to(data.chatId).emit("receivedMazadValue", message);
    });
  });
};
