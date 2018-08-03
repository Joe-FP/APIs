let mainMap;

const getRandomInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
  requestIPData(arrURL);
};

const requestIPData = function(arrURL){
  let arrRequests = [];
    for (var i = 0; i < arrURL.length; i++){
       (function(i) {
          arrRequests[i] = new XMLHttpRequest();
          arrRequests[i].open("GET", arrURL[i], true);
          arrRequests[i].onreadystatechange = function (event) {
            if (arrRequests[i].readyState !== 4 && arrRequests[i].status === 200) return;
            if (arrRequests[i].status === 200) {
              const jsonString = this.responseText;
              markIPLocation(jsonString);
            } else {
              console.log("Error", arrRequests[i].statusText);
            };
          };
          arrRequests[i].send(null);
       })(i);
    }
};

const markIPLocation = function(jsonString){
  let ipData = JSON.parse(jsonString);
  mainMap.addMarker([ipData.latitude, ipData.longitude]);
}

const app = function(){
  // Initialise MapWrapper(containerID, coords, zoom)
  mainMap = new MapWrapper('main-map', [0, 0], 2);
  generateURLs(5);
}

window.addEventListener('DOMContentLoaded', app);
