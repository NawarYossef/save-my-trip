"use strict";
console.log(334);

$(() => {
  $.ajax({
    url: "http://localhost:8080/api/trips",
    type: 'GET',   
    success: function(data){
      console.log(data)
    }
  });
})