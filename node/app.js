'use strict'

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app=express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/add.html',function(req,res){
    res.sendFile(__dirname+'/form.html',function(){res.end();})
});
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html',function(){res.end();})
});

app.post('/',function(req,res){
  console.log("got post");
	if(req.body.pass!=req.body.pass2){
    console.log("pass q");
		res.sendFile(__dirname+'/form_pass.html',function(){res.end();})
  }
  else{
    if(req.body.birth==""){
      console.log("bir q");
        res.sendFile(__dirname+'/form_birth.html')
        res.end();
       }else{
      console.log("no q");
      res.sendFile(__dirname+'/done.html')
      res.end();
       }
    }
});

app.get('/list',function(req,res){
//    res.sendFile(__dirname+'/list.html',function(){res.end();})
});

app.listen(3000);
