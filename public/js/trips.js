"use strict";
console.log(334);


$(() => {
  $.ajax({
    url: "http://localhost:8081/trips",
    type: 'GET',   
    success: function(data){
      console.log(data)
    }
  });
})



