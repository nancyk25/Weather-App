var proxySite =  'https://cors-anywhere.herokuapp.com/'
var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?";
var weatherKey = "&appid=b00a1db84f39b6067538e505bbe40678"
var googleAPI ="https://maps.googleapis.com/maps/api/geocode/json?latlng="
var apiKey="&key=AIzaSyDOzHaBEGc5syR3vKPw3phntyWev2rVOiE";
var lon;
var lat;
var units = 'imperial'
var icons = new Skycons({"color":"black"});


$( document ).ready(function() {

  x = navigator.geolocation

  x.getCurrentPosition(success,failure);
  
  function success(position){
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    getLocation(lat,lon);
    getWeather(lat,lon, units);
    getIcon(lat,lon);
    $("#toggle-unit").removeClass("hidden");
    $("#daily-quote").removeClass("hidden");
    window.onload(changeColor);

  };
  
  function failure(){
    $("weather-info").html("<p>Unable to retrieve geolocation coordinates.</p>")
  };
  
  $('#toggle-unit').click( clickUnit )
      
});

var clickUnit = () => {
  units === 'metric' ? units = 'imperial' : units = 'metric'
  
  if (units == 'metric')
    $('#toggle-unit').text("C");
  else if (units == 'imperial')
    $('#toggle-unit').text("F");
  
  console.log('toggle', units)
  getWeather(lat, lon, units);
  
}

 function getLocation(lat,lon){
    var urlString= googleAPI + lat + "," + lon + apiKey;
    var data;
    $.ajax({
     url: urlString,
     data: {
       format: 'json'
     },
     error: function(error){
      console.log(error);
     }, success: function(res){
      var results = res.results
      var cityName = results[1].formatted_address;
      $('#city').text(cityName);
     }
    });
  }
    

function getWeather(lat,lon, units){
  var weatherURL = proxySite + weatherAPI + "lat=" + lat + "&lon=" + lon + weatherKey + '&units=' + units;
  
  console.log(weatherURL);
  $.ajax(weatherURL).then( res => {
    console.log('temp', res.main.temp);
    roundedTemp = Math.round(res.main.temp);
    console.log(roundedTemp);
    console.log('desc', res.weather[0].description);
    $('#temp').text(roundedTemp);
    $('#desc').text(res.weather[0].description);
  })
  
}

function getIcon(lat,lon){
 var weatherURL = proxySite + weatherAPI + "lat=" + lat + "&lon=" + lon + weatherKey + '&units=' + units;
  $.ajax(weatherURL).then( res => {
    var icon = res.weather[0].icon;
    console.log("getIcon",icon);
    
    switch (icon) {
      case "01d":
icons.set("clear-day", Skycons.CLEAR_DAY);
        break;
      case '01n':
   icons.set("clear-night", Skycons.CLEAR_NIGHT);
        break;
      case '02d':
  icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
        break;
      case '02n':
  icons.set("partly-cloudy-night", Skycons.PARTLY_CLOUDY_NIGHT);
        break;
      case '03d':
      case '03n':
      case '04d': 
      case '04n':
 icons.set("cloudy", Skycons.CLOUDY);
        break;
      case '9d':
      case '9n':
      case '10d': 
      case '10n':
  icons.set("rain", Skycons.RAIN);
        break;
      case '11d':
      case '11n':
  icons.set("sleet", Skycons.SLEET);
        break;
      case '13d':
      case '13n':
  icons.set("snow", Skycons.SNOW);
        break;
      case "50d":
      case "50n":
  icons.set("fog", Skycons.FOG);
        break;
      default:
        console.log("icon not found");
   
     } 
    
  })
  
  icons.play();
}