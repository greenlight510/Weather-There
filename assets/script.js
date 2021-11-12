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
    // Function 5Day displays
    function display5Day(r) {
        var forecastConditions = JSON.parse(localStorage.getItem(r));
        $("#forcast-5day-container").empty();
      
        for (i = 0; i < 6; i++) {
          // 5-day forecast display
          var card5dFrcstSize = $("<div>");
          var card5dFrcst = $("<div>");
          var card5dFrcstHdr = $("<div>");
          var card5dFrcstBdy = $("<div>");
          var card5dFrcstIcn = $("<div>");
          var card5dIcnDiv = $("<div>");
          var card5dFrcstTmp = $("<div>");
          var card5dFrcstRH = $("<div>");
      
          if (i == 0) {
            $(card5dFrcstSize).addClass("hide");
          }
      
          $(card5dFrcstSize).addClass("col-lg-2 col-md-4 col-sm-3 mb-4 card5day");
          $(card5dFrcstSize).attr("id", "day" + "-" + i);
          $("#forcast-5day-container").append(card5dFrcstSize);
          $(card5dFrcst).addClass("card text-white bg-info");
          $(card5dFrcst).attr("id", "card5dFrcst" + "-" + i);
          $(card5dFrcstSize).append(card5dFrcst);
          $(card5dFrcstHdr).addClass("card-header card5day-header");
          $(card5dFrcstHdr).attr("id", "card5dFrcstHdr" + "-" + i);
      
          date = moment
            .unix(forecastConditions.daily[i].dt)
            .tz(forecastConditions.timezone)
            .format("MM/DD");
      
          $(card5dFrcstHdr).text(date);
          $(card5dFrcst).append(card5dFrcstHdr);
          $(card5dFrcstBdy).addClass("card-body single-day-body");
          $(card5dFrcstBdy).attr("id", "card5dFrcstBdy" + "-" + i);
          $(card5dFrcst).append(card5dFrcstBdy);
          $(card5dFrcstIcn).addClass("row my-row");
          $(card5dFrcstIcn).attr("id", "card5dFrcstIcn" + "-" + i);
          $(card5dFrcstBdy).append(card5dFrcstIcn);
          $(card5dIcnDiv).addClass("col-12 my-col justify-content-center");
          $(card5dIcnDiv).attr("id", "card5dIcnDiv" + "-" + i);
      
          var imgURL =
            "https://openweathermap.org/img/wn/" +
            forecastConditions.daily[i].weather[0].icon +
            ".png";
      
          $(card5dIcnDiv).append("<img src =" + imgURL + ">");
          $(card5dFrcstIcn).append(card5dIcnDiv);
          $(card5dFrcstTmp).addClass("row my-row");
          $(card5dFrcstTmp).attr("id", "card5dFrcstTmp" + "-" + i);
      
          var Temp = forecastConditions.daily[i].temp.day.toFixed(0);
          $(card5dFrcstTmp).text("Temp: " + Temp + String.fromCharCode(176) + "F");
          $(card5dFrcstBdy).append(card5dFrcstTmp);
          $(card5dFrcstRH).addClass("row my-row");
          $(card5dFrcstRH).attr("id", "card5dFrcstRH" + "-" + i);
      
          var RH = forecastConditions.daily[i].humidity;
          $(card5dFrcstRH).text("RH: " + RH + "%");
          $("#card5dFrcstBdy" + "-" + i).append(card5dFrcstRH);
        }
      }
      
      function recentCities() {
        $("#recent-cities-btns").empty();
      
        for (i = 0; i < localStorage.length; i++) {
          if (isJSONcity(i)) {
            let button = $("<button>");
      
            $(button).addClass("list-group-item list-group-item-action");
            $(button).attr("id", localStorage.key(i));
            $(button).attr("type", "button");
            $(button).text(localStorage.key(i));
      
            $("#recent-cities-btns").append(button);
      
            $("#recent-cities").removeClass("hide");
          }
        }
      }
      function isJSONcity(i) {
        try {
          // if local storage key value is equal to the city name (in its corresponding structure) is evaluated, then return true
          JSON.parse(localStorage.getItem(localStorage.key(i))).name ==
            localStorage.key(i);
      
          return true;
        } catch (error) {
          return false;
        }
      }
      // Function displays weather data from local storage to the current weather area
      function displayCurrnet(city) {
        for (i = 0; i < localStorage.length; i++) {
          if (city == localStorage.key(i)) {
            var currentConditions = JSON.parse(
              localStorage.getItem(localStorage.key(i))
            );
      
            // Get temperature data from current conditions
            var currentTemp = currentConditions.current.temp.toFixed(1);
      
            // Get date
            var currentDate = moment
              .unix(currentConditions.current.dt)
              .tz(currentConditions.timezone)
              .format("dddd, MMMM Do YYYY");
      
            // Create weather icon image source
            var imgURL =
              "https://openweathermap.org/img/wn/" +
              currentConditions.current.weather[0].icon +
              "@2x.png";
      
            // Clear previous weather icon image
            $("#current-weather-icon").empty();
      
            $("#current-weather-icon").append("<img src =" + imgURL + ">");
            // Display current city and date
            $("#current-city-date").text(
              currentConditions.name + " - " + currentDate
            );
            // Temperature Display
            $("#current-temp").text(
              "Temperature: " + currentTemp + String.fromCharCode(176) + "F"
            );
            // Relative Humidity Display
            $("#current-humidity").text(
              "Humidity: " + currentConditions.current.humidity + "%"
            );
            // Wind Speed Display
            $("#current-wind").text(
              "Wind Speed: " + currentConditions.current.wind_speed + " mph"
            );
            var uvi = currentConditions.current.uvi;
            // UV Index Display
            $("#current-uvi").text("UV Index: " + uvi);
      
            $("#current-uvi").removeClass("badge-success badge-warning badge-danger");
      
            if (uvi < 3) {
              $("#current-uvi").addClass("badge-success");
            } else if (uvi >= 3 && uvi < 8) {
              $("#current-uvi").addClass("badge-warning");
            } else {
              $("#current-uvi").addClass("badge-danger");
            }
      
            $("#weatherDisplay").removeClass("hide");
          }
        }
      }