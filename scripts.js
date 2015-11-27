var logo = 0;
var pics = 6;
var slots = 0;

$(document).ready(function()
{
  $.ajax(
    {
      type: 'GET',
      url: '/statusData',
      success: function(data)
      {
        slots = data;
        for (var i = 0; i < slots.length; i++) 
        {
          appendstr = "<li>Slot " + i + "(" + slots[i] + ")</li>";
          $(".dropdown-menu").append(appendstr);
        };
        $("li").on("click", function()
        {
          $(".dropdown-toggle").html($(this).html());
        }
        );
      }
    }
  );
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
  var slot = Number($(".dropdown-toggle").html().charAt(5));
  var name=$('#name_of_team').val();
  var MInum=$('#mi_number').val();
  var data = {name_of_team : name, logoID : logo, mi_number : MInum, status: slot};
  $.post( '/teamdata', data, function(recv) {
         if(recv["error"] == 0)
         {
            alert("Team Added Successfully");
            window.location.replace("/register.html")
            //$('#name_of_team').val("");
            //$('#mi_number').val("");
            //logo = 0;
            //$(".dropdown-toggle").html("Select Slot");
         }

         else
         {
          alert("Error in adding team. Error: "+recv["Teams"]);
          if(recv["error"]==-1){
            window.location.replace("/login.html");
          }
         }
       },
       'json' // I expect a JSON response
       // And I'll give you one. 
    );
}

var login = function(){
  var user=$('#user').val();
  var pwd=$('#pwd').val();
  var data = {username:user, password: pwd};
  $.post( '/login', data, function(recv) {
        console.log("hidden shit");
        if (recv["error"]==0)
        {
          window.location.replace("/register.html");
        }
        else{
          alert("Incorrect username/Password");
        }
      },
       'json' // I expect a JSON response
    );
}

$(document).keypress(function(event)
{
  if(event.which == 13)
  {
    login();
  }
});

