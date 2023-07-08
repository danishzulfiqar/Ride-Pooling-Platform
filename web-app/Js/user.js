auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.replace('../Html/login.html?#');
        firebase.initializeApp(firebaseConfig);
    }

    else {
        localStorage.setItem("UserId", user.uid);
    }
})

function signout() {
    auth.signOut();
}

const UserId = localStorage.getItem("UserId");
console.log(UserId);

function SaveUserData(Data){
    var jsonData = JSON.stringify(Data.val());  
    localStorage.setItem("UserData", jsonData);
}

function getUserDataAsObject() {
    var UserData = localStorage.getItem("UserData");
    return JSON.parse(UserData);
}

firebase.database().ref('users/' + UserId).on("value", snap => {
    console.log(snap.val().full_name + "(found)");

    GetUserData(snap);
    SaveUserData(snap);
})

function GetUserData(data) {
    var UserName = data.val().first_name;
    const loaderContainer = document.getElementById('loader-container');

    console.log(UserName);

    var NavUserName = document.getElementById("User-Name");
    NavUserName.innerHTML = UserName;

    // For Loader
    loaderContainer.style.opacity = '0';
    loaderContainer.style.visibility = 'hidden';
}

var map;
var UserLocationMarker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new google.maps.LatLng(33.6844, 73.0379),
        streetViewControl: false,
        styles:
            [
                {
                    "featureType": "administrative",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#d6e2e6"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#cfd4d5"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#7492a8"
                        }
                    ]
                },
                {
                    "featureType": "administrative.neighborhood",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "lightness": 25
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#dde2e3"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#cfd4d5"
                        }
                    ]
                },
                {
                    "featureType": "landscape.natural",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#dde2e3"
                        }
                    ]
                },
                {
                    "featureType": "landscape.natural",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#7492a8"
                        }
                    ]
                },
                {
                    "featureType": "landscape.natural.terrain",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#dde2e3"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#588ca4"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "saturation": -100
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#a9de83"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#bae6a1"
                        }
                    ]
                },
                {
                    "featureType": "poi.sports_complex",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#c6e8b3"
                        }
                    ]
                },
                {
                    "featureType": "poi.sports_complex",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#bae6a1"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#41626b"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "saturation": -45
                        },
                        {
                            "lightness": 10
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#c1d1d6"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#a6b5bb"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#9fb6bd"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "saturation": -70
                        }
                    ]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#b4cbd4"
                        }
                    ]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#588ca4"
                        }
                    ]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#008cb5"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.airport",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": -5
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#a6cbe3"
                        }
                    ]
                }
            ]

    });

    var SearchPickUp = new google.maps.places.SearchBox(document.getElementById('SearchPickUp'));
    var SearchDropOff = new google.maps.places.SearchBox(document.getElementById('SearchDropOff'));

    google.maps.event.addListener(SearchPickUp, 'places_changed', function () {

        var places = SearchPickUp.getPlaces();
        var bounds = new google.maps.LatLngBounds();
        var i, place;

        for (i = 0; place = places[i]; i++) {
            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
        map.setZoom(15);
        ConfirmRide();

    });

    google.maps.event.addListener(SearchDropOff, 'places_changed', function () {

        var places = SearchDropOff.getPlaces();
        var bounds = new google.maps.LatLngBounds();
        var i, place;

        for (i = 0; place = places[i]; i++) {
            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
        map.setZoom(15);
        ConfirmRide();

    });

    var dropicon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5.5,
        fillColor: "white",
        fillOpacity: 1,
        strokeColor: "#246EF0",
        strokeWeight: 6,
        anchor: new google.maps.Point(0, 0),
        rotation: 0
    };

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            map.panTo(latLng);

            UserLocationMarker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: dropicon,
            });

        }, function (error) {
            // window.alert("Error getting current location: " + error.message);
        });
    } else {

    }

}

