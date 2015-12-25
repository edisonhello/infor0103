'use strict'

var path = require('path');
var io = require('socket.io');
var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var bodyParser = require('body-parser');


var app=express();
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
            res.sendFile(__dirname+'/login_pass.html',function(){res.end();})
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

app.listen(3000);
io.listen(server);