import User from '../Models/user';

const addUser = ({ username, room}) => {
  //cleaning data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate data
  if (!username || !room) {
    return {
      error: 'user name and room are required'
    }
  }
  // checking existing user

  // const existingUser = users.find((user) => {
  //   return user.room === room && user.username === username
  // });

//   if(existingUser) {
//     return {
//     error: 'username is in use'
//   }
// }
  //store
  const user = { username, room };
  const newUser = new User(user);
  newUser.save((error, data) => {
    if(error) return console.error(error);

    return data
  });
  // users.push(user);

  // return user;
};

const removeUser = (id) => {
 const index = users.findIndex((user) => user.id === id);
 if (index !== -1) {
   return users.splice(index,1)[0];
 }
};

const getUser= (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((users) => users.room === room);