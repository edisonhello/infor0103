'use strict'

var path = require('path');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');

var express = require('express')
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var http = require('http');

var users = [];
//var express = require('express');
//var app     = express();
//var server  = app.listen(3000);
//var io      = require('socket.io').listen(server);


//var server = app.listen(3000);
//var io = sio.listen(server);

app.use('/static', express.static(__dirname+'/static'));

app.use(bodyParser.urlencoded({extended: true}));

//MongoClient.createCollection('users');

app.get('/add.html',function(req,res){
    res.sendFile(__dirname+'/form.html',function(){res.end();})
});
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html',function(){res.end();})
});

app.get('/login.html',function(req,res){
  res.sendFile(__dirname+'/login.html',function(){res.end();})
});

app.get('/chat.html',function(req,res){
  res.sendFile(__dirname+'/chatroom.html',function(){res.end();})
})

app.post('/gochat',function(req,res){
  res.sendFile(__dirname+'/chatroom.html',function(){res.end();})
});

app.post('/message_input',function(req,res){
  console.log('get n m c:'+req.body.message);
});


io.sockets.on('connection', function(socket){
  var id=socket.id;
  socket.emit("who");

  socket.on('me', function(name){
    if(name=="null"){socket.emit("who");}
    console.log("id:"+id+"name:"+name);
    var userdata={"id":id , "name":name};
    users.push(userdata);
  });

  socket.on('sendchat', function(text,name){
    var now = new Date().getFullYear().toString()+"-"+new Date().getMonth().toString()+"-"+new Date().getDate().toString()+" ";
    if(new Date().getHours()<10){var nnow=now+"0"+new Date().getHours().toString()+":";}
      else{var nnow=now+new Date().getHours().toString()+":";}
    if(new Date().getMinutes()<10){var nnnow=nnow+"0"+new Date().getMinutes().toString()+":";}
      else{var nnnow=nnow+new Date().getMinutes().toString()+":";}
    if(new Date().getSeconds()<10){var nnnnow=nnnow+"0"+new Date().getSeconds().toString();}
      else{var nnnnow=nnnow+new Date().getSeconds().toString();}
    console.log(text+" "+name+" "+nnnnow);
    io.emit("pubchat", text, name ,nnnnow);
  });


  setInterval(function() {
    var now = new Date().getFullYear().toString()+"-"+new Date().getMonth().toString()+"-"+new Date().getDate().toString()+" ";
    if(new Date().getHours()<10){var nnow=now+"0"+new Date().getHours().toString()+":";}
      else{var nnow=now+new Date().getHours().toString()+":";}
    if(new Date().getMinutes()<10){var nnnow=nnow+"0"+new Date().getMinutes().toString()+":";}
      else{var nnnow=nnow+new Date().getMinutes().toString()+":";}
    if(new Date().getSeconds()<10){var nnnnow=nnnow+"0"+new Date().getSeconds().toString();}
      else{var nnnnow=nnnow+new Date().getSeconds().toString();}
    socket.emit('now', {'date':nnnnow});
  }, 1000);

  socket.on('regq',function(username,nickname,pass,pass2,email,birth){
    MongoClient.connect('mongodb://127.0.0.1:27017/users',function(err,db){
      console.log("come2");
      db.collection('users').find({"username":username}).count(function(err,cnt){
        if(cnt){io.emit('usernameq');}
        else{
          db.collection('users').find({"nickname":nickname}).count(function(err,cnt2){
            if(cnt2){io.emit('nickq');}
            else{
              console.log("come4");
              db.collection('users').insertOne({"username":username,"nickname":nickname,"pass":pass,"pass2":pass2,"email":email,"birth":birth});
              console.log(cnt)
              io.emit('jumpmain');
              console.log("come6")
            }
          });
        }
      });
    });
  });

  socket.on('loginq',function(username,pass){
    MongoClient.connect('mongodb://127.0.0.1:27017/users',function(err,db){
      db.collection('users').find({"username":username}).count(function(err,cnt){
        if(cnt==0){io.emit('nou');}
        else{
          db.collection('users').find({"username":username,"pass":pass}).count(function(err,cnt2){
            if(cnt==0){io.emit('psw');}
            else{
              io.emit("gochat");
            }
          })
        }
      });
    });
  });

  socket.on('userusername',function(username){
    MongoClient.connect('mongodb://127.0.0.1:27017/users',function(err,db){
      db.collection('users').find({"username":username}).count(function(err,cnt){
        if(cnt==0){io.emit('nou');}
        else{io.emit('inp');}
      });
    });
  });

  socket.on('userpass',function(username,pass){
    MongoClient.connect('mongodb://127.0.0.1:27017/users',function(err,db){
      db.collection('users').find({"username":username,"pass":pass}).count(function(err,cnt){
        if(cnt==0){io.emit('wp');}
        else{
          db.collection('users').findOne({"username":username,"pass":pass} , function(err,info){
//            console.log(info);
            io.emit('rp',info.nickname)
          })
        }
      });
    });
  });
});

server.listen(3000);