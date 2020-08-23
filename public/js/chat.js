const socket = io();

const messageForm = document.querySelector("#message-form");
const messageFormBtn = messageForm.querySelector("button");
const messageInput = messageForm.querySelector("input");
const sendLocationBtn = document.querySelector("#send-location");
const messages = document.querySelector("#messages");

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message,
  });
  messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (link) => {
  const html = Mustache.render(locationTemplate, { link });
  messages.insertAdjacentHTML("beforeend", html);
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  messageFormBtn.setAttribute("disabled", "disabled");
  const message = messageInput.value;

  socket.emit("sendMessage", message, (error) => {
    messageFormBtn.removeAttribute("disabled");
    messageInput.value = "";
    messageInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log("Message delivered!");
  });
});

sendLocationBtn.addEventListener("click", () => {
  sendLocationBtn.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        sendLocationBtn.removeAttribute("disabled");
        console.log("Location shared!");
      }
    );
  });
});
