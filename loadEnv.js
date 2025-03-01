// filepath: /C:/Users/LENOVO/OneDrive/Desktop/Sahaya/Sahaya/loadEnv.js
document.addEventListener('DOMContentLoaded', () => {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDv0leB0g4StU2y-3aXhBpO0g0Bu-qhy34&libraries=places,directions&callback=initMap`;
    document.head.appendChild(googleMapsScript);
});