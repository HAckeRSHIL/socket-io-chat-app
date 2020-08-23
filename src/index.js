const express = require("express");
const http = require("http");
const app = express();
const socketio = require("socket.io");
const path = require("path");
const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const server = http.createServer(app);
const io = socketio(server);
const Filter = require("bad-words");
app.use(express.static(publicDirectoryPath));
app.get("/about", (req, res) => {
  res.send("it is working");
});

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }

    io.emit("message", message);
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "locationMessage",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });
});
server.listen(PORT, () => {
  console.log("Server is up and running on " + PORT);
});
