window.onload=function(){
    var chat=new Chat();
    chat.init();
};

window.onbeforeunload = function() {
    　　return "确定离开页面吗？";
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

        //添加登陆以及登出的通知
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

        //发送消息
        document.getElementById('sendBtn').addEventListener('click',function(){
            var messageContent=document.getElementById('messageInput');
            var content=messageContent.value;
            var color=document.getElementById('colorStyle').value;

            messageContent.value="";
            messageContent.focus();
            if(content.trim().length!==0){
                that.socket.emit('post',content,color);
                that.showMessage('我',content,color,1);
            }
        },false);

        that.socket.on('newMessage',function(username,content,color){
            that.showMessage(username,content,color,0);
        });

        //初始化表情框
        that.initEmoji();
        document.getElementById('emoji').addEventListener('click',function(e){
            var emojiWrapper=document.getElementById('emojiWrapper');
            emojiWrapper.style.display='block';
            e.stopPropagation();
        },false);
        document.body.addEventListener('click',function(e){
            var emojiWrapper=document.getElementById('emojiWrapper');
            if(e.target!==emojiWrapper){
                emojiWrapper.style.display='none';
            }
        });

        //点击图片的时候把图片放到消息发送框中
        document.getElementById('emojiWrapper').addEventListener('click',function(e){
            var target=e.target;
            if(target.nodeName.toLowerCase()==='img'){
                var messageInput=document.getElementById('messageInput');
                messageInput.focus();
                messageInput.value +='[emoji:'+target.title+']';
            }
        },false);

        //清空消息列表
        document.getElementById('clearBtn').addEventListener('click',function(){
            document.getElementById('historyMsg').innerHTML="";
        });

        //回车发送昵称
        document.getElementById('nicknameinput').addEventListener('keyup',function(e){
            if(e.keyCode===13){
                var name=document.getElementById('nicknameinput').value;
                if(name.trim().length!==0){
                    that.socket.emit('login',name);
                }
            }
        },false);

        //回车发送消息
        document.getElementById('messageInput').addEventListener('keyup',function(e){
            var messageInput=document.getElementById('messageInput');
            var message=messageInput.value;
            var color=document.getElementById('colorStyle').value;
            if(e.keyCode===13 && message.trim().length!==0){
                messageInput.value="";
                that.socket.emit('post',message,color);
                that.showMessage('我',message,color,1);
            }
        });
    },
    showMessage:function(user,msg,color,me){
        var historyMsg=document.getElementById("historyMsg");
        var onemessage=document.createElement("p");
        var time=new Date();
        onemessage.style.color=color||"#000";
        if(me===1){
            onemessage.innerHTML=this.showEmoji(msg)+"<span class='timespan'> "+user+"</span>"+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
            onemessage.className="me";
        }else{
            onemessage.innerHTML=time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()+"<span class='timespan'> "+user+"说 </span>"+this.showEmoji(msg);
        }
        historyMsg.appendChild(onemessage);
        historyMsg.scrollTop=historyMsg.scrollHeight;
    },
    initEmoji:function(){
        var emojiWrapper=document.getElementById('emojiWrapper');
        var emojiFra=document.createDocumentFragment();

        for(var i=69;i>0;i--){
            var oneEmoji=document.createElement('img');
            oneEmoji.src='../emoji/'+i+'.gif';
            oneEmoji.title=i;
            emojiFra.appendChild(oneEmoji);
        }
        emojiWrapper.appendChild(emojiFra);
    },

    //用正则匹配替换表情
    showEmoji:function(message){
        var match,result=message;
        var reg=/\[emoji:\d+\]/g;
        var emojiIndex;
        var count=document.getElementById('emojiWrapper').children.length;

        console.log(message);
        while(match=reg.exec(message)){
            emojiIndex=match[0].slice(7,-1);
            if(emojiIndex>count){
                result=result.replace(match[0],'[X]');
            }
            else{
                result=result.replace(match[0],'<img class="emoji" src="/emoji/'+emojiIndex+'.gif"/>');
            }
        }
        return result;
    }
};
