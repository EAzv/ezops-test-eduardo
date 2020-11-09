var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var Message = mongoose.model('Message', {
	name : String,
	message : String
});

var dbUrl = 'mongodb+srv://app-user-1:Wo02LGz2YM@cluster0.xikif.mongodb.net/simple-chat?retryWrites=true&w=majority';

app.get('/messages', (req, res)=>{
	Message.find({},(err, messages)=>{
		res.send(messages);
	});
});

app.post('/messages', (req, res)=>{
	var message = new Message(req.body);
	message.save((err)=>{
		if(err)
			res.sendStatus(500);
		io.emit('message', req.body);
		res.sendStatus(200);
	});
});

app.get('/messages/delete/:msg_id', (req, res)=>{
	Message.remove({_id: req.params.msg_id}, (err)=>{
		 if (err)
			throw err;
		res.sendStatus(200);
	});
});

io.on('connection', ()=>{
	console.log('a user is connected');
});

mongoose.connect(dbUrl , {useMongoClient: true}, (err)=>{
	console.log('mongodb connected', err);
});

const PORT = process.env.PORT || 3000;
var server = http.listen(PORT, ()=>{
	console.log('server is running on port', server.address().port);
});

