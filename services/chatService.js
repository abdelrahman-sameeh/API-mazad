const expressAsyncHandler = require("express-async-handler");
const Message = require("../model/messageModel");

exports.getMessagesInSpecificChat = expressAsyncHandler(
  async (req, res, next) => {
    const response = await Message.find({ chatId: req.params.id });
    res.status(200).json({ data: response });
  }
);
