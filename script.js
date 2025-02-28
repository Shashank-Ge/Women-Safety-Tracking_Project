// // DOM Elements
// const locationText = document.getElementById('locationText');
// const sosButton = document.getElementById('sosButton');
// const shareLocationButton = document.getElementById('shareLocationButton');

// // Route Planning Elements
// let map, directionsService, directionsRenderer;
// const startInput = document.getElementById('startInput');
// const endInput = document.getElementById('endInput');
// const getRouteButton = document.getElementById('getRouteButton');

// // Initialize Geolocation and Map
// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//         (position) => {
//             const latitude = position.coords.latitude;
//             const longitude = position.coords.longitude;
            
//             // Update location display
//             locationText.textContent = `Current Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            
//             // Initialize map with current location
//             initMap(latitude, longitude);
            
//             // Set starting point input
//             startInput.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
//         },
//         (error) => {
//             locationText.textContent = 'Error getting location';
//             initMap(); // Fallback to default coordinates
//         }
//     );
// } else {
//     locationText.textContent = 'Geolocation is not supported by this browser.';
// }

// // SOS Emergency Functionality
// sosButton.addEventListener('click', () => {
//     navigator.geolocation.getCurrentPosition(
//         (position) => {
//             const latitude = position.coords.latitude;
//             const longitude = position.coords.longitude;
//             sendSOSAlert(latitude, longitude);
//         },
//         (error) => {
//             alert('Error getting location');
//         }
//     );
// });

// function sendSOSAlert(latitude, longitude) {
//     const emergencyContacts = ['1234567890', '0987654321']; // Replace with actual contacts
//     const message = `SOS! I need help! My location: https://maps.google.com/?q=${latitude},${longitude}`;

//     // Save alert to Firebase
//     database.ref('alerts').push({
//         latitude,
//         longitude,
//         message,
//         timestamp: new Date().toISOString()
//     }).then(() => {
//         alert('SOS alert sent!');
//     }).catch((error) => {
//         alert('Error sending SOS alert');
//     });
// }

// // Live Location Sharing
// shareLocationButton.addEventListener('click', () => {
//     navigator.geolocation.getCurrentPosition(
//         (position) => {
//             const latitude = position.coords.latitude;
//             const longitude = position.coords.longitude;
//             shareLiveLocation(latitude, longitude);
//         },
//         (error) => {
//             alert('Error getting location');
//         }
//     );
// });

// function shareLiveLocation(latitude, longitude) {
//     const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
//     alert(`Share this link with your contacts: ${locationLink}`);
// }


// // Safe Route Suggestions Feature
// function initMap(lat = 12.9716, lng = 77.5946) { // Default coordinates
//     map = new google.maps.Map(document.getElementById('mapContainer'), {
//         center: { lat, lng },
//         zoom: 14,
//         mapTypeControl: false,
//         streetViewControl: false
//     });

//     directionsService = new google.maps.DirectionsService();
//     directionsRenderer = new google.maps.DirectionsRenderer({
//         map: map,
//         suppressMarkers: false,
//         polylineOptions: {
//             strokeColor: "#4285f4",
//             strokeOpacity: 0.8,
//             strokeWeight: 4
//         }
//     });

//     // Initialize Autocomplete for destination input
//     new google.maps.places.Autocomplete(endInput);
// }

// // Route Calculation Handler
// getRouteButton.addEventListener('click', () => {
//     const request = {
//         origin: startInput.value,
//         destination: endInput.value,
//         travelMode: 'WALKING',
//         provideRouteAlternatives: true,
//         avoidFerries: true,
//         avoidHighways: true
//     };

//     directionsService.route(request, (response, status) => {
//         if (status === 'OK') {
//             directionsRenderer.setDirections(response);
//             showRouteOptions(response.routes);
//         } else {
//             alert('Route calculation failed: ' + status);
//         }
//     });
// });

// // Display Route Options with Safety Ratings
// function showRouteOptions(routes) {
//     const routeOptions = document.getElementById('routeOptions');
//     routeOptions.innerHTML = '<h4>Safe Route Options:</h4>';
    
