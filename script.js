
const locationText = document.getElementById('locationText');
const sosButton = document.getElementById('sosButton');
const shareLocationButton = document.getElementById('shareLocationButton');

// Map Elements
let map, directionsService, directionsRenderer;
let currentLocationMarker = null;
let navigationPositionMarker = null;

// Route Planning Elements
const startInput = document.getElementById('startInput');
const endInput = document.getElementById('endInput');
const getRouteButton = document.getElementById('getRouteButton');

// Travel Mode Elements
const travelModeButtons = document.querySelectorAll('.travel-mode-btn');
let currentTravelMode = 'WALKING';

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
        position => initializeApp(position),
        error => handleGeoError(error)
    );
} else {
    locationText.textContent = 'Geolocation not supported';
}

function initializeApp(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    locationText.textContent = `Current Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    initMap(latitude, longitude);
    startInput.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

    // Create current location marker
    currentLocationMarker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: "Your Current Location",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2
        },
        animation: google.maps.Animation.DROP
    });
}

function handleGeoError(error) {
    locationText.textContent = 'Error getting location';
    initMap();
}

function initMap(lat = 12.9716, lng = 77.5946) {
    map = new google.maps.Map(document.getElementById('mapContainer'), {
        center: { lat, lng },
        zoom: 14,
        mapTypeControl: true,
        streetViewControl: false,
        mapTypeId: 'roadmap'
    });

    // Default location marker
    if (lat === 12.9716 && lng === 77.5946) {
        currentLocationMarker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: "Default Location",
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#EA4335",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2
            }
        });
    }

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: false,
        polylineOptions: {
            strokeColor: "#4285f4",
            strokeOpacity: 0.8,
            strokeWeight: 4
        }
    });

    new google.maps.places.Autocomplete(endInput, {
        types: ['geocode'],
        componentRestrictions: { country: 'in' }
    });
}

// SOS Functionality
let sosTimeout;
sosButton.addEventListener('mousedown', () => {
    sosTimeout = setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
            position => sendSOSAlert(position.coords.latitude, position.coords.longitude),
            error => alert('Error getting location')
        );
    }, 3000);
});

sosButton.addEventListener('mouseup', () => clearTimeout(sosTimeout));

function sendSOSAlert(lat, lng) {
    database.ref('alerts').push({
        latitude: lat,
        longitude: lng,
        timestamp: new Date().toISOString()
    }).then(() => alert('SOS sent!'))
      .catch(() => alert('SOS failed'));
}

// Live Location Sharing
shareLocationButton.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
        position => shareLiveLocation(position.coords.latitude, position.coords.longitude),
        error => alert('Location error')
    );
});

function shareLiveLocation(lat, lng) {
    const link = `https://maps.google.com/?q=${lat},${lng}`;
    alert(`Share this link: ${link}\nLocation will update every 60 seconds`);
}

// Route Calculation and Display
getRouteButton.addEventListener('click', calculateRoute);

function calculateRoute() {
    const request = {
        origin: startInput.value,
        destination: endInput.value,
        travelMode: currentTravelMode,
        provideRouteAlternatives: true,
        unitSystem: google.maps.UnitSystem.METRIC
    };

    directionsService.route(request, (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
            showRouteOptions(response.routes);
            if(currentTravelMode === 'DRIVING') addTrafficLayer();
        } else {
            alert(`Route failed: ${status}`);
        }
    });
}

function showRouteOptions(routes) {
    const routeOptions = document.getElementById('routeOptions');
    routeOptions.innerHTML = `
        <h4>${currentTravelMode} Routes:</h4>
        <div class="route-header">
            <span>Distance</span>
            <span>Duration</span>
            <span>Safety</span>
            <span>Select</span>
        </div>
    `;

    routes.forEach((route, index) => {
        const { distance, duration } = route.legs[0];
        const routeDiv = document.createElement('div');
        routeDiv.className = 'route-option';
        routeDiv.innerHTML = `
            <div class="route-info">
                <span>${distance.text}</span>
                <span>${duration.text}</span>
                <span class="safety-rating">${calculateSafetyScore(route)}/5</span>
                <button class="select-route-btn" onclick="selectRoute(${index})">
                    <i class="fas fa-route"></i>
                </button>
            </div>
        `;
        routeOptions.appendChild(routeDiv);
    });
}

function calculateSafetyScore(route) {
    const modeFactors = {
        WALKING: { distance: 0.4, lighting: 0.4, traffic: 0.2 },
        DRIVING: { distance: 0.2, traffic: 0.6, complexity: 0.2 },
        TRANSIT: { distance: 0.25, transfers: 0.5, crowd: 0.25 }
    };
    
    const factors = modeFactors[currentTravelMode];
    let score = 5 - (route.legs[0].distance.value / 1000 * factors.distance);
    score += Math.random() * 0.5;
    return Math.min(5, Math.max(2, Math.floor(score)));
}

// Navigation Functions
function selectRoute(index) {
    currentRoute = directionsRenderer.getDirections().routes[index];
    startNavigation(currentRoute);
}

function startNavigation(route) {
    document.getElementById('routeOptions').style.display = 'none';
    navigationPanel.style.display = 'block';
    currentStep = 0;
    currentRoute = route;
    
    if(currentLocationMarker) currentLocationMarker.setMap(null);
    
    startLocationTracking();
    displayNavigationStep(currentRoute.legs[0].steps[currentStep]);
    map.setZoom(18);
    
    nextStepButton.onclick = goToNextStep;
    exitNavButton.onclick = exitNavigation;
}

