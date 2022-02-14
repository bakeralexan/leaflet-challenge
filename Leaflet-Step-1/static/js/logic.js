const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
const platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/339b0c56563c118307b1f4542703047f5f698fae/GeoJSON/PB2002_plates.json";


function createMap() {
    // Adding a tile layer (the background map image) to our map:
    // We use the addTo() method to add objects to our map.
    const street= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    let earthquakeMarkers = L.layerGroup([]);
    d3.json(earthquakeURL).then(function (response) {
        let features = response.features;
        // put the function outside of the loop then call it in the radius thing
        function colorChange() {
            if (magnitude < 3.50) {
                fillColor: "green",
            } else if (magnitude < 5.50) {
                fillColor: "yellow",
            } else {
                fillColor: "red",
            }
        };
        function markerSize(magnitude) {
            return Math.sqrt(magnitude) * 100;
        }
        // markerSize(magnitude)

        for (let i = 0; i < features.length; i++) {
            let feature = features[i];
            let geometry = feature.geometry;
            let property = feature.properties;
            let magnitude = property.mag;


            let earthquakeMarker = L.circle([geometry.coordinates[1], geometry.coordinates[0]], {
                color: "white",
                fillColor: colorChange(),
                fillOpacity: 0.5,
                radius: markerSize(magnitude)
            }).bindPopup(`<h1> ${property.place}</h1><hr><h3>Magnitude: ${magnitude}</h3>`);
            earthquakeMarker.addTo(earthquakeMarkers);
        }
        // return earthquakeMarkers;
        earthquakeMarkers.addTo(myMap);
    }) 

    let plateLines = L.layerGroup([]);

    d3.json(platesURL).then(function createPlates(response) {
        let features = response.features;

        for (let i = 0; i < features.length; i++) {
            let feature = features[i];
            let geometry = feature.geometry;
            let property = feature.properties;
            let line = geometry.coordinates
            let plateLine = L.polyline([line,
            {color: "orange"}]).bindPopup(`<h1> ${property.PlateName}</h1>`);
            plateLine.addTo(plateLines);
        }
        return plateLines;
    })


    const baseMaps = {
        Street: street,
        Topography: topo
    };
    const overlayMaps = {
        Earthquakes: earthquakeMarkers,
        Tectonic_Plates: plateLines
    };

    // Create a map object, and set the default layers.
    const myMap = L.map("map", {
        center: [35.0902, -105.7129],
        zoom: 4,
        layers: [street, earthquakeMarkers]
    });

    // Pass our map layers into our layer control.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


}
createMap();

