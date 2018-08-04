let mainMap;
// This is where we set the number of URLs we want to generate.
// Each URL represents a request to the API for IP data, which
// also equals the number of markers on the map.
const numURLs = 3
let arrLats = [];
let arrLongs = [];
let completeRequests = 0;

const initialize = function(){
  // Initialise MapWrapper(containerID, coords, zoom)
  mainMap = new MapWrapper('main-map', [0, 0], 2);
  let startButton = document.getElementById('start');
  startButton.addEventListener('click', startApp);
};

const startApp = function(){
  // Generate 5 URLs containing random IP addresses
  let arrURLs = generateURLs(numURLs);
  // Request lat lng coords from the API
  requestIPData(arrURLs);
};

const generateURLs = function(numURLs){
  let arrURL = [];
  for (let i = 0; i < numURLs; i++) {
    // Generate random IP.
    let num1 = getRandomInt(3, 216);
    let num2 = getRandomInt(0, 255);
    let num3 = getRandomInt(0, 255);
    let num4 = getRandomInt(0, 255);
    let IP = `${num1}.${num2}.${num3}.${num4}`;
    // Generate URL using IP.
    let url = `https://ipapi.co/${IP}/json/`;
    arrURL[i] = url;
  };
  return arrURL;
};

const requestIPData = function(arrURL){
  let arrRequests = [];
    for (var i = 0; i < arrURL.length; i++){
       (function(i) {
          arrRequests[i] = new XMLHttpRequest();
          // Asynchronous request - receive a callback when the data is received.
          arrRequests[i].open("GET", arrURL[i], true);
          arrRequests[i].onreadystatechange = function (event) {
            if (arrRequests[i].readyState === 4) {
              if (arrRequests[i].status === 200) {
                // url returns json data for IP from API via this.responseText
                const jsonString = this.responseText;
                // Each request will execute this function 0.5s apart
                setTimeout(function(){ markIPLocation(jsonString); }, i*500);
              } else {
                console.log("Error", arrRequests[i].statusText);
              };
            }
          };
          arrRequests[i].send(null);
       })(i);
    }
};

const getRandomInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const markIPLocation = function(jsonString){
  // This callback is executed when each request is complete.
  // Wait until all requests are complete before calculating
  // mean lat long coords - must be a better way to do this?
  completeRequests ++
  let ipData = JSON.parse(jsonString);
  const lat = ipData.latitude;
  const long = ipData.longitude;
  arrLats.push(lat);
  arrLongs.push(long);
  mainMap.addMarker([lat, long]);
  // When all requests are complete - calculate the mean lat lng coords.
  if (completeRequests === numURLs){
    analyseData();
  };
};

const analyseData = function(){
  let meanCoords = calculateMeanLatLng();
  mainMap.addCircle(meanCoords);
};

const calculateMeanLatLng = function(){
  const meanLat = _.mean(arrLats);
  const meanLng = _.mean(arrLongs);
  return [meanLat, meanLng];
};

window.addEventListener('DOMContentLoaded', initialize);
