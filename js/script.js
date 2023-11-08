let eatBtn = document.getElementById("find-eat");
eatBtn.addEventListener("click", eat);

let drinkBtn = document.getElementById("find-drink");
drinkBtn.addEventListener("click", drink);

let playBtn = document.getElementById("find-play");
playBtn.addEventListener("click", play);

const apiKey = 'AIzaSyCRuea9PeF-8ihC4ipRNqzVhLZCGmUTwYw';
let radius = 1000;
let userLatitude, userLongitude, keyword, type, randomBusiness, randomBusinessName;
let map;
let service;
let locationRetrieved = false;


function initMap() {
    // Initialize map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15
    });

    // Initialize the Places service
    service = new google.maps.places.PlacesService(map);

    // Call getLocation to get the user's location
    getLocation();
}

// Button-click functions
function eat() {
    if (!locationRetrieved) {
        console.error("Location not retrieved yet.");
        return; // Exit the function if the location has not been retrieved
    }
    keyword = "restaurant";
    type = "restaurant";
    fetchBusiness(keyword, userLatitude, userLongitude, radius, type);
}

function drink() {
    if (!locationRetrieved) {
        console.error("Location not retrieved yet.");
        return; // Exit the function if the location has not been retrieved
    }
    keyword = "bar";
    type = "bar";
    fetchBusiness(keyword, userLatitude, userLongitude, radius, type);
}

function play() {
    if (!locationRetrieved) {
        console.error("Location not retrieved yet.");
        return; // Exit the function if the location has not been retrieved
    }
    keyword = "";
    const typeList = ['amusement_park', 'aquarium', 'bowling_alley', 'casino', 'zoo', 'tourist_attraction', 'museum'];
    const randomIndex = Math.floor(Math.random() * typeList.length);
    type = typeList[randomIndex];
    fetchBusiness(keyword, userLatitude, userLongitude, radius, type);
}

// Get user's location
function getLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLatitude = position.coords.latitude;
            userLongitude = position.coords.longitude;
            locationRetrieved = true;
            console.log("Latitude:", userLatitude, "Longitude:", userLongitude);
        },
        (error) => {
            console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 50000, maximumAge: 0 }
    );
}


function fetchBusiness(keyword, latitude, longitude, radius, type) {
    const request = {
        location: new google.maps.LatLng(latitude, longitude),
        radius: radius,
        type: [type],
        keyword: keyword
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const filteredBusinesses = filterBusinesses(results);
            if (filteredBusinesses.length) {
                const randomIndex = Math.floor(Math.random() * filteredBusinesses.length);
                const randomBusiness = filteredBusinesses[randomIndex];
                console.log("Random Business Selected: ", randomBusiness);
                randomBusinessName = randomBusiness.name;
                // Open Google Maps with directions
                const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${randomBusinessName}`;
                window.open(directionsUrl, '_blank');

            } else {
                console.log("No businesses found matching the criteria.");
            }
        } else {
            console.error('Place search failed due to:', status);
        }
    });
}

function filterBusinesses(businesses) {
    return businesses.filter(business =>
        business.rating >= 4.5 &&
        business.user_ratings_total >= 500 &&
        (!business.price_level || (business.price_level <= 2))

        // Note: 'open_now' property might not be available due to the Places API changes
    );
}
