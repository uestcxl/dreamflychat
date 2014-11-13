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
                that.socket.emit("login",nickname);
            }
            else{
                document.getElementById('nicknameinput').focus();
            }
        },false);

        this.socket.on('nickExist',function(){
            document.getElementById('info').textContent="该用户已存在！请换一个昵称！";
        });

        this.socket.on('loginSuccess',function(){
            document.title="亲爱的"+document.getElementById('nicknameinput').value+",欢迎您";
            document.getElementById('loginWrapper').style.display="none";
            document.getElementById('messageInput').focus();
        });

        this.socket.on("system",function(nickname,usercount,type,userList){
            if(nickname!==null){
                var message=nickname+(type==="login" ? "加入聊天室" : "离开聊天室");

                that.showMessage('系统',message,'red');

                document.getElementById("count").innerHTML=usercount;

                var userOnline=document.getElementById("userOnline");
                userOnline.innerHTML="";
                for(var i=0;i<userList.length;i++){
                var oneList=document.createElement("p");
                    console.log(userList[i]);
                    oneList.textContent=userList[i];
                    userOnline.appendChild(oneList);
                    delete(oneList);
                }
            }
        });

        document.getElementById('sendBtn').addEventListener('click',function(){
            var messageContent=document.getElementById('messageInput');
            var content=messageContent.value;

            messageContent.value="";
            messageContent.focus();
            if(content.trim().length!==0){
                that.socket.emit('post',content);
                that.showMessage('我',content);
            }
        },false);

        that.socket.on('newMessage',function(username,content){
            that.showMessage(username,content);
        });
    },
    showMessage:function(user,msg,color){
        var historyMsg=document.getElementById("historyMsg");
        var onemessage=document.createElement("p");
        var time=new Date();
        onemessage.style.color=color||"#000";
        onemessage.innerHTML=time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()+"<span class='timespan'> "+user+"说 </span>"+msg;
        historyMsg.appendChild(onemessage);
        historyMsg.scrollTop=historyMsg.scrollHeight;
    },

};