//     routes.forEach((route, index) => {
//         const { distance, duration } = route.legs[0];
//         const routeDiv = document.createElement('div');
//         routeDiv.className = 'route-option';
//         routeDiv.innerHTML = `
//             <div class="route-info">
//                 <strong>Route ${index + 1}</strong>
//                 <p>${distance.text} • ${duration.text}</p>
//                 <p class="safety-rating">Safety: ${calculateSafetyScore(route)}/5</p>
//             </div>
//             <button class="select-route-btn" onclick="selectRoute(${index})">Select</button>
//         `;
//         routeOptions.appendChild(routeDiv);
//     });
// }

// // Safety Score Calculation (Simulated)
// function calculateSafetyScore(route) {
//     // Temporary simulation - replace with real data integration
//     const baseScore = 5 - (route.legs[0].distance.value / 1000);
//     return Math.min(5, Math.max(3, Math.floor(baseScore + Math.random())));
// }

// // Route Selection Handler
// function selectRoute(routeIndex) {
//     alert(`Route ${routeIndex + 1} selected! Starting navigation...`);
//     // Add navigation logic here
// }
// document.head.innerHTML += '<link rel="icon" type="image/png" href="logo.png">';


// DOM Elements
const locationText = document.getElementById('locationText');
const sosButton = document.getElementById('sosButton');
const shareLocationButton = document.getElementById('shareLocationButton');

// Route Planning Elements
let map, directionsService, directionsRenderer;
const startInput = document.getElementById('startInput');
const endInput = document.getElementById('endInput');
const getRouteButton = document.getElementById('getRouteButton');

// Navigation Elements
const navigationPanel = document.getElementById('navigationPanel');
const navigationInstructions = document.getElementById('navigationInstructions');
const nextStepButton = document.getElementById('nextStepButton');
const exitNavButton = document.getElementById('exitNavButton');
let currentRoute = null;
let currentStep = 0;
let navigationWatchId = null;

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
    const routes = directionsRenderer.getDirections().routes;
    currentRoute = routes[routeIndex];
    startNavigation(currentRoute);
}

// New Navigation Functions
function startNavigation(route) {
    // Hide route options and show navigation panel
    document.getElementById('routeOptions').style.display = 'none';
    navigationPanel.style.display = 'block';
    
    // Reset navigation state
    currentStep = 0;
    
    // Display the first instruction
    const steps = route.legs[0].steps;
    displayNavigationStep(steps[currentStep]);
    
    // Start location tracking for navigation
    startLocationTracking();
    
    // Update map to focus on current location and route
    map.setZoom(18);
    
    // Add event listeners for navigation controls
    nextStepButton.addEventListener('click', goToNextStep);
    exitNavButton.addEventListener('click', exitNavigation);
}

function displayNavigationStep(step) {
    // Strip HTML from Google's instructions
    const instruction = step.instructions.replace(/<[^>]*>/g, '');
    
    navigationInstructions.innerHTML = `
        <div class="current-instruction">
            <h4>Current Step</h4>
            <p>${instruction}</p>
            <p class="distance-info">${step.distance.text}</p>
        </div>
    `;
    
    // If there's a next step, show preview
    const steps = currentRoute.legs[0].steps;
    if (currentStep < steps.length - 1) {
        const nextInstruction = steps[currentStep + 1].instructions.replace(/<[^>]*>/g, '');
        navigationInstructions.innerHTML += `
            <div class="next-instruction">
                <h5>Next Step</h5>
                <p>${nextInstruction}</p>
            </div>
        `;
    }
    
    // Update progress indicator
    const progress = ((currentStep + 1) / steps.length) * 100;
    navigationInstructions.innerHTML += `
        <div class="progress-bar">
            <div class="progress" style="width: ${progress}%"></div>
        </div>
        <p class="step-counter">Step ${currentStep + 1} of ${steps.length}</p>
    `;
}

function goToNextStep() {
    const steps = currentRoute.legs[0].steps;
    
    if (currentStep < steps.length - 1) {
        currentStep++;
        displayNavigationStep(steps[currentStep]);
        
        // Center map on the new step
        const newPosition = steps[currentStep].start_location;
        map.panTo(newPosition);
    } else {
        // Reached destination
        navigationInstructions.innerHTML = `
            <div class="destination-reached">
                <h3>You've reached your destination!</h3>
                <p>Journey completed safely.</p>
            </div>
        `;
        
        // Stop tracking location
        stopLocationTracking();
    }
}

