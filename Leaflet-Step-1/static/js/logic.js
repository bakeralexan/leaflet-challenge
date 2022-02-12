const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
const platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/339b0c56563c118307b1f4542703047f5f698fae/GeoJSON/PB2002_plates.json";
// const platesURL = "PB2002_plates.json";

function createMap() {
    // Adding a tile layer (the background map image) to our map:
    // We use the addTo() method to add objects to our map.
    const street= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    const baseMaps = {
        Street: street,
        Topography: topo
    };
    const overlayMaps = {
        Earthquakes: earthquakeMarkers,
        Techtonic_Plates: plateLine
    };

    // Create a map object, and set the default layers.
    const myMap = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 5,
        layers: [street, earthquakeMarkers]
    });

    // Pass our map layers into our layer control.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    
    console.log("Hello");
    d3.json(earthquakeURL).then(function createEarthquakeMarkers(response) {
        let features = response.features;
        let earthquakeMarkers = [];
        for (let i = 0; i < features.length; i++) {
            let feature = features[i];
            let geometry = feature.geometry;
            let property = feature.properties;
            let earthquakeMarker = L.circle([geometry.coordinates[0], geometry.coordinates[1]]).bindPopup(`<h1> ${property.place}</h1><hr><h3>Magnitude: ${property.mag}</h3>`);
            earthquakeMarkers.push(earthquakeMarker);
        }
    });
    createEarthquakeMarkers(earthquakeMarkers);
    
    d3.json(platesURL).then(function createPlates(response) {
        let features = response.features;
        let plateLines = [];
        for (let i = 0; i < features.length; i++) {
            let feature = features[i];
            let geometry = feature.geometry;
            let property = feature.properties;
            let line = geometry.coordinates[i]
            let plateLine = L.polyline([line]).bindPopup(`<h1> ${property.PlateName}</h1>`);
            plateLines.push(plateLine);
        }
    });
    createPlates(plateLines);
};
createMap();