function displayNavigationStep(step) {
    const instruction = step.instructions.replace(/<[^>]*>/g, '');
    navigationInstructions.innerHTML = `
        <div class="current-instruction">
            <h4>Step ${currentStep + 1}</h4>
            <p>${instruction}</p>
            <p class="distance-info">${step.distance.text}</p>
        </div>
    `;

    if(currentStep < currentRoute.legs[0].steps.length - 1) {
        const nextStep = currentRoute.legs[0].steps[currentStep + 1].instructions.replace(/<[^>]*>/g, '');
        navigationInstructions.innerHTML += `
            <div class="next-instruction">
                <h5>Next:</h5>
                <p>${nextStep}</p>
            </div>
        `;
    }
}

function goToNextStep() {
    const steps = currentRoute.legs[0].steps;
    
    if (currentStep < steps.length - 1) {
        currentStep++;
        displayNavigationStep(steps[currentStep]);
        const newPosition = steps[currentStep].start_location;
        map.panTo(newPosition);
    } else {
        navigationInstructions.innerHTML = `
            <div class="destination-reached">
                <h3>Destination Reached!</h3>
                <p>You've arrived safely</p>
            </div>
        `;
        stopLocationTracking();
    }
}

function checkRouteProgress(position) {
    if (!currentRoute) return;

    const steps = currentRoute.legs[0].steps;
    const currentStepEnd = steps[currentStep].end_location;
    
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(position.lat, position.lng),
        currentStepEnd
    );

    if (distance < 20) goToNextStep();
}

// Location Tracking
function startLocationTracking() {
    if(navigationWatchId) navigator.geolocation.clearWatch(navigationWatchId);
    
    navigationWatchId = navigator.geolocation.watchPosition(
        position => updatePosition(position),
        error => console.error("Tracking error:", error),
        { enableHighAccuracy: true }
    );
}

function updatePosition(position) {
    const pos = { 
        lat: position.coords.latitude, 
        lng: position.coords.longitude 
    };
    
    if(!navigationPositionMarker) {
        navigationPositionMarker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#34A853",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2
            }
        });
    } else {
        navigationPositionMarker.setPosition(pos);
    }
    
    map.panTo(pos);
    checkRouteProgress(pos);
}

function exitNavigation() {
    stopLocationTracking();
    navigationPanel.style.display = 'none';
    document.getElementById('routeOptions').style.display = 'block';
    map.setZoom(14);
    
    if(currentLocationMarker) currentLocationMarker.setMap(map);
    if(navigationPositionMarker) {
        navigationPositionMarker.setMap(null);
        navigationPositionMarker = null;
    }
    
    currentRoute = null;
    currentStep = 0;
    
    nextStepButton.onclick = null;
    exitNavButton.onclick = null;
}

function stopLocationTracking() {
    if (navigationWatchId !== null) {
        navigator.geolocation.clearWatch(navigationWatchId);
        navigationWatchId = null;
    }
}

// Helper Functions
function addTrafficLayer() {
    new google.maps.TrafficLayer().setMap(map);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Travel Mode Handling
travelModeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        travelModeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTravelMode = btn.dataset.mode;
        if(endInput.value) calculateRoute();
    });
});


// Emergency Call
function makeEmergencyCall() {
    const policeNumber = '100'; // Replace with the local police emergency number
    emergencyCallLink.href = `tel:${policeNumber}`;
    emergencyCallLink.click();
    alert('Calling the nearest police station...');
}
 
// Auto Video Recording
async function startRecording() {
    try {
        // Request both video and audio permissions
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoPreview.srcObject = stream;

        // Initialize MediaRecorder with both video and audio tracks
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9,opus' });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            await uploadRecording(blob); // Upload the recording to the server
            recordedChunks = []; // Clear recorded chunks for the next recording
        };

        mediaRecorder.start();
        recordingStatus.textContent = 'Recording: On (Video + Audio)';
        alert('Recording started with audio!');
    } catch (error) {
        console.error('Error accessing camera or microphone:', error);
        alert('Error accessing camera or microphone. Please allow permissions.');
    }
}

// Stop Recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        recordingStatus.textContent = 'Recording: Off';
        alert('Recording stopped!');
        audioPreview.style.display = 'none'; // Hide audio preview
    }
}

// Upload Recording to Server
async function uploadRecording(blob) {
    const formData = new FormData();
    formData.append('video', blob, 'emergency-recording.webm');

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Recording uploaded successfully!');
        } else {
            alert('Error uploading recording.');
        }
    } catch (error) {
        console.error('Error uploading recording:', error);
        alert('Error uploading recording.');
    }
}

// Trigger Emergency
function triggerEmergency() {
    startRecording();
    makeEmergencyCall();
    document.getElementById('emergencyButton').style.display = 'none'; // Hide Emergency Button
    document.getElementById('stopRecordingButton').style.display = 'block'; // Show Stop Recording Button
}

// Stop Recording Button
stopRecordingButton.addEventListener('click', () => {
    stopRecording();
    document.getElementById('stopRecordingButton').style.display = 'none'; // Hide Stop Recording Button
    document.getElementById('emergencyButton').style.display = 'block'; // Show Emergency Button
});

// Add event listener to the emergency button
emergencyButton.addEventListener('click', triggerEmergency);

let recordingStartTime; // To store the start time of recording
let timerInterval; // To store the interval for updating the timer


function startTimer() {
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - recordingStartTime) / 1000); // Calculate elapsed time in seconds
        const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0'); // Format minutes
        const seconds = (elapsedTime % 60).toString().padStart(2, '0'); // Format seconds
        recordingStatus.textContent = `Recording: On (${minutes}:${seconds})`; // Update the timer display
    }, 1000); // Update every second
}


// Initialize
window.initMap = initMap;