function ClearPickUpValue() {
    var clearBtn = document.getElementById("clearPick")

    // clearBtn.style.visibility = (document.getElementById('SearchPickUp').value.length) ? "visible" : "hidden";

    if (document.getElementById('SearchPickUp').value.length) {
        clearBtn.style.visibility = "visible";
    }

    else {
        clearBtn.style.visibility = "hidden";
        ConfirmRide();
        initMap();
    }

    clearBtn.onclick = function () {
        this.style.visibility = "hidden";
        document.getElementById('SearchPickUp').value = "";
        ConfirmRide();
        initMap();
    };

}

function ClearDropOffValue() {
    var clearBtn = document.getElementById("clearDrop")

    // clearBtn.style.visibility = (document.getElementById('SearchDropOff').value.length) ? "visible" : "hidden";

    if (document.getElementById('SearchDropOff').value.length) {
        clearBtn.style.visibility = "visible";
    }

    else {
        clearBtn.style.visibility = "hidden";
        ConfirmRide();
        initMap();
    }

    clearBtn.onclick = function () {
        this.style.visibility = "hidden";
        document.getElementById('SearchDropOff').value = "";
        ConfirmRide();
        initMap();
    };
}


let directionsRenderer;
let markers = [];

function calculateRoute() {

    const pickup = document.getElementById('SearchPickUp').value;
    const dropoff = document.getElementById('SearchDropOff').value;

    const directionsService = new google.maps.DirectionsService();

    if (!directionsRenderer) {
        // directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#000000',
                strokeOpacity: 0.8,
                strokeWeight: 5
            }
        });
        directionsRenderer.setMap(map);
    }

    markers.forEach(marker => marker.setMap(null));
    markers = [];

    directionsRenderer.setDirections({ routes: [] });

    const request = {
        origin: pickup,
        destination: dropoff,
        travelMode: google.maps.TravelMode.DRIVING
    };

    var dropicon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        fillColor: "yellow",
        fillOpacity: 1,
        strokeWeight: 5,
        anchor: new google.maps.Point(0, 0),
        rotation: 0
    };

    var pickicon = {
        url: "http://labs.google.com/ridefinder/images/mm_20_black.png",
        scale: 5,
    }


    directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {

            directionsRenderer.setDirections(result);

            const pickupMarker = new google.maps.Marker({
                position: result.routes[0].legs[0].start_location,
                map: map,
                icon: dropicon,
            });
            const dropoffMarker = new google.maps.Marker({
                position: result.routes[0].legs[0].end_location,
                map: map,
                icon: dropicon,
            });

            markers.push(pickupMarker);
            markers.push(dropoffMarker);

            map.panTo(result.routes[0].legs[0].start_location);
            map.setZoom(13);

            if (status === 'OK') {

                directionsRenderer.setDirections(result);
                directionsRenderer.setMap(map);
                map.panTo(result.routes[0].legs[0].start_location);
                // map.setZoom(13);

                const distance = result.routes[0].legs[0].distance.text;
                const duration = result.routes[0].legs[0].duration.text;

                document.getElementById('Distance').textContent = distance;
                document.getElementById('Duration').textContent = duration + " by drive";

                console.log(distance + " " + duration);

            } else {

                // window.alert('Directions request failed due to ' + status);
            }

        } else {
            //   window.alert('Directions request failed due to ' + status);
        }
    });
}


function PickandDropToggle() {
    var pickupInput = document.getElementById('SearchPickUp');
    var dropoffInput = document.getElementById('SearchDropOff');

    pickupInput.addEventListener('focus', () => {
        document.getElementById("PickData").style.border = '2px solid black';
    });
    pickupInput.addEventListener('blur', () => {
        document.getElementById("PickData").style.border = 'none';
    });

    dropoffInput.addEventListener('focus', () => {
        document.getElementById("DropData").style.border = '2px solid black';
    });
    dropoffInput.addEventListener('blur', () => {
        document.getElementById("DropData").style.border = 'none';
    });

}


