A MEAN app that demonstrates Socke.io JWT authentication .
I couldn't find an example of how to configure jwt based auth for socket.io , so i experimented 
and made this app.

Hope it's helpful!

DISCLAIMER : This is a very basic app that was made for the sole purpose of demonstrating how jwt-auth
			 can be implemented with socket.io

steps :

1) npm install
2) change the secret in the config.js ( or not .. up to you !)
3) start the server with -> node server.js
4) go to localhost:3000/users/create on web page
5) go to localhost:3000/ and login with one of these users :
	username : johndoe@gmail.com
	password : secret

	username : janedoe@gmail.com
	password : secret
6) Chat ON!