const express = require("express");
const http = require("http");
const app = express();
const socketio = require("socket.io");
const path = require("path");
const PORT = process.env.PORT || 4200;
const publicDirectoryPath = path.join(__dirname, "../public");
const server = http.createServer(app);
const io = socketio(server);
const { generateMessage } = require("./utils/messages");
const Filter = require("bad-words");
const {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
} = require("./utils/users");

app.use(express.static(publicDirectoryPath));
app.get("/about", (req, res) => {
  res.send("it is working");
});

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage("Welcome !", "Server"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(user.username + " has joined!", "Server")
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });
    callback();
  });
  socket.on("sendMessage", (message, callback) => {
    const { username, room } = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }

    io.to(room).emit("message", generateMessage(message, username));
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    const { username, room } = getUser(socket.id);
    io.to(room).emit(
      "locationMessage",
      generateMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
        username
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(user.username + " has left!", "Server")
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUserInRoom(user.room),
      });
    }
  });
});
server.listen(PORT, () => {
  console.log("Server is up and running on " + PORT);
});
