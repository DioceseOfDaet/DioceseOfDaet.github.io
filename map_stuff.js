// 1. Declare global variables so the list can talk to the map
let mapInstance;
const parishMarkers = {}; 

function generateMap() {
    mapInstance = new maptilersdk.Map({
        container: 'map',
        style: "019db912-cee9-723a-93e6-b89360815c9e",
        apiKey: "qqOC54zoRb8iFyHyyMOi",
        center: [122.62696, 14.11761],
        zoom: 9.1
    });

    // Helper for URL slugs
    function formatName(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/[^a-zA-Z0-9-]/g, " ")
            .trim().toLowerCase().replace(/\s+/g, "_");
    }

    fetch('/parishes.json')
        .then(response => response.json())
        .then(data => {
            // Create Map Markers
            Object.entries(data).forEach(([key, place]) => {
                const el = document.createElement('div');
                el.className = 'custom-marker';
                el.style.backgroundImage = `url(${place.marker_icon})`;
                el.style.width = '32px';
                el.style.height = '32px';
                el.style.backgroundSize = 'cover';
                el.style.cursor = 'pointer';

                const flippedCoords = [...place.coords].reverse();
                const marker = new maptilersdk.Marker({ element: el })
                    .setLngLat(flippedCoords)
                    .addTo(mapInstance);

                parishMarkers[key] = marker;

                const popupContent = document.createElement('div');
                const slug = formatName(place.name);
                popupContent.innerHTML = `
                    <div class="special_map_popup">
                        <div class="special_map_popup_image_holder">
                            <img src="${place.church_image}">
                        </div>
                        <h2>${place.name}</h2>
                        <p style="margin: 5px 0;">${place.address}</p>
                        <div style="display:flex; justify-content: space-between; align-items:center; margin-top: 8px;">
                            <a href="/parishes/${slug}/info.html" style="text-decoration: none; font-weight: bold;">Learn More</a>
                            <span class="zoom-btn" style="color: blue; cursor:pointer; font-size: 0.9em;">🔍︎ Zoom In</span>
                        </div>
                    </div>
                `;

                popupContent.querySelector('.zoom-btn').addEventListener('click', () => {
                    mapInstance.flyTo({ center: flippedCoords, zoom: 16, essential: true });
                });

                marker.setPopup(new maptilersdk.Popup({ offset: 25 }).setDOMContent(popupContent));
            });

            // Trigger the list generation
            renderSortedParishList(data);
        });
        mapInstance.on('load', function() {
        fetch('/camarines_norte.json')
            .then(response => response.json())
            .then(data => {
                mapInstance.addSource('province', { 'type': 'geojson', 'data': data });
                mapInstance.addLayer({
                    'id': 'province-fill', 'type': 'fill', 'source': 'province',
                    'paint': { 'fill-color': '#ff7800', 'fill-opacity': 0.2 }
                });
                mapInstance.addLayer({
                    'id': 'province-outline', 'type': 'line', 'source': 'province',
                    'paint': { 'line-color': '#ff7800', 'line-width': 3 }
                });
            });
    });
}

function renderSortedParishList(data) {
    const mainContainer = document.getElementById('parishes_holder');
    
    // Define the specific order from the image
    const vicariateOrder = [
        "St. Raphael", "St. John the Baptist", "St. Peter", 
        "St. John the Apostle", "Our Lady of Candelaria", 
        "St. Lucy", "St. Helena"
    ];

    // Remove existing placeholders
    mainContainer.querySelectorAll('.red_title, .vicariates').forEach(el => el.remove());

    vicariateOrder.forEach(vicName => {
        // Create Header
        const header = document.createElement('h2');
        header.className = 'red_title';
        header.textContent = `Vicariate of ${vicName}`;
        mainContainer.appendChild(header);

        const vicContainer = document.createElement('div');
        vicContainer.className = 'vicariates';

        // Filter parishes for this vicariate and sort them alphabetically
        const filtered = Object.entries(data)
            .filter(([key, p]) => p.vicariate === vicName)
            .sort((a, b) => a[1].name.localeCompare(b[1].name));

        filtered.forEach(([key, parish]) => {
            const div = document.createElement('div');
            div.className = 'parish';
            div.innerHTML = `
                <div class="parish_image_holder">
                    <img src="${parish.church_image}" alt="${parish.name}">
                </div>
                <div class="parish_text_redirect">
                    <div class="parish_text">
                        <h2>${parish.name}</h2>
                        <h3>${parish.address}</h3>
                    </div>
                    <div class="parish_redirect">
                        <h5><a href="javascript:void(0)" onclick="zoomToParish('${key}', ${parish.coords[0]}, ${parish.coords[1]})">View on Map</a></h5>
                        <h5><a href="/parishes/${key}/info.html">Learn More</a></h5>
                    </div>
                </div>
            `;
            vicContainer.appendChild(div);
        });
        mainContainer.appendChild(vicContainer);
    });
}

function zoomToParish(key, lat, lng) {
    document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
    mapInstance.flyTo({ center: [lng, lat], zoom: 16, essential: true });
    
    setTimeout(() => {
        if (parishMarkers[key]) parishMarkers[key].togglePopup();
    }, 600);
}

// Inject dependencies and run
const injectMapDependencies = () => {
    const head = document.head;
    const maptilerJs = document.createElement('script');
    maptilerJs.src = 'https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.umd.js';
    const maptilerCss = document.createElement('link');
    maptilerCss.rel = 'stylesheet';
    maptilerCss.href = 'https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.css';
    head.appendChild(maptilerJs);
    head.appendChild(maptilerCss);
    maptilerJs.onload = () => generateMap();
};
injectMapDependencies();