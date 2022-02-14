const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
const platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/339b0c56563c118307b1f4542703047f5f698fae/GeoJSON/PB2002_plates.json";


// function createMap() {
    // Adding a tile layer (the background map image) to our map:

const street= L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
const satellite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

let earthquakeMarkers = L.layerGroup([]);
// Create a map object, and set the default layers.
const myMap = L.map("map", {
    center: [35.0902, -105.7129],
    zoom: 4,
    layers: [street, earthquakeMarkers]
});
d3.json(earthquakeURL).then(function (response) {
    let features = response.features;

    for (let i = 0; i < features.length; i++) {
        let feature = features[i];
        let geometry = feature.geometry;
        let property = feature.properties;
        let magnitude = property.mag;

        function markerSize(magnitude) {
            if (magnitude != 0 || magnitude != "NaN") {
                return magnitude * 10000;
            } else{
                magnitude = 0;
            }
        };
        function colorChange(magnitude) {
            // if (magnitude < 2.5) return "#2E7F18";
            // else if (magnitude < 5.4) return "#45731E";
            // else if (magnitude < 6.0) return "#675E24";
            // else if (magnitude < 6.9) return "#8D472B";
            // else if (magnitude < 7.9) return "#B13433";
            // else return " #C82538";
            if (magnitude > 5) {
                return "#ea2c2c";
              }
              if (magnitude > 4) {
                return "#ea822c";
              }
              if (magnitude > 3) {
                return "#ee9c00";
              }
              if (magnitude > 2) {
                return "#eecc00";
              }
              if (magnitude > 1) {
                return "#d4ee00";
              }
              return "#98ee00";
        }; 

        let earthquakeMarker = L.circle([geometry.coordinates[1], geometry.coordinates[0]], {
            color: colorChange(magnitude),
            fillColor: colorChange(magnitude),
            fillOpacity: 0.75,
            radius: markerSize(magnitude)
        }).bindPopup(`<h1> ${property.place}</h1><hr><h3>Magnitude: ${magnitude}</h3>`);
        earthquakeMarker.addTo(earthquakeMarkers);
    }
    earthquakeMarkers.addTo(myMap);
}) 

    // let legend = L.control({ position: "bottomright" });
    // legend.onAdd = function() {
    //     let div = L.DomUtil.create("div", "info legend");
    //     let limits = earthquakeMarkers.options.limits;
    //     let colors = earthquakeMarkers.options.colors;
    //     let labels = [];
    //     let legendInfo = "<h1>Magnitude</h1>" +
    //         "<div class=\"labels\">" +
    //         "<div class=\"min\">" + limits[0] + "</div>" +
    //         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    //         "</div>";
    //     div.innerHTML = legendInfo;
    //     limits.forEach(function(limit, index) {
    //         labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    //     });

    //     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    //     return div;
    //     legend.addTo(myMap);
    //     console.log(legend);
    // };
let legend = L.control({position: "bottomright"});
// Then add all the details for the legend
legend.onAdd = function() {
let div = L.DomUtil.create("div", "info legend");
// const magnitudes = [0, 2.5, 5.4, 6.0, 7.9, 9];
// const colors = [
//     // "#2E7F18",
//     // "#45731E",
//     // "#675E24",
//     // "#8D472B",
//     // "#B13433",
//     // "#C82538"
// ];
const magnitudes = [0, 1, 2, 3, 4, 5];
const colors = [
  "#98ee00",
  "#d4ee00",
  "#eecc00",
  "#ee9c00",
  "#ea822c",
  "#ea2c2c"
];
for (let i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
};

// Finally, we our legend to the map.
legend.addTo(myMap);
// console.log(legend.addTo(map));

let plateLines = L.layerGroup([]);
d3.json(platesURL).then(function createPlates(response) {
     L.geoJson(response)
         .addTo(plateLines);
});


const baseMaps = {
    Street: street,
    Satellite: satellite
};
const overlayMaps = {
    Earthquakes: earthquakeMarkers,
    Tectonic_Plates: plateLines
};


// Pass our map layers into our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap); // We use the addTo() method to add objects to our map.


// }
// createMap();

