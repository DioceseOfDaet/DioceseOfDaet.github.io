function generateMap(){
    // Initialize the map
    const map = new maptilersdk.Map({
        container: 'map',
        style: "019db912-cee9-723a-93e6-b89360815c9e",
        apiKey: "qqOC54zoRb8iFyHyyMOi",
        center: [122.62696, 14.11761],
        zoom: 9.1
    });

    // Helper function for URL slugs
    function formatName(str) {
    return str
        // 1. Decompose accented characters (ñ -> n + ~)
        .normalize("NFD")
        // 2. Remove the tilde/accents only
        .replace(/[\u0300-\u036f]/g, "")
        // 3. Handle camelCase (e.g., 'myInput-Field' -> 'my Input-Field')
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        // 4. Replace non-alphanumeric characters EXCEPT hyphens with spaces
        .replace(/[^a-zA-Z0-9-]/g, " ")
        // 5. Trim and convert to lowercase
        .trim()
        .toLowerCase()
        // 6. Replace one or more spaces with a single underscore
        .replace(/\s+/g, "_");
    }

    // 1. Fetch the parishes JSON
    fetch('/parishes.json')
        .then(response => {
            if (!response.ok) throw new Error("Parishes JSON not found");
            return response.json();
        })
        .then(data => {
            // Use Object.values() to convert the object into an array we can loop through
            Object.values(data).forEach(place => {
                
                // Create marker element
                const el = document.createElement('div');
                el.className = 'custom-marker';
                el.style.backgroundImage = `url(${place.marker_icon})`;
                el.style.width = '32px';
                el.style.height = '32px';
                el.style.backgroundSize = 'cover';
                el.style.cursor = 'pointer';

                // Handle coordinates (Flipping [Lat, Lng] to [Lng, Lat] for MapTiler)
                const flippedCoords = [...place.coords].reverse();

                // Initialize the Marker
                const marker = new maptilersdk.Marker({ element: el })
                    .setLngLat(flippedCoords)
                    .addTo(map);

                // Create Popup content
                const popupContent = document.createElement('div');
                popupContent.className = 'special_map_popup';
                
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

                // Add click event for the zoom button
                popupContent.querySelector('.zoom-btn').addEventListener('click', () => {
                    map.flyTo({
                        center: flippedCoords,
                        zoom: 16,
                        essential: true
                    });
                });

                marker.setPopup(new maptilersdk.Popup({ offset: 25 })
                    .setDOMContent(popupContent));
            });
        })
        .catch(err => console.error("Error loading parishes:", err));
        
    // 2. Handle GeoJSON Layer
    map.on('load', function() {
        fetch('/test/camarines_norte.json')
            .then(response => response.json())
            .then(data => {
                map.addSource('province', { 'type': 'geojson', 'data': data });

                map.addLayer({
                    'id': 'province-fill',
                    'type': 'fill',
                    'source': 'province',
                    'paint': {
                        'fill-color': '#ff7800',
                        'fill-opacity': 0.2
                    }
                });

                map.addLayer({
                    'id': 'province-outline',
                    'type': 'line',
                    'source': 'province',
                    'paint': {
                        'line-color': '#ff7800',
                        'line-width': 3
                    }
                });
            })
            .catch(err => console.error("Error loading GeoJSON:", err));
    });
};

const injectMapDependencies = () => {
  const head = document.head;

  // 1. MapTiler SDK JS
  const maptilerJs = document.createElement('script');
  maptilerJs.src = 'https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.umd.js';
  head.appendChild(maptilerJs);

  // 2. MapTiler SDK CSS
  const maptilerCss = document.createElement('link');
  maptilerCss.rel = 'stylesheet';
  maptilerCss.href = 'https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.css';
  head.appendChild(maptilerCss);

  // 3. Leaflet MapTiler SDK JS
  const leafletMaptilerJs = document.createElement('script');
  leafletMaptilerJs.src = 'https://cdn.maptiler.com/maptiler-leaflet-sdk/v2.0.0/leaflet-maptiler-sdk.js';
  head.appendChild(leafletMaptilerJs);

  // 4. Leaflet CSS
  const leafletCss = document.createElement('link');
  leafletCss.rel = 'stylesheet';
  leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  head.appendChild(leafletCss);

  maptilerJs.onload = () => {
  console.log("MapTiler SDK is ready!");
    // Initialize your map here or call the next script
    generateMap();
};
};

// Run the function
injectMapDependencies();