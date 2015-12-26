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

app.use('/static', express.static('static'));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/add.html',function(req,res){
    res.sendFile(__dirname+'/form.html',function(){res.end();})
});
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html',function(){res.end();})
});

app.get('/login.html',function(req,res){
  res.sendFile(__dirname+'/login.html',function(){res.end();})
});

//app.get('/login', function(){})
app.post('/reg',function(req,res){
  console.log("got post");
	if(req.body.pass!=req.body.pass2){
    console.log("pass q");
		res.sendFile(__dirname+'/form_pass.html',function(){res.end();})
  }
  else{
    if(req.body.birth==""){
      console.log("bir q");
      res.sendFile(__dirname+'/form_birth.html',function(){res.end();})
   }else{
     console.log("no f q");
     MongoClient.connect('mongodb://127.0.0.1:27017/users',function(err,db){
      console.log(req.body);
      db.collection('users').insertOne(req.body);
      console.log('no db q');
    });
     res.sendFile(__dirname+'/done.html',function(){res.end();})
   }
  }
});

app.post('/login',function(req,res){
  console.log('get login q');
  console.log(req.body.username);
  MongoClient.connect('mongodb://127.0.0.1:27017/users',function(err,db){
    console.log(db.collection('users').find({"username":req.body.username}).count(function(err,cnt){
      console.log(cnt);
      if(cnt==0){res.sendFile(__dirname+'/login_username.html',function(){res.end();})}
      else{
        db.collection('users').find({"pass":req.body.pass}).count(function(err,cnt2){
          if(cnt2==0){res.sendFile(__dirname+'/login_pass.html',function(){res.end();})}
          else if(cnt2==1){
            res.sendFile(__dirname+"/chatroom.html",function(){res.end();})
          }  
        });
      }
    }));
    console.log(db.collection('users').find().count());

  });
 // if(db.users.findOne(req.body.username))
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
    var time=Math.floor(new Date().getTime()/1000)
    console.log(text+" "+name+" "+time);
    io.emit("pubchat", text, name ,time);
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
});



app.get("/socket.io/socket.io.js",function(req,res){
  res.sendFile(__dirname+'/node_modules/socket.io-client/socket.io.js',function(){res.end();})
});

server.listen(3000);