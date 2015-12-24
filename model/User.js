var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UserSchema= new Schema({
	name: String,
	email: {type: String,unique: true,required: true ,dropDups: true},
	password: String
});

module.exports = mongoose.model('User',UserSchema);
