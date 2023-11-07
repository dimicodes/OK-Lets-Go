let eatBtn = document.getElementById("find-eat");
eatBtn.addEventListener("click", eat);

let drinkBtn = document.getElementById("find-drink");
drinkBtn.addEventListener("click", drink);

let playBtn = document.getElementById("find-play");
playBtn.addEventListener("click", play);

const apiKey = 'AIzaSyCRuea9PeF-8ihC4ipRNqzVhLZCGmUTwYw';
let radius = 1500;
let userLatitude, userLongitude, keyword, type, randomBusiness, randomBusinessName;
let map;
let service;

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
    keyword = "restaurant";
    type = "restaurant";
    fetchBusiness(keyword, userLatitude, userLongitude, radius, type);
}

function drink() {
    keyword = "bar";
    type = "bar";
    fetchBusiness(keyword, userLatitude, userLongitude, radius, type);
}

function play() {
    keyword = "entertainment";
    type = "entertainment";
    fetchBusiness(keyword, userLatitude, userLongitude, radius, type);
}

// Get user's location
function getLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLatitude = position.coords.latitude;
            userLongitude = position.coords.longitude;
            console.log("Latitude:", userLatitude, "Longitude:", userLongitude);
        },
        (error) => {
            console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 50000, maximumAge: 0 }
    );
}


function showBusinessPreview(business) {
    // Remove any existing preview container
    const existingPreview = document.getElementById('business-preview');
    if (existingPreview) {
        existingPreview.remove();
    }

    // Create the preview container
    const previewContainer = document.createElement('div');
    previewContainer.id = 'business-preview';
    previewContainer.style = 'position: fixed; bottom: 10px; left: 10px; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
    
    // Add business details to the preview
    const businessName = document.createElement('h2');
    businessName.textContent = business.name;
    previewContainer.appendChild(businessName);

    const businessRating = document.createElement('p');
    businessRating.textContent = `Rating: ${business.rating}`;
    previewContainer.appendChild(businessRating);

    // Check if the business has photos
    if (randomBusiness.photos && randomBusiness.photos.length > 0) {
        // Get the photo reference from the first photo in the array
        const photoReference = randomBusiness.photos[0].photo_reference;
        const maxWidth = 400; // or any other size you prefer
    
        // Construct the URL for the photo
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;
    
        // Use the URL for an <img> element or as a background for a div, etc.
        const businessPhoto = document.createElement('img');
        businessPhoto.src = photoUrl;
        businessPhoto.alt = randomBusiness.name;
        previewContainer.appendChild(businessPhoto);
    } else {
        // Handle the case where no photos are available
        console.log("No photos available for this business.");
    }


    // Add the "Let's Go" button
    const letsGoButton = document.createElement('button');
    letsGoButton.textContent = "Let's Go";
    letsGoButton.onclick = function() {
        // Open Google Maps with directions
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${randomBusinessName}`;
        window.open(directionsUrl, '_blank');
    };
    previewContainer.appendChild(letsGoButton);

    // Append the preview container to the body
    document.body.appendChild(previewContainer);
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
                showBusinessPreview(randomBusiness);

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