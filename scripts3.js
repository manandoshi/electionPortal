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
			if(data["error"]==-1){
				alert("Invalid Cedentials");
				window.location.replace("/login.html");
			}
			console.log(stuff);
			for (var i = 0; i < stuff.length; i++) {
				appendstr = "<tr>";
				appendstr += "<td class='teamname'>" + stuff[i]["name_of_team"] + "</td>";
				appendstr += "<td>" + stuff[i]["mi_number"] + "</td>";
				appendstr += "<td><img src='http://placehold.it/160x100'></td>";
				appendstr += "<td>" + stuff[i]["status"] + "</td>";
				appendstr += "</tr>";
				$("tbody").append(appendstr);
			};
		}
	}
	)
})