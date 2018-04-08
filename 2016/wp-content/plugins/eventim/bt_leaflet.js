function bt_leaflet_init( id, tile, lat, lng, zoom, attribution, icon) {

    var myLatLng = L.latLng(lat, lng);
    var mapOptions = {
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        zoomControl: true,
        attributionControl: true
    };
    var map = L.map(id, mapOptions).setView(myLatLng, zoom);
    L.tileLayer(tile, {
        attribution: attribution
    }).addTo(map);

    var marker = L.marker(myLatLng).addTo(map);

}
