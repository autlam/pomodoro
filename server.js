
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var tasks = [];
var links = [];

app.use(express.static('public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "main.html" );
})

app.get('/list', function (req, res) {
	
	data = {
		t: tasks,
		l: links
	};
	  
	res.end(JSON.stringify(data));
})

app.get('/exist', function (req, res) {

	var i;
	var found = false;
	
	for (i = 0; i < tasks.length; i++) { 
		if(tasks[i].key === req.query.key) {
			found = true;
			break;
		}
	}	
	
	res.end(JSON.stringify({ exist: found }));
})

app.get('/first', function (req, res) {
		
	var i;
	var found = false;
	
	for (i = 0; i < tasks.length; i++) { 
		if(tasks[i].completed === false) {
			found = true;
			break;
		}
	}	
	
	if(found) {
		res.end(JSON.stringify(tasks[i]));	
	} else {
		res.end();
	}	
})

app.post('/task', function (req, res) {
	
	var des = req.body.key + " : ";
	var totalTime = parseInt(req.body.time); 
	des = des + totalTime + " second(s)";
	
	var task = {
		key: req.body.key,
		time: totalTime,
		description: des,
		completed: false,		
		color: "white"
	}
	
	if (tasks.length == 0) {
		tasks.push(task);
	} else {
		var pos = tasks.length - 1;
		tasks.push(task);
		links.push({
			from: tasks[pos].key,
			to: tasks[pos + 1].key
		});		
	}
	
	res.end();
})


app.post('/complete', function (req, res) {
	
	var i;
	
	for (i = 0; i < tasks.length; i++) { 
		if(tasks[i].completed === false) {
			tasks[i].time = 0;
			tasks[i].color = "green";
			tasks[i].completed = true;
			break;
		}
	}	
	
	res.end();		
})
	
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})
