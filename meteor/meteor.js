message_collection = new Mongo.Collection('messages');

if (Meteor.isClient) {
  Template.body.events({
    "submit .message-form":function(event){
      var message=event.target.message.value;
console.log(message);
      message_collection.insert({"message":message});
      
      event.target.message.value="";
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
