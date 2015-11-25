var logo = 0;
var pics = 4;

$(document).ready(function()
{
  for (var i = 0; i < pics; i++) {
    (function(i)
    {
        $($(".regb").get(i)).on("click", function()
        {
          logo = i+1;
        })
    })(i);
  };
}); 

var submitreg =function() {
  var name=$('#name_of_team').val();
  var MInum=$('#mi_number').val();
  var data = {name_of_team : name, logoID : logo, mi_number : MInum};
  $.post( '/teamdata', data, function(recv) {
         if(recv["error"] == 0)
         {
            alert("Team Added Successfully");
            $('#name_of_team').val("");
            $('#mi_number').val("");
            logo = 0;
         }
       },
       'json' // I expect a JSON response
    );
}

var login = function(){
  var user=$('#user').val();
  var pwd=$('#pwd').val();
  var data = {username:user, password: pwd};
  $.post( '/login', data, function(recv) {
        console.log("hidden shit");
        window.location.replace("/register.html");
       },
       'json' // I expect a JSON response
    );
}