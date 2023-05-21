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

firebase.database().ref('users/' + UserId).on("value", snap => {
    console.log(snap.val().full_name + "(found)");

    GetUserData(snap);
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

var availableRiders = [];

// function SearchRide() {
//     var pickupLocation = document.getElementById("SearchPickUp").value;
//     var destination = document.getElementById("SearchDropOff").value;
//     var geocoder = new google.maps.Geocoder();
//     var pickupLat, pickupLng, destinationLat, destinationLng;

//     geocoder.geocode({ 'address': pickupLocation }, function (results, status) {
//         if (status == google.maps.GeocoderStatus.OK) {
//             pickupLat = results[0].geometry.location.lat();
//             pickupLng = results[0].geometry.location.lng();

//             geocoder.geocode({ 'address': destination }, function (results, status) {
//                 if (status == google.maps.GeocoderStatus.OK) {
//                     destinationLat = results[0].geometry.location.lat();
//                     destinationLng = results[0].geometry.location.lng();

//                     var pathRef = firebase.database().ref('ridersAvailable');
//                     pathRef.once('value').then(function (snapshot) {
//                         snapshot.forEach(function (childSnapshot) {
//                             var rider = childSnapshot.key;
//                             var riderData = childSnapshot.val();
//                             var riderPath = riderData.path;
//                             var riderDestLat = riderData.destinationLat;
//                             var riderDestLng = riderData.destinationLng;

//                             var closestDistance = Infinity;
//                             for (var i = 0; i < riderPath.length; i++) {
//                                 var pathPoint = new google.maps.LatLng(riderPath[i][0], riderPath[i][1]);
//                                 var distanceToPickup = google.maps.geometry.spherical.computeDistanceBetween(pathPoint, new google.maps.LatLng(pickupLat, pickupLng));
//                                 if (distanceToPickup < closestDistance) {
//                                     closestDistance = distanceToPickup;
//                                 }
//                             }
//                             var maxDistance = 200;
//                             if (closestDistance > maxDistance) {

//                                 return;
//                             }

//                             var lastPointIndex = riderPath.length - 1;
//                             var lastPoint = new google.maps.LatLng(riderPath[lastPointIndex][0], riderPath[lastPointIndex][1]);
//                             var destPoint = new google.maps.LatLng(destinationLat, destinationLng);
//                             var distanceToDest = google.maps.geometry.spherical.computeDistanceBetween(lastPoint, destPoint);
//                             var maxDistanceToDest = 1000;
//                             if (distanceToDest > maxDistanceToDest) {
//                                 return;
//                             }

//                             availableRiders.add(rider);
//                         });

//                         console.log("Available riders:", Array.from(availableRiders));
//                     });
//                 } else {
//                     console.log('Geocode was not successful for the following reason: ' + status);
//                 }
//             });
//         } else {
//             console.log('Geocode was not successful for the following reason: ' + status);
//         }
//     });
// }

// function SearchRide() {
//     var destination = document.getElementById("SearchDropOff").value;
//     var geocoder = new google.maps.Geocoder();
//     var destinationLat, destinationLng;
//     var pickup = document.getElementById("SearchPickUp").value;
//     var pickupLatLng;
//     var availableRiders = new Set();

//     geocoder.geocode({ 'address': destination }, function (results, status) {
//         if (status == google.maps.GeocoderStatus.OK) {
//             destinationLat = results[0].geometry.location.lat();
//             destinationLng = results[0].geometry.location.lng();

//             geocoder.geocode({ 'address': pickup }, function (results, status) {
//                 if (status == google.maps.GeocoderStatus.OK) {
//                     pickupLatLng = results[0].geometry.location;

//                     var pathRef = firebase.database().ref('ridersAvailable');
//                     pathRef.once('value').then(function (snapshot) {
//                         snapshot.forEach(function (childSnapshot) {
//                             var rider = childSnapshot.key;
//                             var riderData = childSnapshot.val();
//                             var riderPath = riderData.path;

//                             var lastPointIndex = riderPath.length - 1;
//                             var lastPoint = new google.maps.LatLng(riderPath[lastPointIndex][0], riderPath[lastPointIndex][1]);
//                             var destPoint = new google.maps.LatLng(destinationLat, destinationLng);
//                             var distanceToDest = google.maps.geometry.spherical.computeDistanceBetween(lastPoint, destPoint);
//                             var maxDistance = 1000;
//                             if (distanceToDest > maxDistance) {
//                                 return;
//                             }

//                             var prevPoint = new google.maps.LatLng(riderPath[lastPointIndex - 1][0], riderPath[lastPointIndex - 1][1]);
//                             var destBearing = google.maps.geometry.spherical.computeHeading(prevPoint, destPoint);
//                             var lastBearing = google.maps.geometry.spherical.computeHeading(prevPoint, lastPoint);
//                             var bearingDifference = Math.abs(destBearing - lastBearing);
//                             if (bearingDifference > 90) {
//                                 return;
//                             }

//                             var pickupDistance = google.maps.geometry.spherical.computeDistanceBetween(pickupLatLng, lastPoint);
//                             if (pickupDistance <= 500) {
//                                 var destDistance = google.maps.geometry.spherical.computeDistanceBetween(destPoint, lastPoint);
//                                 if (destDistance <= 1000) {
//                                     availableRiders.add(rider);
//                                 }
//                             }
//                         });

//                         console.log("Available riders:", availableRiders);
//                     });
//                 } else {
//                     console.log('Geocode was not successful for the following reason: ' + status);
//                 }
//             });
//         } else {
//             console.log('Geocode was not successful for the following reason: ' + status);
//         }
//     });
// }  

// function SearchRide() {
//     var destination = document.getElementById("SearchDropOff").value;
//     var geocoder = new google.maps.Geocoder();
//     var destinationLat, destinationLng;
//     var pickup = document.getElementById("SearchPickUp").value;
//     var pickupLatLng;
//     var availableRiders = [];

//     geocoder.geocode({ 'address': destination }, function (results, status) {
//         if (status == google.maps.GeocoderStatus.OK) {
//             destinationLat = results[0].geometry.location.lat();
//             destinationLng = results[0].geometry.location.lng();

//             geocoder.geocode({ 'address': pickup }, function (results, status) {
//                 if (status == google.maps.GeocoderStatus.OK) {
//                     pickupLatLng = results[0].geometry.location;

//                     var pathRef = firebase.database().ref('ridersAvailable');
//                     pathRef.once('value').then(function (snapshot) {
//                         snapshot.forEach(function (childSnapshot) {
//                             var rider = childSnapshot.key;
//                             var riderData = childSnapshot.val();
//                             var riderPath = riderData.path;

//                             var lastPointIndex = riderPath.length - 1;
//                             var lastPoint = new google.maps.LatLng(riderPath[lastPointIndex][0], riderPath[lastPointIndex][1]);
//                             var destPoint = new google.maps.LatLng(destinationLat, destinationLng);
//                             var distanceToDest = google.maps.geometry.spherical.computeDistanceBetween(lastPoint, destPoint);
//                             var maxDistance = 1000;
//                             if (distanceToDest > maxDistance) {
//                                 return;
//                             }

//                             var prevPoint = new google.maps.LatLng(riderPath[lastPointIndex - 1][0], riderPath[lastPointIndex - 1][1]);
//                             var destBearing = google.maps.geometry.spherical.computeHeading(prevPoint, destPoint);
//                             var lastBearing = google.maps.geometry.spherical.computeHeading(prevPoint, lastPoint);
//                             var bearingDifference = Math.abs(destBearing - lastBearing);
//                             if (bearingDifference > 90) {
//                                 return;
//                             }

//                             var pickupDistance = google.maps.geometry.spherical.computeDistanceBetween(pickupLatLng, lastPoint);
//                             var pickupRange = 200; // meters
//                             if (pickupDistance <= pickupRange) {
//                                 var destDistance = google.maps.geometry.spherical.computeDistanceBetween(destPoint, lastPoint);
//                                 var destinationRange = 1000; // meters
//                                 if (destDistance <= destinationRange) {
//                                     availableRiders.push(rider);
//                                 }
//                             }
//                         });

//                         console.log("Available riders:", availableRiders);
//                         // Perform further actions with the available rider keys
//                     });
//                 } else {
//                     console.log('Geocode was not successful for the following reason: ' + status);
//                 }
//             });
//         } else {
//             console.log('Geocode was not successful for the following reason: ' + status);
//         }
//     });
// }

function SearchRide() {
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

