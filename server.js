var express=require('express'),
	app=express(),
	mongoose=require('mongoose'),
	http=require('http').Server(app),
	io=require('socket.io').listen(http),
	User=require('./model/User'),
	bodyParser=require('body-parser'),
	jwt=require('jsonwebtoken'),
	config=require('./config'),
	morgan=require('morgan'),
	authenticate=require('./authenticate.js'),
	socketauth = require('socketio-auth')(io,{
		authenticate:function(socket,data,callback){
			console.log('authenicating user ');
			var token = data.token;
			if(token!== null){
			jwt.verify(token,app.get('superSecret'),function(err,decoded){
				if(err){
					return callback(new Error('Invalid Token'));
				}else{
					socket.client.user = decoded;
					console.log('user authenticated to socket.io '+ decoded.name);
					return callback(null,true);
				}
			});
			
			}else{
				return callback(new Error('Token not found'));
			}
		},
		timeout:10000	
	});

app.set('superSecret',config.secret);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}) );
app.use(morgan('dev'));

//check token middleware
app.use(function(req,res,next){
	console.log('api path ' + req.path);
	if(req.path === '/' || req.path === '/auth' || req.path === '/home' || req.path === '/users/create' )
	{
		next();
	}else
	{
		var token = req.headers['token'] || req.body.token || req.query.token;

		if(token){
			jwt.verify(token,app.get('superSecret'),function(err,decoded){
				if(err){
					res.json({error:true,message:"Invalid Token"});
				}else{
					req.decoded = decoded;
					next();
				}
			});
			
		}else{
			res.json({error:true,message:"Token not found!"});
		}
	}
});
//connect to database
mongoose.connect('mongodb://localhost:27017/node-chat-app');



app.get('/users/create',function(req,res){
	//Sample users for login testing
	var user = new User();
	user.name = 'John';
	user.password = 'secret';
	user.email='johndoe@gmail.com';

	user.save(function(err){
	 if(err!=null) throw err;
	});


	var jane = new User();
	jane.name = 'Jane';
	jane.password='secret';
	jane.email='janedoe@gmail.com';

	jane.save(function(err){
		if(err!=null) throw err;
	});
});


app.get('/',function(req,res){
	res.sendFile(__dirname+'/login.html');
});

app.get('/home',function(req,res){
	res.sendFile(__dirname+'/index.html');
});

app.post('/auth',function(req,res){
	var email = req.body.email;
	var password =req.body.password;

	authenticate(email,password,function(data){
		var user = data;
		var token = jwt.sign(user,app.get('superSecret'),{
			expiresIn:86440
		});
		res.json({error:false,token:token});
	});
});

io.on('connection',function(socket){
	socket.on('chat message',function(msg){
		console.log('new message :'+msg);
		io.emit('chat message',socket.client.user.name +" :"+ msg);
	});
});


http.listen(3000);
