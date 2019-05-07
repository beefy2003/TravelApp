// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: '',
        lastName: '',
      },
      // Demo products for Catalog section
      products: [
        {
          id: '1',
          title: 'Apple iPhone 8',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        },
        {
          id: '2',
          title: 'Apple iPhone 8 Plus',
          description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
        },
        {
          id: '3',
          title: 'Apple iPhone X',
          description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
        },
      ]
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var catalogView = app.views.create('#view-about', {
  url: '/about/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
  console.log("Device is ready!");
  getLocation();
  
});

// Login Screen Demo
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  // Close login screen
  app.loginScreen.close('#my-login-screen');

  // Alert username and password
  app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

$$( function() {
  document.addEventListener("deviceready", onDeviceReady, false);
});
    
    function OnDeviceReady()    {
      setTimeout(tryingFile, 2000);
      setTimeout(getMapLocation(), 3000);
      setTimeout(openCage, 5000);
      setTimeout(getWeather, 6000);
      setTimeout(getRate, 7000);
    }

function getLocation(){
  navigator.geolocation.getCurrentPosition(geoCallback, onError);
}

var lat;
var lon;
// The callback function must catch the object with the position
function geoCallback(position){
  
  console.log(position);

  lat = position.coords.latitude;
  lon = position.coords.longitude;
  return lat + lon;
}

// onError callback
function onError(msg){
  console.log(msg);
}

var iso_code;
var symbol;
var currency
var country
var city
var country_code

function openCage(){
 
  var apikey = '22e5695431c543d682e4d4b52ec743ab';
  var api_url = 'https://api.opencagedata.com/geocode/v1/json'
  var request_url = api_url
    + '?'
    + 'key=' +encodeURIComponent(apikey)
    + '&q=' + encodeURIComponent(lat) + ',' + encodeURIComponent(lon)
    + '&pretty=1'
    + '&no_annotations=0';

  // see full list of required and optional parameters:
  // https://opencagedata.com/api#forward

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
  // see full list of possible response codes:
  // https://opencagedata.com/api#codes

    if (request.status == 200){ 
      // Success!
      var data = JSON.parse(request.responseText);
      console.log(data);

      var formatted = data.results[0].formatted;
      city = data.results[0].components.city;
      country_code = data.results[0].components.country_code;
      country = data.results[0].components.country;
      var flag = data.results[0].annotations.flag;
      var timezone = data.results[0].annotations.timezone;
      currency = data.results[0].annotations.currency.name;
      symbol = data.results[0].annotations.currency.symbol;
      iso_code = data.results[0].annotations.currency.iso_code;
      
      // Formattng data to put it on the front end
      var oc  = "</br>Country: " + country +" "+flag+"</br>City: " + city;
      var oc1  = "</br>The Local currency is: " + currency + " "+ symbol+"</br>Currency: " + iso_code;
      var oc2  = "Curent Address is: " + formatted;

      document.getElementById('opencage').innerHTML = oc;
      document.getElementById('currency').innerHTML = oc1;
      document.getElementById('address').innerHTML = oc2;
      
      console.log(formatted);

    } else if (request.status <= 500){ 
    // We reached our target server, but it returned an error
                           
      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log(data.status.message);
   
      
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");        
  };

  request.send();  // make the request
}

var summary
var temperature 

