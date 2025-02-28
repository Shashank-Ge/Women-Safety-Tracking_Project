// DOM Elements
const locationText = document.getElementById('locationText');
const sosButton = document.getElementById('sosButton');
const shareLocationButton = document.getElementById('shareLocationButton');

// Route Planning Elements
let map, directionsService, directionsRenderer;
const startInput = document.getElementById('startInput');
const endInput = document.getElementById('endInput');
const getRouteButton = document.getElementById('getRouteButton');

// Initialize Geolocation and Map
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            // Update location display
            locationText.textContent = `Current Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            
            // Initialize map with current location
            initMap(latitude, longitude);
            
            // Set starting point input
            startInput.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        },
        (error) => {
            locationText.textContent = 'Error getting location';
            initMap(); // Fallback to default coordinates
        }
    );
} else {
    locationText.textContent = 'Geolocation is not supported by this browser.';
}

// SOS Emergency Functionality
sosButton.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            sendSOSAlert(latitude, longitude);
        },
        (error) => {
            alert('Error getting location');
        }
    );
});

function sendSOSAlert(latitude, longitude) {
    const emergencyContacts = ['1234567890', '0987654321']; // Replace with actual contacts
    const message = `SOS! I need help! My location: https://maps.google.com/?q=${latitude},${longitude}`;

    // Save alert to Firebase
    database.ref('alerts').push({
        latitude,
        longitude,
        message,
        timestamp: new Date().toISOString()
    }).then(() => {
        alert('SOS alert sent!');
    }).catch((error) => {
        alert('Error sending SOS alert');
    });
}

// Live Location Sharing
shareLocationButton.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            shareLiveLocation(latitude, longitude);
        },
        (error) => {
            alert('Error getting location');
        }
    );
});

function shareLiveLocation(latitude, longitude) {
    const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    alert(`Share this link with your contacts: ${locationLink}`);
}


// Safe Route Suggestions Feature
function initMap(lat = 12.9716, lng = 77.5946) { // Default coordinates
    map = new google.maps.Map(document.getElementById('mapContainer'), {
        center: { lat, lng },
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false,
        polylineOptions: {
            strokeColor: "#4285f4",
            strokeOpacity: 0.8,
            strokeWeight: 4
        }
    });

    // Initialize Autocomplete for destination input
    new google.maps.places.Autocomplete(endInput);
}

// Route Calculation Handler
getRouteButton.addEventListener('click', () => {
    const request = {
        origin: startInput.value,
        destination: endInput.value,
        travelMode: 'WALKING',
        provideRouteAlternatives: true,
        avoidFerries: true,
        avoidHighways: true
    };

    directionsService.route(request, (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
            showRouteOptions(response.routes);
        } else {
            alert('Route calculation failed: ' + status);
        }
    });
});

// Display Route Options with Safety Ratings
function showRouteOptions(routes) {
    const routeOptions = document.getElementById('routeOptions');
    routeOptions.innerHTML = '<h4>Safe Route Options:</h4>';
    
    routes.forEach((route, index) => {
        const { distance, duration } = route.legs[0];
        const routeDiv = document.createElement('div');
        routeDiv.className = 'route-option';
        routeDiv.innerHTML = `
            <div class="route-info">
                <strong>Route ${index + 1}</strong>
                <p>${distance.text} • ${duration.text}</p>
                <p class="safety-rating">Safety: ${calculateSafetyScore(route)}/5</p>
            </div>
            <button class="select-route-btn" onclick="selectRoute(${index})">Select</button>
        `;
        routeOptions.appendChild(routeDiv);
    });
}

// Safety Score Calculation (Simulated)
function calculateSafetyScore(route) {
    // Temporary simulation - replace with real data integration
    const baseScore = 5 - (route.legs[0].distance.value / 1000);
    return Math.min(5, Math.max(3, Math.floor(baseScore + Math.random())));
}

// Route Selection Handler
function selectRoute(routeIndex) {
    alert(`Route ${routeIndex + 1} selected! Starting navigation...`);
    // Add navigation logic here
}
=======
document.head.innerHTML += '<link rel="icon" type="image/png" href="logo.png">';

