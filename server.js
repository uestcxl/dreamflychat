var express=require("express");
var app=express();
var server=require("http").createServer(app);
var io=require("socket.io").listen(server);

app.use('/',express.static(__dirname+"/public"));

server.listen(3000,function(){
    console.log("server is listening on 3000 port");
});

io.on("connection",function(socket){
    socket.on("foo",function(data){
        console.log(data);
    });
});
