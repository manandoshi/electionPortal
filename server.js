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
var statusArray = Array.apply(null, Array(24)).map(Number.prototype.valueOf,0);
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
	var team_id = req.body.team_id;
	var value = Number(req.body.value);
	console.log("Value:", value);
	var minum = req.body.mi_number;
	var ph = req.body.phone;
	var name = req.body.name;

	var currVotes = 0;
	connection.query("SELECT * from teams where id = "+team_id, function(err,rows,fields){
		if (rows.length == 1){
			console.log("Rows: ", rows);
			currVotes = Number(rows[0]["vote_count"]);
		}
		else{
			console.log("HUGE ASS ERROR");
		}
	var newVote = currVotes + value;
	
	//if valid user
		connection.query("UPDATE teams SET vote_count=" + newVote + " WHERE id = " + team_id,function(err,rows,fields){
			console.log(err);
		});
	// if valid user
	/*UPDATE USER DB
		connection.query("SELECT * from voters WHERE id = " + minum, function(err,rows,fields){
			if(rows.length == 0){
				connection.query("INSERT INTO voters VALUES(?,?,?,?)",[minum,name,status,ph],function(err,rows,fields){
					console.log(err);
				});
			}
		});*/
	});

});
app.get('/listActive', function(req,res){
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
app.get('/statusData',function(req,res){
	/*connection.query("SELECT status from teams" ,function(err, rows, fields){
		console.log(err);
		var statusData = null;
		if(rows.length != 0){
			statusData = rows;
			for (var i = statusData.length - 1; i >= 0; i--) {
				statusArray[statusData[i]["status"]] += 1;
			};
			res.json(statusData);
		}
		else{
			statusData = 'No teams Found..';
			res.json(statusData);
		}
	});*/
	res.json(statusArray);
});
app.post('/teamdata',function(req,res){
	//console.log(req.session.code);
	if(req.cookies["code"]==allowedID){	
		console.log("ALLOWED");
		var name = req.body.name_of_team;
		var miNumber = req.body.mi_number;
		var logoID = req.body.logoID;
		var status = req.body.status;
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
					statusArray[status]++;
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

app.post('/teamdata',function(req,res){
	//console.log(req.session.code);
	if(req.cookies["code"]==allowedID){	
		console.log("ALLOWED");
		var name = req.body.name_of_team;
		var miNumber = req.body.mi_number;
		var logoID = req.body.logoID;
		var status = req.body.status;
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
					statusArray[status]++;
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

app.post('/deleteTeam',function(req,res){
	//console.log(req.session.code);
	if(req.cookies["code"]==allowedID){	
		console.log("ALLOWED");
		var id = req.body.team_id;
		
		if(!!team_id){
			connection.query("DELETE FROM teams where id = " + id,[name,miNumber,logoID,status,0],function(err, rows, fields){
				if(!!err){
					data["Teams"] = "Error deleting team";
					console.log(err);
				}else{
					statusArray[status]++;
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
		console.log(sessionID);
		console.log("code: ", req.cookies["code"]);
	}
	res.json(data);

});

app.post('/deleteTeam',function(req,res){
	//console.log(req.session.code);
	if(req.cookies["code"]==allowedID){	
		console.log("ALLOWED");
		var id = req.body.team_id;
		var name = req.body.name_of_team;
		var miNumber = req.body.mi_number;
		var logoID = req.body.logoID;
		var status = req.body.status;
		var vote = req.body.vote;
		
		if(!!id && !!name && !!miNumber && !!logoID && !!status){
			connection.query("UPDATE teams SET name ="+name+", mi_number="+miNumber+", logoID="+logoID+", status="+status+", vote_count="+vote+" WHERE id = " + id,function(err, rows, fields){
				if(!!err){
					data["Teams"] = "Error updating team";
					console.log(err);
				}else{
					statusArray[status]++;
					data["error"] = 0;
					data["Teams"] = "Team Updated Successfully";
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
http.listen(12345,function(){
	console.log("Connected & Listen to port 12345");
});
