let request;
let mainMap;
let arrURL = [];

const getRandomInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createIPData = function(){
  // Create IP addresses for a given region
  for (let i = 0; i < 10; i++) {
    // Switzerland 31.130.224.0 - 31.130.239.255
    let num1 = getRandomInt(0, 255);
    let num2 = getRandomInt(0, 255);
    let num3 = getRandomInt(0, 255);
    // url returns json data for IP
    let url = `https://ipapi.co/31.${num1}.${num2}.${num3}/json/`;
    arrURL[i] = url;
  };
  makeRequests();
};

const makeRequests = function(){
  // arrURL.forEach(function(url) {
    //create a new XMLHttpRequest object
    // let request = new XMLHttpRequest();
    let nRequest = [];
    for (var i=0; i<10; i++){
       (function(i) {
          nRequest[i] = new XMLHttpRequest();
          nRequest[i].open("GET", arrURL[i], true);
          console.log(arrURL[i]);
          nRequest[i].onreadystatechange = function (oEvent) {
             if (nRequest[i].readyState === 4) {
                if (nRequest[i].status === 200) {
                  console.log(nRequest[i].responseText);
                  const jsonString = this.responseText;
                  let ipData = JSON.parse(jsonString);
                  mainMap.addMarker([ipData.latitude, ipData.longitude])
                  // alert(nRequest[i].responseText);
                } else {
                  // console.log("Error", nRequest[i].statusText);
                }
             }
          };
          nRequest[i].send(null);
       })(i);
    }

    // request.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //       const jsonString = this.responseText;
    //       let ipData = JSON.parse(jsonString);
    //       mainMap.addMarker([ipData.latitude, ipData.longitude])
    //     };
    // };
    // request.open("GET", url, true)
    // request.send();
  // });
  // request.addEventListener('load', requestComplete);
};


const app = function(){
  // Initialise MapWrapper(containerID, coords, zoom)
  mainMap = new MapWrapper('main-map', [0, 0], 5);
  createIPData();
}

window.addEventListener('DOMContentLoaded', app);
