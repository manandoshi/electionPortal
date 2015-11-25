$(document).ready(function()
{
	$.ajax(
	{
		type: 'GET'
		url : "/listActive",
		method : "GET",
		success : function(data)
		{
			console.log(data);
		};
	});
});