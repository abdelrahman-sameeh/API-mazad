module.exports = (io) => {
  io.on('connection', socket=>{
    socket.on('joinMazadChat', (chatId) => {
      socket.join(chatId);
    })
  })
} 