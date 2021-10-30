const express = require('express');
const path = require('path')
const socketio = require('socket.io');
const http = require('http');
const formatMessage = require('.\\utils\\messages');
var socketioJwt = require('socketio-jwt');
const { userJoin, getCurrentUser,userLeave, getRoomUsers } = require('.\\utils\\users');
const redis = require('redis');


const app = express();
const server  =  http.createServer(app)
const io  =  socketio(server)

const PORT = 3001 || process.env.PORT;


app.use(express.static(path.join(__dirname, 'public')));



bot = 'cNovels'

io.adapter(redis({ 
  host: '172.26.255.129', 
  port: 6379
 }));
const redis_client = redis.createClient({
  host: '172.26.255.129',
  port: 6379,
 // password: '<password>'
});

redis_client.on('error', err => {
console.log('Error ' + err);
});

redis_client.on("message", function (channel, message) {
  console.log("Message: " + message +   "on channel:" + channel + "is arrive!" );
 });
 



redis_client.on("subscribe", function(channel, count) {
	console.log("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
});









redis_client.subscribe("notification");


io.on('connection', socketioJwt.authorize({

  secret: myEnv.JWT_SECRET,

  timeout: 15000

}));


io.onAny((event, ...args) => {
  console.log(event, args);
});

io.on('authenticated', socket =>{

  //const sessionID = socket.handshake.auth.sessionID;

  console.log(socket.decoded_token.email);
  
  //user  that joins room from redis
  redis_client.on()
  
  
  socket.on('joinRoom', ({username, room}) => {

    
    const user  =  userJoin(socket.id, username, room)

    socket.join(user.room);

    console.log('a user is connected');

      //single connected client 
  socket.emit('message' , formatMessage(bot,'welcome to the group'));

    //every client except connected user

  socket.broadcast.to(user.room).emit('message', formatMessage(bot,`a ${user.username} has connected` ));


  io.to(user.room).emit('roomUsers', {
    users : getRoomUsers(user.room),
  })


  } );

socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });
 

//listen for chat message

socket.on('chatMessage', (msg)=>{
  const user  =  getCurrentUser(socket.id)
  console.log(msg);
  io.to(user.room).emit('message', formatMessage( user.username, msg));
})



socket.on('disconnect', () => {
  user = userLeave(socket.id);
  io.to(user.room).emit('message', formatMessage(bot, `${user.username} has left` ));
  })

  io.to(user.room).emit('roomUsers', {
    users : getRoomUsers(user.room),
  })
})


// mongoose.connect(dbUrl  ,(err) => {
//   console.log('mongodb connected',err);
// })

server.listen(PORT, () => {
  console.log(`server is running on port, ${server.address().port}`);
});