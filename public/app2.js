let mainMap;
// This is where we set the number of URLs we want to generate.
// Each URL represents a request to the API for IP data, which
// also equals the number of markers on the map.
let numURLs;
let arrLats = [];
let arrLongs = [];
let completeRequests = 0;
let compiledData = []; //array of objects

const initialize = function(){
  google.charts.load("current", {packages:["corechart"]});
  // Initialise MapWrapper(containerID, coords, zoom)
  mainMap = new MapWrapper('main-map', [0, 0], 2);
  let startButton = document.getElementById('start');
  startButton.addEventListener('click', startApp);
};

const startApp = function(){
  numURLs = document.getElementById("ipinput").value;
  // Generate 5 URLs containing random IP addresses
  let arrURLs = generateURLs(numURLs);
  // Request lat lng coords from the API
  requestIPData(arrURLs);
};

const generateURLs = function(numURLs){
  let arrURL = [];
  for (let i = 0; i < numURLs; i++) {
    // Generate random IP.
    let num1 = getRandomInt(0, 255);
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
                let ipData = JSON.parse(jsonString);
                // compile JSON ipData
                compiledData.push(ipData);
                // Each request will execute this function 0.5s apart
                setTimeout(function(){ markIPLocation(ipData); }, i*100);
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

const markIPLocation = function(ipData){
  // This callback is executed when each request is complete.
  // Wait until all requests are complete before calculating
  // mean lat long coords - must be a better way to do this?
  completeRequests ++
  arrLats.push(ipData.latitude);
  arrLongs.push(ipData.longitude);
  mainMap.addMarker(ipData);
  // When all requests are complete - calculate the mean lat lng coords.
  if (completeRequests === parseInt(document.getElementById("ipinput").value)){
    // addMeanCirlce();
    displayCharts();
  };
};

const displayCharts = function(){
  displayCountryChart();
  displayRegionChart();
  displayCityChart();
}

const displayCountryChart = function(){
  const countries = _.countBy(compiledData, 'country_name');
  // Get correct format for Google chart data
  let arr = Object.entries(countries);
  const headings = ['Country', 'Number of hits'];
  arr.unshift(headings);
  const chartData = google.visualization.arrayToDataTable(arr);
  const options = {
    title: 'Countries',
    pieHole: 0,
    is3D: true,
    // slices: {1:{offset: 0.2}, 2:{offset: 0.3}}
  };
  const chart = new google.visualization.PieChart(document.getElementById('countrychart'));

  // function selectHandler() {
  //   var selectedItem = chart.getSelection()[1];
  //   debugger;
  //   console.log(selectedItem);
  //   if (selectedItem) {
  //     var country = chartData.getValue(getSelection.row, 1);
  //     alert('The user selected ' + country);
  //   }
  // };
  // google.visualization.events.addListener(chart, 'onmouseover', selectHandler);

  chart.draw(chartData, options);
};

const displayRegionChart = function(){
  const regions = _.countBy(compiledData, 'region');
  // Get correct format for Google chart data
  let arr = Object.entries(regions);
  const headings = ['Region', 'Number of hits'];
  arr.unshift(headings);
  const chartData = google.visualization.arrayToDataTable(arr);
  const options = {
    title: 'Regions',
    pieHole: 0,
    is3D: true,
    // slices: {1:{offset: 0.2}, 2:{offset: 0.3}}
  };
  const chart = new google.visualization.PieChart(document.getElementById('regionchart'));
  chart.draw(chartData, options);
}

const displayCityChart = function(){
  const cities = _.countBy(compiledData, 'city');
  // Get correct format for Google chart data
  let arr = Object.entries(cities);
  const headings = ['Region', 'Number of hits'];
  arr.unshift(headings);
  const chartData = google.visualization.arrayToDataTable(arr);
  const options = {
    title: 'Cities',
    pieHole: 0,
    is3D: true,
    // slices: {1:{offset: 0.2}, 2:{offset: 0.3}}
  };
  const chart = new google.visualization.PieChart(document.getElementById('citychart'));
  chart.draw(chartData, options);
}























const addMeanCirlce = function(){
  let meanCoords = calculateMeanLatLng();
  mainMap.addCircle(meanCoords);
};

const calculateMeanLatLng = function(){
  const meanLat = _.mean(arrLats);
  const meanLng = _.mean(arrLongs);
  return [meanLat, meanLng];
};

window.addEventListener('DOMContentLoaded', initialize);
