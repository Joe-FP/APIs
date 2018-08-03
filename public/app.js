let request;
let mainMap;
let arrURL = [];

const handleButtonClick1 = function () {
  mainMap.setView([38.597626, -80.454903], 6);
  mainMap.addMarker([38.597626, -80.454903]);
}

const getRandomInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createIPData = function(){
  // Create IP addresses for a given region
  for (let i = 0; i < 5; i++) {
    // Switzerland 31.130.224.0 - 31.130.239.255
    let num1 = getRandomInt(224, 239);
    let num2 = getRandomInt(0, 255);
    // url returns json data for IP
    let url = `https://ipapi.co/31.130.${num1}.${num2}/json/`;
    arrURL[i] = url;
  };
  makeRequest();
};

const makeRequest = function(){
  arrURL.forEach(function(url) {
    //create a new XMLHttpRequest object
    request = new XMLHttpRequest();
    //set the type of request we want with the url we want to call
    request.open("GET", url)
    //set the callback we want to use when the call is complete
    request.addEventListener('load', requestComplete);
    //send the request
    request.send();
  });
};

const requestComplete = function(){
  //this is the request object itself
  if(this.status !== 200) return;
  //grab the response text
  const jsonString = this.responseText;
  ipData = JSON.parse(jsonString);
  // IPData[IPData.length] = ipData;
  mainMap.addMarker([ipData.latitude, ipData.longitude])
};

// const plotResults = function(){
//   IPData.forEach(function(ip){
//     console.log(ip);
//     mainMap.addMarker([ip.latitude, ip.longitude])
//   });
// }

const app = function(){
  // Initialise MapWrapper(containerID, coords, zoom)
  mainMap = new MapWrapper('main-map', [0, 0], 5);
  // this can the the START button
  var button = document.querySelector('#one');
  button.addEventListener('click', handleButtonClick1);
  createIPData();
}

window.addEventListener('DOMContentLoaded', app);
