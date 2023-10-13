require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const path = require("path");
const ApiError = require("./utils/ApiError");
const { connectDB } = require("./middleware/connectDB");
const { globalError } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const chatRoutes = require("./routes/chatRoutes");
const orderRoutes = require("./routes/orderRoute");

const { Server } = require("socket.io");
const { webhookCheckout } = require("./services/orderService");

// connect with database
connectDB();

// Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
)

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", favoriteRoutes);
app.use("/api/v1", chatRoutes);
app.use("/api/v1", orderRoutes);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    // origin: "https://65279589e84c8800087acffb--mazad.netlify.app",
  },
});

require("./sockets/initialSocket")(io);
require("./sockets/saveMazadValueSocket")(io);
require("./sockets/saveWonInProductSocket")(io);

// handle all route
app.all("*", (req, res, next) => {
  // const error = new Error(`can't find route match this url ${req.originalUrl}`)
  next(new ApiError(`can't find route match this url ${req.originalUrl}`, 400));
});

// global error handle middleware
app.use(globalError);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("Server listen on port 3001");
});

// handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`rejection un handle error ${err.name} -> ${err.message}`);
  // if have a pending request => server close after end it
  server.close(() => {
    console.log("shutting down application ...");
    // close app
    process.exit(1);
  });
});