function ConfirmRide() {
    var pickup = document.getElementById('SearchPickUp').value;
    var dropoff = document.getElementById('SearchDropOff').value;
    var confirmbtn = document.getElementById("ConfirmBtn");
    var RouteData = document.getElementById("Rout-Data-Div");

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: pickup }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            geocoder.geocode({ address: dropoff }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {

                    confirmbtn.style.display = "block";
                    RouteData.style.display = "flex";
                    calculateRoute();

                } else {
                    // window.alert('Invalid dropoff location');
                    confirmbtn.style.display = "none";
                    RouteData.style.display = "none";

                }
            });
        } else {
            // window.alert('Invalid pickup location');
            confirmbtn.style.display = "none";
            RouteData.style.display = "none";
        }
    });
}


function StartfromCurrentLocation() {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            const geocoder = new google.maps.Geocoder();

            geocoder.geocode({ location: latLng }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {

                    const streetNumber = results[0].address_components.find(component => component.types.includes("street_number"));

                    const StartPoint = document.getElementById("SearchPickUp");
                    StartPoint.value = results[0].formatted_address;
                    ClearPickUpValue();

                    map.panTo(latLng);
                    map.setZoom(15);
                    ConfirmRide();

                } else {
                    window.alert("Geocoder failed: " + status);

                }
            });
        }, function (error) {
            document.getElementById("Current-Locaton-Msg").innerHTML = "Error getting current location: " + error.message;
        });
    } else {
        window.alert("Geolocation is not supported by this browser.");
    }
}

var availableRiders = [];

function SearchRide() {

    firebase.database().ref('users/' + UserId).update({availability:true});

    var ridersList = document.getElementById("ridersList");
    ridersList.innerHTML = "";
    ToggleRidersList();

    var destination = document.getElementById("SearchDropOff").value;
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': destination }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var destinationLat = results[0].geometry.location.lat();
            var destinationLng = results[0].geometry.location.lng();

            var pathRef = firebase.database().ref('ridersAvailable');
            pathRef.once('value').then(async function (snapshot) {
                var availableRiders = [];

                snapshot.forEach(async function (childSnapshot) {
                    var rider = childSnapshot.key;
                    var riderData = childSnapshot.val();
                    var riderPath = riderData.path;

                    var isPickupValid = await checkPickupLocation(riderPath);

                    if (isPickupValid) {
                        var isDestinationValid = checkDestinationLocation(riderPath, destinationLat, destinationLng);
                        if (isDestinationValid) {
                            availableRiders.push(rider);
                            updateRidersList(childSnapshot);
                        }
                    }
                });

                console.log("Available riders:", availableRiders);
            });
        } else {
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    });
}

async function checkPickupLocation(riderPath) {
    var pickup = document.getElementById("SearchPickUp").value;
    var geocoder = new google.maps.Geocoder();

    return new Promise(function (resolve) {
        geocoder.geocode({ 'address': pickup }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var pickupLat = results[0].geometry.location.lat();
                var pickupLng = results[0].geometry.location.lng();
                var pickupPoint = new google.maps.LatLng(pickupLat, pickupLng);

                for (var i = 0; i < riderPath.length; i++) {
                    var point = new google.maps.LatLng(riderPath[i][0], riderPath[i][1]);
                    var distanceToPickup = google.maps.geometry.spherical.computeDistanceBetween(pickupPoint, point);

                    var pickupRadius = 300; // Radius of 300 meters for pickup location

                    if (distanceToPickup <= pickupRadius) {
                        resolve(true);
                    }
                }
            }

            resolve(false);
        });
    });
}

function checkDestinationLocation(riderPath, destinationLat, destinationLng) {
    var destPoint = new google.maps.LatLng(destinationLat, destinationLng);

    for (var i = 0; i < riderPath.length; i++) {
        var point = new google.maps.LatLng(riderPath[i][0], riderPath[i][1]);
        var distanceToDestination = google.maps.geometry.spherical.computeDistanceBetween(destPoint, point);

        var destinationRadius = 1000; // Radius of 1 kilometer for destination

        if (distanceToDestination <= destinationRadius) {
            return true;
        }
    }

    return false;
}

function returnCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    const location = {
                        latitude,
                        longitude
                    };

                    resolve(location);
                },
                error => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