function getWeather(){
  openCage();
  var apiKey = "f9fbb1f5cea57f123581cf463758576d";      
  var exclude = "?exclude=minutely,hourly,daily,alerts,flags";
  var unit = "?units=si";              
  var url = "https://api.darksky.net/forecast/" + apiKey + "/" + lat + "," + lon + exclude + unit;           

  $.ajax({       
      url: url,       
      dataType: "jsonp",       
      success: function (data) {          
             
          var icon = data.currently.icon;         
          summary = data.currently.summary;
          var tempF = data.currently.temperature;
          var humidity = data.currently.humidity;
          var uvIndex = data.currently.uvIndex;
          var rain = data.currently.precipProbability;

          var tempC=(tempF-32)*5/9;
          temperature  = parseFloat(Math.round(tempC * 100) / 100).toFixed(1);

          var weather  = "</br>Summary: " + summary 
            +"</br>Temperature: " + temperature +"°C"
            +"</br>Humidity: " + humidity * 100 +"%"
            +"</br>Chance of Rain: " + rain * 100 +"%"
            +"</br>UV index: " + uvIndex+"</br>";

          document.getElementById('weather').innerHTML = weather;
          
          switch(icon) {
            case "clear-day":
              iconWeather = "<img src='IMG/sunny.png'>";
              document.getElementById('icon').innerHTML = iconWeather;
              break;

            case "partly-cloudy-day":
              iconWeather = "<img src='img/overcast.png'>";
              document.getElementById('icon').innerHTML = iconWeather;
              break;

            case "clear-night":
              iconWeather = "<img src='img/night-clear.png'>";
              document.getElementById('icon').innerHTML = iconWeather;
              break;

            case "rain":
              iconWeather = "<img src='img/rain.png'>";
              document.getElementById('icon').innerHTML = iconWeather;
              break;
            
            case "snow":
              iconWeather = "<img src='img/snow.svg'>";
              document.getElementById('icon').innerHTML = iconWeather;
              break;

            case "sleet":
              iconWeather = "<img src='img/sleet.svg'>";
              document.getElementById('icon').innerHTML = iconWeather;
              break;

            case "wind":

              iconWeather = "<img src='img/wind.svg'>";
              document.getElementById('icon').innerHTML = iconWeather;
              break;    

            case "fog":
              iconWeather = "<img src='img/fog.svg'>";
              document.getElementById('icon').innerHTML = iconWeather;
              break;

            case "cloudy":
              iconWeather = "<img src='img/cloudy.svg'>";
              document.getElementById('icon').innerHTML = iconWeather;
              break;  
              
            case "partly-cloudy-night":
              iconWeather = "<img src='img/night-cloudy.svg'>";
              document.getElementById('icon').innerHTML = iconWeather;
              break;    
              
           
            default:
            break;
                // code block
            } 
      }       
 });  
 
}

var input;
var rate;

function readingInput(){
    input = document.getElementById('number').value;
    console.log(input);
}

function getRate(){

  var apiKey = "8ece0602d1864bf394759fad3e554e66";   
  const url1 = 'http://apilayer.net/api/live?access_key=295fa4ae6b0ad82f2deec9e1a75a6eda&currencies=EUR&source=USD&format=1';
  const url = "http://apilayer.net/api/live?access_key="+apiKey+"&currencies="+iso_code;
  var currencies = "USD"+ iso_code;

  $.ajax({       
      url: url,       
      dataType: "jsonp",       
      success: function (data) {          
          rate = data.quotes[currencies];   
          console.log(data);
          console.log(rate);
      }       
 });     

}

function convert(){

  readingInput();
  getRate();
  var result = result = parseFloat(Math.round(input*rate * 100) / 100).toFixed(2);
  document.getElementById('result1').innerHTML = symbol+result;
  console.log(result);
}

function convert2(){

  readingInput();
  getRate();
  var result = parseFloat(Math.round(input/rate * 100) / 100).toFixed(2);
  document.getElementById('result1').innerHTML = "$"+result;
  console.log(result);

}


// Get geo coordinates
 
function getMapLocation() {
 
  navigator.geolocation.getCurrentPosition
  (onMapSuccess, onMapError, { enableHighAccuracy: true });
}

// Success callback for get geo coordinates

var onMapSuccess = function (position) {

  Lat = position.coords.latitude;
  Lon = position.coords.longitude;

  getMap(Lat, Lon);

}

// Get map by using coordinates

