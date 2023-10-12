const express = require("express");
const { getMessagesInSpecificChat } = require("../services/chatService");
const router = express.Router();

router.get("/chat/:id", getMessagesInSpecificChat);

module.exports = router;
