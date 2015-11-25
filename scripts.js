var submit =function() {
  var name=$('#name_of_team').val();
  var logo=$('#logoID').val();
  var MInum=$('#mi_number').val();
  var data = {name_of_team : name, logoID : logo, mi_number : MInum}
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
  
