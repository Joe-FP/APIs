let mainMap;

const app = function(){
  // Initialise MapWrapper(containerID, coords, zoom)
  mainMap = new MapWrapper('main-map', [0, 0], 2);
  // Generate 5 URLs containing random IP addresses
  let arrURLs = generateURLs(5);
  // Request lat lng coords from the API
  requestIPData(arrURLs);
}

const generateURLs = function(numURLs){
  let arrURL = [];
  for (let i = 0; i < numURLs; i++) {
    let num1 = getRandomInt(3, 216);
    let num2 = getRandomInt(0, 255);
    let num3 = getRandomInt(0, 255);
    let num4 = getRandomInt(0, 255);
    // url returns json data for IP
    let url = `https://ipapi.co/${num1}.${num2}.${num3}.${num4}/json/`;
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
  let ipData = JSON.parse(jsonString);
  mainMap.addMarker([ipData.latitude, ipData.longitude]);
}

window.addEventListener('DOMContentLoaded', app);
