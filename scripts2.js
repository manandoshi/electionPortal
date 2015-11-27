var teams = 0;
var value = 0;
var teamID = 0;

$(document).ready(function()
{
	$.ajax(
	{
		type: 'GET',
		url : "/listActive",
		success : function(data){
			teams = data;

			console.log(teams);
			
			for (var i = 0; i < 4; i++) {
				console.log("in for: ", $($('.team h3').get(i)).html())
				$($('.team h3').get(i)).html(teams["teams"][i]["name_of_team"]);
			};
			
			for (var i = 0; i < 4; i++) {
	    		(function(i)
	    		{
	        		$($(".btn-success").get(i)).on("click", function()
	        		{
			          teamID = teams["teams"][i]["id"];
			          value = 1;
	        		});
	        		
	        		$($(".btn-danger").get(i)).on("click", function()
	        		{
				        teamID = teams["teams"][i]["id"];
				        value = -1;
	        		})
	    		})(i);
  			};
  		},
	});
});



var voted = function()
{
	var MINum = $("#mi_number").val();
	var phone = $("#phone").val();
	var name = $("name").val();
	var data = {team_id : teamID, value : value, mi_number : MINum, phone : phone, name: name} 
	$.post( '/vote', data, function(recv) {
        console.log("hidden shit");
        },
       'json' // I expect a JSON response
    );
}