function startLocationTracking() {
    // Check if we already have a watch ID to avoid duplicate watches
    if (navigationWatchId !== null) {
        navigator.geolocation.clearWatch(navigationWatchId);
    }
    
    // Start watching position with high accuracy
    navigationWatchId = navigator.geolocation.watchPosition(
        (position) => {
            const currentPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            // Update current position marker
            updatePositionMarker(currentPosition);
            
            // Check if user is on route or needs recalculation
            checkRouteProgress(currentPosition);
        },
        (error) => {
            console.error("Error tracking location:", error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        }
    );
}

// Current position marker
let positionMarker = null;

function updatePositionMarker(position) {
    if (!positionMarker) {
        // Create marker if it doesn't exist
        positionMarker = new google.maps.Marker({
            position: position,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2
            },
            title: "Your Location"
        });
    } else {
        // Update existing marker
        positionMarker.setPosition(position);
    }
    
    // Center map on current position
    map.panTo(position);
}

function checkRouteProgress(currentPosition) {
    if (!currentRoute) return;
    
    const steps = currentRoute.legs[0].steps;
    const currentStep = steps[currentStep];
    const endPoint = steps[currentStep].end_location;
    
    // Calculate distance to current step endpoint
    const distance = calculateDistance(
        currentPosition.lat, 
        currentPosition.lng,
        endPoint.lat(),
        endPoint.lng()
    );
    
    // If within 20 meters of the end of current step, go to next step
    if (distance < 20) {
        goToNextStep();
    }
    
    // Check if significantly off route (more than 50 meters)
    const pathPoint = findClosestPointOnPath(currentPosition);
    const distanceFromPath = calculateDistance(
        currentPosition.lat,
        currentPosition.lng,
        pathPoint.lat,
        pathPoint.lng
    );
    
    if (distanceFromPath > 50) {
        // Offer route recalculation
        if (confirm("You appear to be off route. Would you like to recalculate?")) {
            recalculateRoute(currentPosition);
        }
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula to calculate distance between two points
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
}

function findClosestPointOnPath(position) {
    // Simplified implementation - would be better with actual route polyline points
    const steps = currentRoute.legs[0].steps;
    let closestPoint = steps[0].start_location;
    let minDistance = Number.MAX_VALUE;
    
    // Check all steps for closest point
    steps.forEach(step => {
        const startDist = calculateDistance(
            position.lat, position.lng,
            step.start_location.lat(), step.start_location.lng()
        );
        
        const endDist = calculateDistance(
            position.lat, position.lng,
            step.end_location.lat(), step.end_location.lng()
        );
        
        if (startDist < minDistance) {
            minDistance = startDist;
            closestPoint = {
                lat: step.start_location.lat(),
                lng: step.start_location.lng()
            };
        }
        
        if (endDist < minDistance) {
            minDistance = endDist;
            closestPoint = {
                lat: step.end_location.lat(),
                lng: step.end_location.lng()
            };
        }
    });
    
    return closestPoint;
}

function recalculateRoute(currentPosition) {
    // Use current position as new starting point
    startInput.value = `${currentPosition.lat}, ${currentPosition.lng}`;
    
    // Keep the same destination
    const destination = currentRoute.legs[0].end_address;
    
    // Calculate new route
    const request = {
        origin: startInput.value,
        destination: destination,
        travelMode: 'WALKING',
        provideRouteAlternatives: true,
        avoidFerries: true,
        avoidHighways: true
    };

    directionsService.route(request, (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
            currentRoute = response.routes[0];
            currentStep = 0;
            displayNavigationStep(currentRoute.legs[0].steps[currentStep]);
        } else {
            alert('Route recalculation failed: ' + status);
        }
    });
}

function stopLocationTracking() {
    if (navigationWatchId !== null) {
        navigator.geolocation.clearWatch(navigationWatchId);
        navigationWatchId = null;
    }
}

function exitNavigation() {
    // Stop tracking location
    stopLocationTracking();
    
    // Hide navigation panel and show route options
    navigationPanel.style.display = 'none';
    document.getElementById('routeOptions').style.display = 'block';
    
    // Reset map zoom and center
    map.setZoom(14);
    directionsRenderer.setDirections(directionsRenderer.getDirections());
    
    // Remove navigation event listeners
    nextStepButton.removeEventListener('click', goToNextStep);
    exitNavButton.removeEventListener('click', exitNavigation);
}

document.head.innerHTML += '<link rel="icon" type="image/png" href="logo.png">';