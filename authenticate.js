var mongoose=require('mongoose');
var User=require('./model/User');
module.exports = function(email,password,callback){

	User.where({email:email}).findOne(function(err,user){
		if(err) throw err;
		console.log('checking if user with email ' + email +' exists');
		if(user!=null){
			console.log('User Found! : ' + user.name);
			if(user.password === password){
				callback(user);
			}else{
				callback({error:true,message:"invalid user/pass"});
			}
		}else{
			console.log('user not found');
			callback({error:true,message:"User not found!"});
		}
	});
};