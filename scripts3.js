var stuff = 0;
var slots = 0;
var curr = 0;

$(document).ready(function()
{
	$.ajax(
	{
		type: 'GET',
		url : "/team",
		success : function(data)
		{
			stuff = data["Teams"];
			slots = data["slots"];
			curr = data["currSlot"];
			if(data["error"]==-1){
				alert("Invalid Cedentials");
				window.location.replace("/login.html");
			}
			$(".ehh").html(curr);
			for (var i = 0; i < slots; i++) {
				$(".current").append("<li>"+i+"</li>")
			};

			$("li").on("click", function()
			{
				$(".ehh").html($(this).html());
			});

			for (var i = 0; i < stuff.length; i++) {
				appendstr = "<tr>";
				appendstr += "<td><img src='http://placehold.it/160x100'></td>";
				appendstr += "<td><span class='teamname' data-id="+i+">" + stuff[i]["name_of_team"] + "</span></td>";
				appendstr += "<td>" + stuff[i]["mi_number"] + "</td>";				
				appendstr += "<td>" + stuff[i]["status"] + "</td>";
				appendstr += "<td>" + stuff[i]["vote_count"] + "</td>";
				appendstr += "<td><button class='btn btn-primary del' id='team" + stuff[i]["id"] + "'>Delete</button></td>"
				appendstr += "</tr>";
				$("tbody").append(appendstr);
			};
			$(".teamname").on("click", function(){
				var i = $(this).attr('data-id');

				var id 				=	stuff[i]["id"];
				var logoID			=	stuff[i]["logoID"]
				var name_of_team 	= 	stuff[i]["name_of_team"];
				var mi_number		=	stuff[i]["mi_number"];
				var status 			= 	stuff[i]["status"];
				var vote_count 		= 	stuff[i]["vote_count"];

				$(this).parent().prev().html("<input type=\"text\" class=\"form-control\" id=\"newlogoID\" value="+logoID+">");
				$(this).parent().next().html("<input type=\"text\" class=\"form-control\" id=\"newmi_number\" value="+mi_number+">");
				$(this).parent().next().next().html("<input type=\"text\" class=\"form-control\" id=\"newstatus\" value="+status+">");
				$(this).parent().next().next().next().html("<input type=\"text\" class=\"form-control\" id=\"newvote_count\" value="+vote_count+">");
				$(this).parent().html("<input type=\"text\" class=\"form-control\" id=\"newname_of_team\" pid="+id+" value="+name_of_team+">");
				$('#team'+id).html("Update");
				$('#team'+id).addClass("upd");
				$('#team'+id).addClass("btn-secondary");
				$('#team'+id).removeClass("btn-primary");
				//$('#team'+id).removeClass("del");
				//$('#team'+id).attr('class',"btn btn-secondary upd");


			})
			
			//WHY DOES THIS NOT WORK? WTF

			/*$(".upd").on("click", function()
			{
				var idstr = $(this).attr('id');
				console.log("upd");
				var id = Number(idstr.slice(4,idstr.lenth));
				var data = {team_id : id};
				/*$.post( '/deleteTeam', data, function(recv) 
				{
					if(recv["error"]==0)
		            {
		            	window.location.replace("/admin.html");
		            }
		       	},
		       	'json'
    			);
			});*/

			$(".del").on("click", function()
			{
				if($(this).html()=="Delete"){
					var idstr = $(this).attr('id');
					console.log("del");
					var id = Number(idstr.slice(4,idstr.lenth));
					var data = {team_id : id};
					$.post( '/deleteTeam', data, function(recv) 
					{
						if(recv["error"]==0)
			            {
			            	window.location.replace("/admin.html");
			            }
			       	},
			       	'json'
	    			);
	    		}
	    		else{
	    			var newlogoID	 	= 	$("#newlogoID").val();
	    			var newid 			= 	$("#newname_of_team").attr("pid");
	    			var newname_of_team = 	$("#newname_of_team").val();
	    			var newmi_number 	= 	$("#newmi_number").val();
	    			var newstatus 		= 	Number($("newstatus").attr("value"));
	    			var newvote_count 	= 	Number($("newvote_count").attr("value"));
	    			//console.log($("#newstatus"));
	    			var data = {
	    				"team_id" 		: 	newid,
	    				"name_of_team" 	: 	newname_of_team,
	    				"mi_number"		: 	newmi_number,
	    				"logoID"		: 	newlogoID,
	    				"status" 		: 	newstatus,
	    				"vote_count" 	: 	newvote_count
	    			}
	    			console.log(data);

	    			$.post( '/updateTeam', data, function(recv) 
					{
						if(recv["error"]==0)
			            {
			            	window.location.replace("/admin.html");
			            }
			            else{
			            	alert("ERROR: "+ recv["Teams"]);
			            }
			       	},
			       	'json'
	    			);


	    		}
			});

			$(".add").on("click", function()
			{
				window.location.replace("/register.html")
			})
		}
	}
	)
})

var sendslot = function()
{
	var currslot = Number($(".dropdown-toggle").html());
	var data = {status : currslot};
	$.post( '/setStatus', data, function(recv) 
		{
			alert("Slot Succesfully changed");
            window.location.replace("/admin.html");
       	},
       'json' // I expect a JSON response
       // And I'll give you one. 
    );
}