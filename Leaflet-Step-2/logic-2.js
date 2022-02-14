// const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
// const platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/339b0c56563c118307b1f4542703047f5f698fae/GeoJSON/PB2002_plates.json";


// function createMap() {
//     // Adding a tile layer (the background map image) to our map:
    
//     // const satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     //     maxZoom: 18,
//     //     // id: 'mapbox/streets-v11',
//     //     id:'mapbox://styles/mapbox/satellite-v9',
//     //     tileSize: 512,
//     //     zoomOffset: -1,
//     //     accessToken: 'API_KEY'
//     // });
//     // const map = new mapboxgl.Map('https://api.mapbox.com/v4/mapbox.satellite/1/0/0@2x.jpg90?access_token=pk.eyJ1IjoiYmFrZXJhIiwiYSI6ImNremo1OWtzcDBzeTkybnBhcnhza2hkaGYifQ.r-F1kuH2yLspiIWW14xvLw', {
//     //     container: 'map',
//     //     zoom: 9,
//     //     center: [137.915, 36.259],
//     //     style: 'mapbox://styles/mapbox/satellite-v9'
//     //   });

//     const street= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     });
//     const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//         attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//     });
//     let earthquakeMarkers = L.layerGroup([]);
//     d3.json(earthquakeURL).then(function (response) {
//         let features = response.features;

//         for (let i = 0; i < features.length; i++) {
//             let feature = features[i];
//             let geometry = feature.geometry;
//             let property = feature.properties;
//             let magnitude = property.mag;

//             function markerSize(magnitude) {
//                 if (magnitude != 0 || magnitude != "NaN") {
//                     return magnitude * 10000;
//                 } else{
//                     magnitude = 0;
//                 }
//             };
//             function colorChange(magnitude) {
//                 if (magnitude < 2.5) return "#2E7F18";
//                 else if (magnitude < 5.4) return "#45731E";
//                 else if (magnitude < 6.0) return "#675E24";
//                 else if (magnitude < 6.9) return "#8D472B";
//                 else if (magnitude < 7.9) return "#B13433";
//                 else return " #C82538";
//             }; 
//             // function fillColorChange(magnitude) {
//             //     if (magnitude < 3.50) {
//             //         fiilColor: "green";
//             //         return magnitude;
//             //     } else if (magnitude < 5.50) {
//             //         fillColor: "yellow";
//             //         return magnitude;
//             //     } else {
//             //         fillColor: "red";
//             //         return magnitude;
//             //     }
//             // };

//             let earthquakeMarker = L.circle([geometry.coordinates[1], geometry.coordinates[0]], {
//                 color: colorChange(magnitude),
//                 fillColor: colorChange(magnitude),
//                 fillOpacity: 0.75,
//                 radius: markerSize(magnitude)
//             }).bindPopup(`<h1> ${property.place}</h1><hr><h3>Magnitude: ${magnitude}</h3>`);
//             earthquakeMarker.addTo(earthquakeMarkers);
//             // console.log(fillColorChange(magnitude));
//             // console.log(magnitude);
//         }

//         earthquakeMarkers.addTo(myMap);
//     }) 

//     let plateLines = L.layerGroup([]);

//     d3.json(platesURL).then(function createPlates(response) {
//         let features = response.features;

//         for (let i = 0; i < features.length; i++) {
//             let feature = features[i];
//             let geometry = feature.geometry;
//             let property = feature.properties;
//             let coordinates = geometry.coordinates.reverse();
//             for (let i = 0; i < coordinates.length; i++) {
//                 let line = [coordinates[1], coordinates[0]];
//             };
//             let plateLine = L.polyline(line).bindPopup(`<h1> ${property.PlateName}</h1>`);
//             plateLine.addTo(plateLines);
//         }
//         return plateLines;
//     })


//     const baseMaps = {
//         Street: street,
//         Topography: topo
//         // Satellite: satellite,
//         // Alt: map
//     };
//     const overlayMaps = {
//         Earthquakes: earthquakeMarkers,
//         Tectonic_Plates: plateLines
//     };

//     // Create a map object, and set the default layers.
//     const myMap = L.map("map", {
//         center: [35.0902, -105.7129],
//         zoom: 4,
//         layers: [street, earthquakeMarkers]
//     });

//     // Pass our map layers into our layer control.
//     // Add the layer control to the map.
//     L.control.layers(baseMaps, overlayMaps, {
//         collapsed: false
//     }).addTo(myMap); // We use the addTo() method to add objects to our map.

//     let geojson = L.choropleth(response, {
//         valueProperty: "",
//         scale: ["#ffffb2", "#b10026"],
//         steps: 7,
//         mode: "q",
//         style: {
//           // Border color
//           color: "#fff",
//           weight: 1,
//           fillOpacity: 0.8
//         },
//         onEachFeature: function(feature, layer) {
//             layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
//               "$" + feature.properties.MHI2016);
//           }
//     };
//     let legend = L.control({ position: "bottomright" });
//     legend.onAdd = function() {
//         let div = L.DomUtil.create("div", "info legend");
//         let limits = geojson.options.limits;
//         let colors = geojson.options.colors;
//         let labels = [];
//         let legendInfo = "<h1>Magnitude</h1>" +
//             "<div class=\"labels\">" +
//             "<div class=\"min\">" + limits[0] + "</div>" +
//             "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//             "</div>";
//         div.innerHTML = legendInfo;
//         limits.forEach(function(limit, index) {
//             labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//         });
  
//         div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//         return div;
//         legend.addTo(myMap);
//     };
// }
// createMap();

