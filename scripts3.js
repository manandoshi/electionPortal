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
			for (var i = 0; i < stuff.length; i++) {
				appendstr = "<tr>";
				appendstr += "<td><img src='http://placehold.it/160x100'></td>";
				appendstr += "<td><span class='teamname'>" + stuff[i]["name_of_team"] + "</span></td>";
				appendstr += "<td>" + stuff[i]["mi_number"] + "</td>";				
				appendstr += "<td>" + stuff[i]["status"] + "</td>";
				appendstr += "<td>" + stuff[i]["vote_count"] + "</td>";
				appendstr += "</tr>";
				$("tbody").append(appendstr);
			};
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