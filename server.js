var express=require("express");
var app=express();
var server=require("http").createServer(app);
var io=require("socket.io").listen(server);
var users=[];

app.use('/',express.static(__dirname+"/public"));

server.listen(3000,function(){
    console.log("server is listening on 3000 port");
});

io.on("connection",function(socket){
    socket.on("login",function(nickname){
        if(users.indexOf(nickname)>-1){
            socket.emit('nickExist');
        }
        else{
            socket.userIndex=users.length;
            socket.nickname=nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            //向所有连接用户发送此函数
            io.sockets.emit("system",nickname,users.length,'login',users);
            console.log(users);
        }
    });
    socket.on("disconnect",function(){
        users.splice(socket.userIndex,1);
        if(socket.nickname!==null){
            socket.broadcast.emit('system',socket.nickname,users.length,'logout',users);
        }
    });
    socket.on('post',function(content){
        socket.broadcast.emit('newMessage',socket.nickname,content);
    });
});
