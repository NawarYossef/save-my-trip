"use strict";


$(() => {
  $( "#datepicker-1" ).datepicker();
  $( "#datepicker-2" ).datepicker();

  $("#new-trip-form").submit((e) => {
    e.preventDefault()
    console.log(34)
    $.ajax({
    url: "http://localhost:8080/api/trips",
    type: 'POST',   
    success: function(data){
      console.log(data)
    }
  });
  })
})

//content type json
// data