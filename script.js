const locationText = document.getElementById('locationText');
const sosButton = document.getElementById('sosButton');
const shareLocationButton = document.getElementById('shareLocationButton');


// Route Planning Variables
let map, directionsService, directionsRenderer;
const startInput = document.getElementById('startInput');
const endInput = document.getElementById('endInput');
const getRouteButton = document.getElementById('getRouteButton');



if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            locationText.textContent = `Current Location: ${latitude}, ${longitude}`;
        },
        (error) => {
            locationText.textContent = 'Error getting location';
        }
    );
} else {
    locationText.textContent = 'Geolocation is not supported by this browser.';
}


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

    // Save the alert to Firebase Realtime Database
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