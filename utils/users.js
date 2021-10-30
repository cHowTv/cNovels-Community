io.use((socket, next) => {
    //redis on  connection get the session from django and store
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      // find existing session
      const session = sessionStore.findSession(sessionID);
      if (session) {
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        return next();
      }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    // create new session
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    next();
  });



function userJoin(id, username, room){
    return {
        id,
        username,
        room
    }
}

function getCurrentUser(id){
    return id;
}

//removes user from room 
function userLeave(id){


}

function getRoomUsers(room){

}
module.exports ={
    userJoin,
    getCurrentUser, 
    userLeave,
    getRoomUsers
} 