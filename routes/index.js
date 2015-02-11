module.exports = function Route(app, io){

	// we're only using ONE (1) http route
	app.get('/', function(req, res){
		res.render('index', {title: 'Pacman'});
	})
	all_users=[];
	// Start handling connections
	// 1) set up the connection event
	// 2) handle all events inside and respond with appropriate events
	io.sockets.on('connection', function (socket){
		socket.on('new_user', function (data){
			user = {name: data.name, id: socket.id};
			all_users.push({id: user.id, name: user.name});
			socket.emit('my_id', {name: user.name, id: user.id})
			for (x in all_users){
				socket.emit('player_names', {name: all_users[x].name,id: all_users[x].id});
			}
			socket.broadcast.emit('new_player', {name: user.name, id: user.id});
		})
		
		socket.on('pacman', function (data) {
			
			pacman = {x: data.x, y: data.y};
			socket.broadcast.emit('other_players', {x: pacman.x,y: pacman.y});
		})
		socket.on('score',function (data){
			scores = {id: data.id, name: data.name, score: data.score}
			socket.broadcast.emit('other_player_scores', {id: scores.id, name: scores.name, score: scores.score });
		})

		socket.on('new_message', function (data){
			chat = {name: data.name,message: data.message};
			io.emit('all_messages', {name: chat.name,message:chat.message});
			
		})
		socket.on('disconnect',function (data){
			socket.broadcast.emit('user_left', {id: socket.id});
			var index='';
			for(x in all_users){
				if(all_users[x].id == socket.id){
					index=x;
				}
			}
			all_users.splice(index, 1);
		})
})
}
