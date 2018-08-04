const MapWrapper = function(container, coords, zoom){
  const osmLayer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
  this.map = L.map(container).setView(coords, zoom).addLayer(osmLayer);
  this.map.on("click", function(event){
    // let coords = [event.latlng.lat, event.latlng.lng]
    // this.setView(coords, 11);
    // this.addMarker(coords);
  }.bind(this))
};

MapWrapper.prototype.addMarker = function(coords){
  marker = L.marker(coords).addTo(this.map);
  marker.bindPopup('test');
};

MapWrapper.prototype.setView = function(coords, zoom){
  this.map.setView(new L.LatLng(coords[0], coords[1]), zoom);
};

MapWrapper.prototype.addPopup = function(coords, string){
  // var popup = L.popup({ autoClose: false })
  var popup = L.popup()
      .setLatLng([coords[0], coords[1]])
      .setContent(string)
      .openOn(this.map);
};

MapWrapper.prototype.addCircle = function(coords){
  var circle = L.circle(coords, {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 500000
}).addTo(this.map);
};
