mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: windspot.geometry.coordinates, // starting position [lng, lat]
  zoom: 12 // starting zoom
});

new mapboxgl.Marker()
.setLngLat(windspot.geometry.coordinates)
.addTo(map)