async function getUpdatedFare(fm, rr, frr, rp, fpr, rc, fcr, rn, fr, m, dp, dop, fop, frm, fpm, dt) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let fare = frm * fpm * fr * (1/m) * (dp + fop*dop - (3*dp/dt))*(1 + 0.2*(rr - rn)*frr) * (1 + 0.2*(rc - rn)*fcr) / (1 + 0.2*(rp - rn)*fpr);
        resolve(fare > fm ? fare : fm);
      }, 0);
    });
  }

  async function calculateFare() {
    const fm = 100;             // Minimum acceptable fare
    const rr = 4;               // Rider rating [1 - 5]
    const frr = 0.6;            // Rider rating factor [0 - 1]
    const rp = 4;               // Passenger rating [1 - 5]
    const fpr = 1;              // Passenger rating factor [0 - 1]
    const rc = 4;               // Car rating [1 - 5]
    const fcr = 0.6;            // Car rating factor [0 - 1]
    const rn = 4;               // Normal rating [1 - 5]
    const fr = 284;             // Fuel rate (per liter or per gallon)
    const m = 15;               // Mileage (Km/l, Km/Gal, M/l, M/Gal)
    const dp = 10;              // Passenger's distance (including off-distance)
    const dop = 2;              // Passenger's off-distance [Total off distance the rider has to travel for the passenger P&D]
    const fop = 1.5;            // Passenger off-distance rate factor
    const frm = 1.1;            // Rider mode factor [Rider's Mode: 0: En-route only (0.9), 1: Can P & D off distance (Can adjust the max range) (1.1), 2: As a taxi cab (1.2)]
    const fpm = 1.2;            // Passenger mode factor [Passenger's Mode: 0: Share with other passengers (0.8), 1: Solo Ride with the Rider (1.2), 2: As a taxi cab (Can specify exact P & D location) (1.5)]
    const dt = 12;              // Total distance of all the passengers, including off-distance
  
    try {
      const fare = await getUpdatedFare(fm, rr, frr, rp, fpr, rc, fcr, rn, fr, m, dp, dop, fop, frm, fpm, dt);
      return fare;
    } catch (error) {
      console.error("Error calculating fare:", error);
      return null;
    }
  }