function getMap(lat, lon) {

  var mapOptions = {
      center: new google.maps.LatLng(0, 0),
      zoom: 1,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map
  (document.getElementById("map"), mapOptions);


  var latLong = new google.maps.LatLng(lat, lon);

  var marker = new google.maps.Marker({
      position: latLong
  });

  marker.setMap(map);
  map.setZoom(15);
  map.setCenter(marker.getPosition());
}

// Success callback for watching your changing position

var onMapWatchSuccess = function (position) {

  var updatedLatitude = position.coords.latitude;
  var updatedLongitude = position.coords.longitude;

  if (updatedLatitude != Lat && updatedLongitude != Lon) {

      Lat = updatedLatitude;
      Lon = updatedLongitude;

      getMap(updatedLatitude, updatedLongitude);
  }
}

// Error callback

function onMapError(error) {
  console.log('code: ' + error.code + '\n' +
      'message: ' + error.message + '\n');
}

// Watch your changing position

function watchMapPosition() {

  return navigator.geolocation.watchPosition
  (onMapWatchSuccess, onMapError, { enableHighAccuracy: true });
}

var fileEntryGlobal;
var contentGlobal = "";

function tryingFile(){

  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);
 
}

function fileSystemCallback(fs){

  // Name of the file I want to create
  var fileToCreate = "newPersistentFile.txt";

  // Opening/creating the file
  fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);
}

var fileSystemOptionals = { create: true, exclusive: false };

fileEntryGlobal;
contentGlobal = "";

function getFileCallback(fileEntry){

  fileEntryGlobal = fileEntry;

}
function readInput(){
  writeFile(textToWrite);
}

// Let's write some files
function writeFile() {

  readFile();

  contentGlobal = contentGlobal + "Date: "+ date + ", Country:" + country + ", City: "+ city + ", Weather: "+ summary + ", Temperature: " + temperature  +"°C<br/>";

  var dataObj = new Blob([contentGlobal], { type: 'text/plain' });

  // Create a FileWriter object for our FileEntry (log.txt).
  fileEntryGlobal.createWriter(function (fileWriter) {

      // If data object is not passed in,
      // create a new Blob instead.
      if (!dataObj) {
          dataObj = new Blob(['Hello'], { type: 'text/plain' });
      }

      fileWriter.write(dataObj);

      fileWriter.onwriteend = function() {
          console.log("Successful file write...");
      };

      fileWriter.onerror = function (e) {
          console.log("Failed file write: " + e.toString());
      };

  });
}

// Let's read some files
function readFile() {

  // Get the file from the file entry
  fileEntryGlobal.file(function (file) {
      // Create the reader
      var reader = new FileReader();
      reader.readAsText(file);
  
      reader.onloadend = function() {

          console.log("Successful file read: " + this.result);
          console.log("file path: " + fileEntryGlobal.fullPath);
          contentGlobal = this.result;
          document.getElementById('data').innerHTML=contentGlobal;

      };
  }, onError);
}

function onError(msg){
  console.log(msg);
}

function setOptions(srcType) {
  var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: srcType,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true  //Corrects Android orientation quirks
  }
  return options;
}

function openCamera(selection) {

  var srcType = Camera.PictureSourceType.CAMERA;
  var options = setOptions(srcType);
  var func = createNewFileEntry;

  navigator.camera.getPicture(function cameraSuccess(imageUri) {

      displayImage(imageUri);
      // You may choose to copy the picture, save it somewhere, or upload.
      func(imageUri);

  }, function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");

  }, options);
}

function displayImage(imgUri) {

  var elem = document.getElementById('imageFile');
  elem.src = imgUri;
}

function createNewFileEntry(imgUri) {
  window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {

      // JPEG file
      dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {

          // Do something with it, like write to it, upload it, etc.
          // writeFile(fileEntry, imgUri);
          console.log("got file: " + fileEntry.fullPath);
          // displayFileData(fileEntry.fullPath, "File copied to");

      }, onErrorCreateFile);

  }, onErrorResolveUrl);
}

function getFileEntry(imgUri) {
  window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {

      // Do something with the FileEntry object, like write to it, upload it, etc.
      // writeFile(fileEntry, imgUri);
      console.log("got file: " + fileEntry.fullPath);
      // displayFileData(fileEntry.nativeURL, "Native URL");

  }, function () {
    // If don't get the FileEntry (which may happen when testing
    // on some emulators), copy to a new FileEntry.
      createNewFileEntry(imgUri);
  });
}

function pics()
{
        navigator.camera.getPicture(cameraCallback, onError);
}
        
function cameraCallback(imageData) 
{
        var image = document.getElementById('myImage'); 
        image.src = imageData;
}  

function onError(msg)
{
    console.log(msg);  
}
