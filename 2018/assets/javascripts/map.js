function leaflet_init(id, lat, lng, zoom) {
  var attribution = '<a href="https://openstreetmap.org/">&copy OpenStreetMap contributors</a>';
  var venueLatLng = L.latLng([lat, lng]);
  var mapOptions = {
     dragging: false,
     touchZoom: false,
     scrollWheelZoom: false,
     zoomControl: true,
     attributionControl: true
  };

  var map = L.map(id, mapOptions).setView(venueLatLng, zoom);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: attribution
    }
  ).addTo(map);

  var marker = L.marker(venueLatLng).addTo(map);
}
