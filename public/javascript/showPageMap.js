mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v11", // style URL
  center: attraction.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker()
  .setLngLat(attraction.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${attraction.title}</h3><p>${attraction.location}</p>`
    )
  )
  .addTo(map);
