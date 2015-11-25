var express=require('express');
var app = express();
//var session = require("express-session");
var cookieParser = require('cookie-parser');
var http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require("body-parser");
var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'Qwerty@314',
		database : 'mi2k15',
	});
//app.use(session({secret:'ads'}));
var status = 3;
app.use(cookieParser());
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
var allowedID=makeid();
console.log("stuff done");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/*app.get('/',function(req,res){
	var data = {
		"Data":""
	};
	data["Data"] = "<b>wow</b>";
	res.json(data);
	console.log("GR1");
});
*/
app.get('/team',function(req,res){
	var data = {
		"error":1,
		"Teams":""
	};
	
	console.log("GR2");
	connection.query("SELECT * from teams",function(err, rows, fields){
		console.log(err);
		if(rows.length != 0){
			data["error"] = 0;
			data["Teams"] = rows;
			res.json(data);
			console.log(data);
		}else{
			data["Teams"] = 'No teams Found..';
			res.json(data);
		}
	});
});
app.post('/vote', function(req,res){

});
app.get('/list', function(req,res){
	var teamList = {
		"teams":""
	}
	connection.query("SELECT * from teams WHERE status = "+status,function(err, rows, fields){
		console.log(err);
		if(rows.length != 0){
			teamList["teams"] = rows;
			console.log(teamList["teams"][1]["name_of_team"]);
			res.json(teamList);
		}else{
			teamList["teams"] = 'No teams Found..';
			res.json(teamList);
		}
	});
});

app.post('/teamdata',function(req,res){
	//console.log(req.session.code);
	if(req.cookies["code"]==allowedID){	
		console.log("ALLOWED");
		var name = req.body.name_of_team;
		var miNumber = req.body.mi_number;
		var logoID = req.body.logoID;
		var data = {
			"error":1,
			"Teams":""
		};
		if(!!name && !!miNumber && !!logoID){
			connection.query("INSERT INTO teams VALUES('',?,?,?,?,?,'')",[name,miNumber,logoID,status,0],function(err, rows, fields){
				if(!!err){
					data["Teams"] = "Error Adding team";
					console.log(err);
				}else{
					data["error"] = 0;
					data["Teams"] = "Team Added Successfully";
				}
				res.json(data);
			});
		}else{
			data["Teams"] = "Please provide all required data";
			res.json(data);
		}
		console.log(data);
	}
	else{
		console.log("Invalid credentials");
	}
});

app.post('/login', function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	var data = {
			"error":1
		};
	if(username=="admin" && password=="hunter2"){
		data["error"]=0;
		var sessionID = makeid();
		allowedID = sessionID;
		var cookCode = {"sessionID": sessionID}; 
		res.cookie("code", sessionID);
//		req.session.code = sessionID;
		console.log(sessionID);
		console.log("code: ", req.cookies["code"]);
		//res.redirect(303, "/register.html");
	}
	res.json(data);

});
app.use('/', express.static(__dirname));
/*app.put('/team',function(req,res){
	var Id = req.body.id;
	var Teamname = req.body.teamname;
	var Authorname = req.body.authorname;
	var Price = req.body.price;
	var data = {
		"error":1,
		"Teams":""
	};
	if(!!Id && !!Teamname && !!Authorname && !!Price){
		connection.query("UPDATE team SET TeamName=?, AuthorName=?, Price=? WHERE id=?",[Teamname,Authorname,Price,Id],function(err, rows, fields){
			if(!!err){
				data["Teams"] = "Error Updating data";
			}else{
				data["error"] = 0;
				data["Teams"] = "Updated Team Successfully";
			}
			res.json(data);
		});
	}else{
		data["Teams"] = "Please provide all required data (i.e : id, Teamname, Authorname, Price)";
		res.json(data);
	}
});

app.delete('/team',function(req,res){
	var Id = req.body.id;
	var data = {
		"error":1,
		"Teams":""
	};
	if(!!Id){
		connection.query("DELETE FROM team WHERE id=?",[Id],function(err, rows, fields){
			if(!!err){
				data["Teams"] = "Error deleting data";
			}else{
				data["error"] = 0;
				data["Teams"] = "Delete Team Successfully";
			}
			res.json(data);
		});
	}else{
		data["Teams"] = "Please provide all required data (i.e : id )";
		res.json(data);
	}
});
*/
http.listen(8888,function(){
	console.log("Connected & Listen to port 8888");
});
