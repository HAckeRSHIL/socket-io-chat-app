const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room are required!",
    };
  }
  var existingUser = false;
  for (let user of users) {
    if (user.room === room && user.username == username) {
      existingUser = true;

      break;
    }
  }

  if (existingUser) {
    return {
      error: "Username is in user!",
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

// addUser({
//   id: 22,
//   username: "Harshil",
//   room: "India",
// });

// addUser({
//   id: 212,
//   username: "Patel",
//   room: "Japan",
// });

// addUser({
//   id: 222,
//   username: "Yogendrakumar",
//   room: "USA",
// });

// addUser({
//   id: 242,
//   username: "Hetalben",
//   room: "India",
// });

// addUser({
//   id: 12,
//   username: "Trupal",
//   room: "USA",
// });

const getUser = (id) => {
  return users.find((user) => {
    return user.id == id;
  });
};

const getUserInRoom = (room) => {
  room = room.trim().toLowerCase();
  return (res = users.filter((user) => user.room == room));
};
// const obj = getUser(12);
// console.log("id no : 12 ", obj);

// console.log("Indians : ", getUserInRoom("india"));
// console.log("USAsians : ", getUserInRoom("usa"));
// console.log(users);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
};