function updateRidersList(Data) {
    var ridersList = document.getElementById("ridersList");
    var listItem = document.createElement("li");
    var listData = document.createElement("div");
    var listDataRight = document.createElement("div");
    var listDataLeft = document.createElement("div");
    var listButtons = document.createElement("div");
    var Name = document.createElement("span");
    var Vehicle = document.createElement("span");
    var Rating = document.createElement("span");
    var Price = document.createElement("span");
    var Passengers = document.createElement("span");
    var Distance = document.createElement("span");
    var progressBar = document.createElement("div");
    progressBar.classList.add("status-bar");
    var distance,duration;
    var Fare = calculateFare();
    console.log(Data.key);


    // Adding Progress Bar to Component
    listItem.classList.add("rider-list-component");
    listItem.appendChild(progressBar);

    // Adding Name to ListDataright
    Name.innerHTML = Data.val().name;
    Vehicle.innerHTML = `Corolla `;
    Rating.innerHTML = Data.val().Crest.rating.rating_value + " (" + Data.val().Crest.Rides.num_of_rides + ")";
    Passengers.innerHTML = `Passengers : 1`;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latLng = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
            );

            var destinationLatLng = new google.maps.LatLng(
                Data.val().lat,
                Data.val().lnt
            );
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [latLng],
                    destinations: [destinationLatLng],
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                function (response, status) {
                    if (status === google.maps.DistanceMatrixStatus.OK) {
                        distance = response.rows[0].elements[0].distance.text;
                        duration = response.rows[0].elements[0].duration.text;

                        Distance.innerHTML = `${distance} (${duration})`;
                    } else {
                        console.log(
                            "Distance Matrix request failed: " + status
                        );
                    }
                }
            );
        });
    }

    // Append Lisr Data right
    listDataRight.appendChild(Name);
    listDataRight.appendChild(Vehicle);
    listDataRight.appendChild(Rating);
    listDataLeft.appendChild(Price);
    listDataLeft.appendChild(Passengers);
    listDataLeft.appendChild(Distance);

    // Add to list Data right
    listData.appendChild(listDataRight);
    listData.appendChild(listDataLeft);

    // Adding Class List to data and its componets
    listDataRight.classList.add("rider-list-Data-right");
    listDataLeft.classList.add("rider-list-Data-left");
    listData.classList.add("rider-list-Data");
    Name.classList.add("listDataRight-Bigfont");
    Price.classList.add("listDataRight-Bigfont");
    Vehicle.classList.add("listDataRight-smallfont");
    Rating.classList.add("listDataRight-smallfont");
    Passengers.classList.add("listDataRight-smallfont");
    Distance.classList.add("listDataRight-smallfont");

    // Adding List Data To list component
    listItem.appendChild(listData);

    calculateFare().then(function(fare) {
        Fare = Math.round(fare);
        Price.innerHTML = "Rs. " + " " + Fare;
    }).catch(function(error) {
        console.error("Error calculating fare:", error);
    });

    var Requestbutton = document.createElement("button");
    Requestbutton.innerText = "Request";
    Requestbutton.classList.add("requestButton");

    Requestbutton.onclick = function () {
        firebase.database().ref('riders/' + Data.key).child('availability').once('value').then(function (snapshot) {
            if (snapshot.val()) {
                sendRequest(Data.key,distance,duration,document.getElementById("SearchPickUp").value,document.getElementById("SearchDropOff").value,Fare,Data.val().Crest);
                console.log("Request Sent");
            }
    
            else {
                console.log("Rider Not Available");
            }
        });
       
    };


    // Adding RequstButtons to listButton
    listButtons.appendChild(Requestbutton);
    listButtons.classList.add("rider-list-Buttons");

    // Adding Buttons to list component
    listItem.appendChild(listButtons);


    ridersList.appendChild(listItem); // Adding Component to Ul

    var progressBarWidth = 100;
    var interval = setInterval(function () {
        progressBar.style.width = progressBarWidth + "%";
        progressBarWidth -= 1;

        if (progressBarWidth < 0) {
            clearInterval(interval);
            listItem.remove();
        }
    }, 400);

}

function sendRequest(key,Distance,Duration,Pickup,Dropoff,Fare,crest) {
    var pathRef = firebase.database().ref('ridersAvailable/' + key + "/userReq/" + UserId);
    var UserData = getUserDataAsObject();

    data = { 
        id: UserId,
        name: UserData.full_name,
        distance: Distance,
        duration: Duration,
        pickup: Pickup,
        dropoff: Dropoff,
        fare: Fare,
        Crest:crest,
     };

    pathRef.update(data);
}

function ToggleRidersList() {
    var riderslist = document.getElementById("Riders-Show-Container");
    var userinputs = document.getElementById("Main-Controls-Area");
    riderslist.style.display = "flex";
    userinputs.style.display = "none";
}

function Cancel() {
    firebase.database().ref('users/' + UserId).update({availability:false});
    var riderslist = document.getElementById("Riders-Show-Container");
    var userinputs = document.getElementById("Main-Controls-Area");
    riderslist.style.display = "none";
    userinputs.style.display = "flex";
    clearTimeout(SearchRide);
}

function getCurrentLocation() {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            const geocoder = new google.maps.Geocoder();

            geocoder.geocode({ location: latLng }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {

                    const streetNumber = results[0].address_components.find(component => component.types.includes("street_number"));

                    const currentLocationSpan = document.getElementById("Current-Locaton");
                    currentLocationSpan.innerHTML = streetNumber ? streetNumber.short_name : results[0].address_components[0].short_name;

                    // console.log(results[0].formatted_address);
                    UserLocationMarker.setPosition(latLng);

                } else {
                    window.alert("Geocoder failed: " + status);
                }
            });
        }, function (error) {
            document.getElementById("Current-Locaton-Msg").innerHTML = "Error getting current location: " + error.message;
        });
    } else {
        window.alert("Geolocation is not supported by this browser.");
    }
}
setInterval(getCurrentLocation, 20000);

window.onload = function () {
    getCurrentLocation();
};

