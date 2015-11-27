var stuff = 0;

$(document).ready(function()
{
	$.ajax(
	{
		type: 'GET',
		url : "/team",
		success : function(data)
		{
			stuff = data["Teams"];
			console.log(stuff);
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