/* eslint-disable */
const displayMap = (locations) => {
  if (!window.L || !locations || locations.length === 0) return;

  const map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: false,
  });

  L.control.zoom({ position: "topright" }).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const points = [];
  const markerIcon = L.icon({
    iconUrl: "/img/pin.png",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  });

  locations.forEach((loc) => {
    const [lng, lat] = loc.coordinates;
    const point = [lat, lng];

    // Add marker
    L.marker(point, { icon: markerIcon })
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
        closeOnClick: false,
      })
      .openPopup();

    points.push(point);
  });

  map.fitBounds(L.latLngBounds(points), {
    paddingTopLeft: [100, 200],
    paddingBottomRight: [100, 150],
    animate: false,
  });
};
