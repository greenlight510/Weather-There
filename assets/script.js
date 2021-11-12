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

  // Show spinner
  $("#update-forcast").removeClass("hide");

  currentWeather(localStorage.getItem("last_searched"));
}

//Event for open weather api call
$(".search").on("click", function () {
  var city = $(this).siblings(".form-control").val();

  $(this).siblings(".form-control").val("");

  currentWeather(city);
});

// Recent cities listener to make open weather call
$("#recent-cities-btns").on("click", function () {
  var city = event.target.id;

  localStorage.setItem("last_searched", city);

  displayCurrnet(city);

  // Function call display5Day
  display5Day(city);

  updateForecast();
});

function currentWeather(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial" +
    "&appid=" +
    key;

  $.ajax({
    async: true,
    crossDomain: true,
    url: queryURL,
    method: "GET",
  })
  .then(function (response) {
    localStorage.setItem("last_searched", response.name);

    oneCall(response);
  });
}
// Function oneCall
function oneCall(r) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/onecall?" +
    "&appid=" +
    key +
    "&lat=" +
    r.coord.lat +
    "&lon=" +
    r.coord.lon +
    "&units=imperial&exclude=hourly,minutely";

    $.ajax({
        async: true,
        crossDomain: true,
        url: queryURL,
        method: "GET",
      })
      .then(function (response) {
        r = Object.assign({ name: r.name }, response);
        localStorage.setItem(r.name, JSON.stringify(r));
        recentCities();
    
        displayCurrnet(r.name);
        display5Day(r.name);
        $("#update-forcast").addClass("hide");
    
        timeStamp = moment.unix(r.current.dt).tz(r.timezone).format("h:mm a");
    
        $("#updated-forecast-timestamp").text(
          "Last updated - " + timeStamp + " - " + r.timezone
        );
    
        // show updated-forecast-timestamp
        $("#updated-forecast-timestamp").removeClass("hide");
      });
    }
