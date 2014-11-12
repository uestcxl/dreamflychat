window.onload=function(){
    var chat=new Chat();
    chat.init();
};

var Chat=function(){
    this.socket=null;
};

Chat.prototype={
    init:function(){
        var that=this;
        this.socket=io.connect();
        this.socket.on("connect",function(){
           document.getElementById('info').textContent="请输入您的昵称";
           document.getElementById('nickWrapper').style.display='block';
           document.getElementById('nicknameinput').focus();
        });

        console.log(this.socket);
        //设置昵称～
        document.getElementById("loginBtn").addEventListener('click',function(){
            var nickname=document.getElementById('nicknameinput').value;
            if(nickname.trim().length!==0){
                this.socket.emit('login',nickname);
            }
            else{
                document.getElementById('nicknameinput').focus();
            }
        },false);

        this.socket.on('nickExist',function(){
            document.getElementById('info').textContent="该用户已存在！请环一个昵称！";
        });

        this.socket.on('loginSuccess',function(){
            document.title="亲爱的"+document.getElementById('nicknameinput').value+",欢迎您";
            document.getElementById('loginWrapper').style.display="none";
            document.getElementById('messageInput').focus();
        });
    }
};
