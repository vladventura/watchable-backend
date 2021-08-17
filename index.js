require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");

const corsOptions = {
  origin: ["http://192.168.1.152:3000", "http://localhost:3000"],
};

const io = require("socket.io")(http, {
  cors: corsOptions,
});
const { router } = require("./routes");
require("./socketHandler").socketHandler(io);

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", router);

app.use((req, res, next) => {
  req.io = io;
  return next();
});

const port = process.env.PORT;

http.listen(port, () => console.log(`Listening on port ${port}`));
