var submitreg =function() {
  var name=$('#name_of_team').val();
  var logo=$('#logoID').val();
  var MInum=$('#mi_number').val();
  var data = {name_of_team : name, 2 : logo, mi_number : MInum};
  $.post( '/teamdata', data, function(recv) {
         if(recv[error] == 0)
         {
            alert("Team Added Successfully");
            $('#name_of_team').val("");
            $('#logoID').val("");
            $('#mi_number').val("");
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
         alert("yay");
       },
       'json' // I expect a JSON response
    );

}
  
