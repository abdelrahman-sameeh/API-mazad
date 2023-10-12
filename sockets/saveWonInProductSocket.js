const Product = require("../model/productModel");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("setIsWonInProduct", async (whoWon) => {
      await Product.findOne(
        {
          "biggestValue.sender": whoWon,
        },
        { whoWon },
        { new: true }
      );
      socket.emit("setWonSuccessfully");
    });
  });
};
