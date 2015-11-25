var submit =function() {
  var name=$('#name_of_team').val();
  var logo=$('#logoID').val();
  var MInum=$('#mi_number').val();
  var data = {name_of_team : name, logoID : logo, mi_number : MInum}
  $.post( '/teamdata', data, function(recv) {
         console.log(recv);
       },
       'json' // I expect a JSON response
    );
}
  
