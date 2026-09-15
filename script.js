document.addEventListener("DOMContentLoaded", function () {
    alert("JavaScript is working!");

    const mapElement = document.getElementById("civic-map");

    if (!mapElement) {
        alert("ERROR: civic-map element was not found.");
        return;
    }

    if (typeof L === "undefined") {
        alert("ERROR: Leaflet library is not loaded.");
        return;
    }

    const map = L.map("civic-map").setView([20.5937, 78.9629], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
// Coloured civic issue markers
// Map priority legend
const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    const div = L.DomUtil.create("div", "map-legend");

    div.innerHTML = `
        <h4>Issue Priority</h4>
        <div><span class="legend-dot high"></span> High Priority</div>
        <div><span class="legend-dot medium"></span> Medium Priority</div>
        <div><span class="legend-dot low"></span> Low Priority</div>
    `;

    return div;
};

legend.addTo(map);
L.circleMarker([13.0827, 80.2707], {
    radius: 10,
    color: "#991b1b",
    fillColor: "#ef4444",
    fillOpacity: 0.9,
    weight: 3
})
.addTo(map)
.bindPopup(`
    <b>High Priority Issue</b><br>
    Location: Chennai<br>
    Issue: Large potholes reported<br>
    Priority: High<br>
    Status: Pending
`);
L.circleMarker([13.0674, 80.2376], {
    radius: 10,
    color: "#c2410c",
    fillColor: "#f97316",
    fillOpacity: 0.9,
    weight: 3
})
.addTo(map)
.bindPopup(`
    <b>Medium Priority Issue</b><br>
    Location: Anna Nagar<br>
    Issue: Water supply interruption<br>
    Priority: Medium<br>
    Status: In progress
`);
L.circleMarker([13.0475, 80.2090], {
    radius: 10,
    color: "#166534",
    fillColor: "#22c55e",
    fillOpacity: 0.9,
    weight: 3
})
.addTo(map)
.bindPopup(`
    <b>Low Priority Issue</b><br>
    Location: Koyambedu<br>
    Issue: Garbage collection delay<br>
    Priority: Low<br>
    Status: Reported
`);
    L.marker([13.0827, 80.2707])
        .addTo(map)
        .bindPopup("Chennai civic location")
        .openPopup();
});