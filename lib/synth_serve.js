var socketIO = require('socket.io');
var guestNumber = 1;
var nicknames = {};

exports.createChat = function (server) {
  socketServer = socketIO.listen(server);
  socketServer.on("connection", function(socket) {
    socket.join("Lobby");
    socket.room = "Lobby";
    var nickname = "guest" + guestNumber;
    socket.emit("nicknameChangeResult", nickname);
    nicknames[socket.id] = nickname;

    socket.on("selectRoom", function (room) {
        if(room !== undefined && room !== "") {
          socket.leave(socket.room);
          socket.room = room;
          socket.join(room);
          console.log(socket.room);
          socket.emit("nicknameChangeResult", {
            success: false,
            message: "You have joined " + room + "."
          });
          socket.broadcast.to(socket.room).emit("new-message", nicknames[socket.id] + " has joined " + room + ".");
        }
    });

    socket.on("nicknameChangeRequest", function (data) {
      var unique = true
      for (var key in nicknames) {
        if (nicknames.hasOwnProperty(key)) {
          if (nicknames[key] === data) {
            unique = false;
            socket.emit('nicknameChangeResult', {
            success: false,
            message: 'Names already taken!'
            });
            break;
          } else if (data.match(/^guest.*$/)){
            unique = false;
            socket.emit('nicknameChangeResult', {
            success: false,
            message: 'Names cannot begin with "Guest".'
            });
            break;
          }
        }
      }
      if (unique) {
        nicknames[socket.id] = data;
        socket.emit('nicknameChangeResult', data);
      }

    });
    socket.on("submit-message", function(data) {
      socket.broadcast.to(socket.room).emit("new-message", nicknames[socket.id] + ": " + data);
      socket.emit("new-message", nicknames[socket.id] + ": " + data);
    });
    socket.on('disconnect', function () {
      console.log('Client disconnected. Socket ID: ' + socket.id);
      delete nicknames[socket.id];
    });
    guestNumber++;
  });
}


