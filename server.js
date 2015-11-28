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
var status = 1;  //CURRENT STATUS
app.use(cookieParser());

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

//console.log(statusArray.length);
for (var i = statusArray.length - 1; i >= 0; i--) {
	updateArrray(i);
};

function updateArrray(i){
	connection.query("SELECT * FROM teams WHERE status="+i+" ORDER BY vote_count DESC",function(err, rows, fields){
		if(rows.length != 0){
			statusArray[i]+=rows.length;
		}
	});
}


var allowedID=makeid();
//console.log("stuff done");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/team',function(req,res){
	var data = {
		"error":1,
		"Teams":"",
		"slots":statusArray.length,
		"currSlot": status
	};
	if(req.cookies["code"]==allowedID){		
		connection.query("SELECT * from teams ORDER BY status",function(err, rows, fields){
			//console.log(err);
			if(rows.length != 0){
				data["error"] = 0;
				data["Teams"] = rows;
				res.json(data);
				//console.log(data);
			}else{
				data["Teams"] = 'No teams Found..';
				res.json(data);
			}
		});
	}
	else{
		data["Teams"]="Invalid Credentials";
		data["error"]=-1;
		res.json(data);
	}
});
app.get('/leaderboard',function(req,res){
	var data = {
		"error":1,
		"Teams":""
	};
	if(req.cookies["code"]==allowedID){	
		connection.query("SELECT * from teams ORDER BY vote_count DESC",function(err, rows, fields){
			//console.log(err);
			if(rows.length != 0){
				data["error"] = 0;
				data["Teams"] = rows;
				res.json(data);
				//console.log(data);
			}else{
				data["Teams"] = 'No teams Found..';
				res.json(data);
			}
		});
	}
	else{
		data["Teams"]="Invalid Credentials";
		data["error"]=-1;
		res.json(data);
	}
});
app.get('/currleaderboard',function(req,res){
	var data = {
		"error":1,
		"Teams":""
	};
	if(req.cookies["code"]==allowedID){	
		connection.query("SELECT * FROM teams WHERE status="+status+" ORDER BY vote_count DESC",function(err, rows, fields){
			//console.log(err);
			if(rows.length != 0){
				data["error"] = 0;
				data["Teams"] = rows;
				res.json(data);
				//console.log(data);
			}else{
				data["Teams"] = 'No teams Found..';
				res.json(data);
			}
		});
	}
	else{
		data["Teams"]="Invalid Credentials";
		data["error"]=-1;
		res.json(data);
	}
});
app.post('/vote', function(req,res){
	var team_id = req.body.team_id;
	var value = Number(req.body.value);
	//console.log("Value:", value);
	var minum = req.body.mi_number;
	var ph = req.body.phone;
	var name = req.body.name;
	//console.log("Name:" + name);
	var currVotes = 0;
	connection.query("SELECT * from teams where id = "+team_id, function(err,rows,fields){
		//console.log("VOTE(select): "+ err);
		if (rows.length == 1){
			//console.log("Rows: ", rows);
			currVotes = Number(rows[0]["vote_count"]);
			//console.log("currVotes: "+currVotes);
		}
		else{
			//console.log("HUGE ASS ERROR");
		}
	var newVote = currVotes + value;
	
	//if valid user
		connection.query("UPDATE teams SET vote_count=" + newVote + " WHERE id = " + team_id,function(err,rows,fields){
			//console.log("VOTE(update): "+ err);
		});
	// if valid user
	//UPDATE USER DB
		connection.query("SELECT * FROM voters WHERE id='" + minum+"'", function(err,rows,fields){
			//console.log(err);
			if(rows.length == 0){
				connection.query("INSERT INTO voters VALUES(?,?,?,?)",[minum,name,status,ph],function(err,rows,fields){
					//console.log(err);
				});
			}
		});
	});

});
app.get('/listActive', function(req,res){
	var data = {
		"teams":"",
		"error":1
	}
	//if(req.cookies["code"]==allowedID){	
		connection.query("SELECT * from teams WHERE status = "+status,function(err, rows, fields){
			//console.log(err);
			if(rows.length != 0){
				data["teams"] = rows;
				//console.log("");
				////console.log(data["teams"][1]["name_of_team"]);
				res.json(data);
			}else{
				data["teams"] = 'No teams Found..';
				res.json(data);
			}
		});
	//}
	//else{
	//	data["teams"]="Invalid Credentials";
	//	data["error"]=-1;
	//	res.json(data);
	//}
});
app.get('/statusData',function(req,res){
		res.json(statusArray);
});
app.post('/teamdata',function(req,res){
	////console.log(req.session.code);
	var data = {
			"error":1,
			"Teams":""
		};
	if(req.cookies["code"]==allowedID){	
		//console.log("ALLOWED");
		var name = req.body.name_of_team;
		var miNumber = req.body.mi_number;
		var logoID = req.body.logoID;
		var status = req.body.status;
		if(!!name && !!miNumber && !!logoID){
			connection.query("INSERT INTO teams VALUES('',?,?,?,?,?,'')",[name,miNumber,logoID,status,0],function(err, rows, fields){
				if(!!err){
					data["Teams"] = "Error Adding team";
					//console.log(err);
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
		//console.log(data);
	}
	else{
		//console.log("Invalid credentials");
		data["Teams"]="Invalid Credentials";
		data["error"]=-1;
		res.json(data);
	}
});

app.post('/teamdata',function(req,res){
	var data = {
			"error":1,
			"Teams":""
		};
	if(req.cookies["code"]==allowedID){	
		var name = req.body.name_of_team;
		var miNumber = req.body.mi_number;
		var logoID = req.body.logoID;
		var status = req.body.status;
		if(!!name && !!miNumber && !!logoID){
			connection.query("INSERT INTO teams VALUES('',?,?,?,?,?,'')",[name,miNumber,logoID,status,0],function(err, rows, fields){
				if(!!err){
					data["Teams"] = "Error Adding team";
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
		//console.log(data);
	}
	else{
		//console.log("Invalid credentials");
		data["Teams"]="Invalid Credentials";
		data["error"]=-1;
		res.json(data);
	}
});

app.post('/deleteTeam',function(req,res){
	var data = {
		"error":1,
		"Teams":""
	};
	if(req.cookies["code"]==allowedID){		
		var id = req.body.team_id;
		connection.query("SELECT * FROM teams where id="+id, function(err, rows, fields){
			statusArray[Number(rows[0]["status"])]--;
				connection.query("DELETE FROM teams where id = " + id,function(err, rows, fields){
					if(!!err){
						data["Teams"] = "Error deleting team";
						//console.log(err);
					}else{
						data["error"] = 0;
						data["Teams"] = "Team Deleted Successfully";
					}
					res.json(data);
				});
			//console.log(data);
		});
	}
	else{

		//console.log("Invalid credentials");
		data["Teams"]="Invalid Credentials";
		data["error"]=-1;
		res.json(data);
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
		//console.log(sessionID);
		//console.log("code: ", req.cookies["code"]);
	}
	res.json(data);

});

app.post('/updateTeam',function(req,res){
	////console.log(req.session.code);
	var data = {
		"error":1,
		"Teams":""
	};
	if(req.cookies["code"]==allowedID){	
		//console.log("ALLOWED");
		var id = req.body.team_id;
		connection.query("SELECT * FROM teams where id="+id, function(err, rows, fields){
			statusArray[Number(rows[0]["status"])]--;
		});
		var name = req.body.name_of_team;
		var miNumber = req.body.mi_number;
		var logoID = req.body.logoID;
		var status = req.body.status;
		var vote = req.body.vote_count;
		console.log(req.body);
		if(!!id && !!name && !!miNumber && !!logoID && !!status){
			connection.query("UPDATE teams SET name_of_team ='"+name+"', mi_number='"+miNumber+"', logoID="+logoID+", status="+status+", vote_count="+vote+" WHERE id = " + id,function(err, rows, fields){
				if(!!err){
					data["Teams"] = "Error updating team";
					console.log("Error updating team: " + err);
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
		//console.log(data);
	}
	else{
		//console.log("Invalid credentials");
		data["Teams"]="Invalid Credentials";
		data["error"]=-1;
		res.json(data);
	}
});

app.post('/setStatus',function(req,res){
	var new_status = req.body.status;
	status = new_status;
});

app.use('/', express.static(__dirname));

http.listen(12346,function(){
	//console.log("Connected & Listen to port 12345");
});
