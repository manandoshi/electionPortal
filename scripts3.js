var stuff = 0;
var slots = 0;

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
				appendstr += "<td><span class='teamname'>" + stuff[i]["name_of_team"] + "</span></td>";
				appendstr += "<td>" + stuff[i]["mi_number"] + "</td>";				
				appendstr += "<td>" + stuff[i]["status"] + "</td>";
				appendstr += "<td>" + stuff[i]["vote_count"] + "</td>";
				appendstr += "<td><button class='btn btn-primary del' id='team" + stuff[i]["id"] + "'>Delete</button></td>"
				appendstr += "</tr>";
				$("tbody").append(appendstr);
			};

			$(".del").on("click", function()
			{
				var id = Number($(this).attr('id').charAt(4));
				var data = {team_id : id};
				$.post( '/deleteTeam', data, function(recv) 
				{
					if(data["error"]==0)
		            {
		            	window.location.replace("/admin.html");
		            }
		       	},
		       	'json'
    			);
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
            window.location.replace("/admin.html")
       	},
       'json' // I expect a JSON response
       // And I'll give you one. 
    );
}