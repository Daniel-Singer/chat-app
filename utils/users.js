const users = [];

// User zu Chat hinzufügen
function userJoin(id,username,room){
  const user = {id,username,room};
  users.push(user);
  return user;
};

// Der Aktuelle User
function getCurrentUser(id){
  return users.find(user => user.id === id);
};

// User verlässt Chat
function userLeave(id){
  const index = users.findIndex(user => user.id === id);
  if(index !== -1){
    return users.splice(index, 1)[0];
  };
};

// Alle User eines Chatroome
function getRoomUsers(room){
  return users.filter(user => user.room === room);
};

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};