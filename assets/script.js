var key = "63bf744b035f495cccad8662678a851d";

// Recent cities
recentCities();

// Hide spinner
$("#update-forcast").addClass("hide");

$("#updated-forecast-timestamp").addClass("hide");

if (localStorage.getItem("last_searched") == null) {
  // Hide weather display
  $("#weatherDisplay").addClass("hide align-middle");
  $("#recent-cities").addClass("hide");
} else {
  updateForecast();

  //Timeinterval for updated Forecast function
  var interval = setInterval(updateForecast, 600000);
}

function updateForecast() {
  $("#updated-forecast-timestamp").addClass("hide");

