auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.replace('../Html/riderlogin.html?#');
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

firebase.database().ref('riders/' + UserId).on("value", snap => {
    console.log(snap.val().full_name + "(found)");

    localStorage.setItem("UserName", snap.val().full_name);
    GetUserData(snap);
})

const UserName = localStorage.getItem("UserName");

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

    var SearchStart = new google.maps.places.SearchBox(document.getElementById('SearchStart'));
    var SearchEnd = new google.maps.places.SearchBox(document.getElementById('SearchEnd'));

    google.maps.event.addListener(SearchStart, 'places_changed', function () {

        var places = SearchStart.getPlaces();
        var bounds = new google.maps.LatLngBounds();
        var i, place;

        for (i = 0; place = places[i]; i++) {
            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
        map.setZoom(15);
        ConfirmRide();

    });

    google.maps.event.addListener(SearchEnd, 'places_changed', function () {

        var places = SearchEnd.getPlaces();
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

    // clearBtn.style.visibility = (document.getElementById('SearchStart').value.length) ? "visible" : "hidden";

    if (document.getElementById('SearchStart').value.length) {
        clearBtn.style.visibility = "visible";
    }

    else {
        clearBtn.style.visibility = "hidden";
        ConfirmRide();
        initMap();
    }

    clearBtn.onclick = function () {
        this.style.visibility = "hidden";
        document.getElementById('SearchStart').value = "";
        ConfirmRide();
        initMap();
    };

}

function ClearDropOffValue() {
    var clearBtn = document.getElementById("clearDrop")

    // clearBtn.style.visibility = (document.getElementById('SearchEnd').value.length) ? "visible" : "hidden";

    if (document.getElementById('SearchEnd').value.length) {
        clearBtn.style.visibility = "visible";
    }

    else {
        clearBtn.style.visibility = "hidden";
        ConfirmRide();
        initMap();
    }

    clearBtn.onclick = function () {
        this.style.visibility = "hidden";
        document.getElementById('SearchEnd').value = "";
        ConfirmRide();
        initMap();
    };
}


let directionsRenderer;
let markers = [];

function calculateRoute() {

    const pickup = document.getElementById('SearchStart').value;
    const dropoff = document.getElementById('SearchEnd').value;

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


function RideStartEndToggle() {
    var pickupInput = document.getElementById('SearchStart');
    var dropoffInput = document.getElementById('SearchEnd');

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
    var pickup = document.getElementById('SearchStart').value;
    var dropoff = document.getElementById('SearchEnd').value;
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

// function confirmPath() {
//     console.log("Path Confirmed");
// }


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


function StartfromCurrentLocation() {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            const geocoder = new google.maps.Geocoder();

            geocoder.geocode({ location: latLng }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {

                    const streetNumber = results[0].address_components.find(component => component.types.includes("street_number"));

                    const StartPoint = document.getElementById("SearchStart");
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

var PathintervalId;

function SetTravelMode(Data, path) {
    console.log(Data.name + " Called Function SetTravelMode");
    var Controll = document.getElementById("Main-Controls-Area");
    var TravelBox = document.getElementById("Travel-Mode-Container");
    TravelBox.style.display = "flex";
    Controll.style.display = "none";

    var Cancel_Btn = document.getElementById("CancelTravelBut");
    Cancel_Btn.innerText = "Cancel";

    Cancel_Btn.onclick = function () {
        clearTimeout(confirmPath);
        clearInterval(PathintervalId);
        path.remove();
        TravelBox.style.display = "none";
        Controll.style.display = "flex";
    };

}

function confirmPath() {
    navigator.geolocation.getCurrentPosition(function (position) {
        var userLat = position.coords.latitude;
        var userLng = position.coords.longitude;
        var userLocation = new google.maps.LatLng(userLat, userLng);

        var destination = document.getElementById("SearchEnd").value;

        var directionsService = new google.maps.DirectionsService();

        var request = {
            origin: userLocation,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var path = google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline);

                var pathArray = [];
                for (var i = 0; i < path.length; i++) {
                    pathArray.push([path[i].lat(), path[i].lng()]);
                }

                var uid = firebase.auth().currentUser.uid;
                var pathRef = firebase.database().ref('ridersAvailable/' + uid);

                uid = {
                    name: UserName,
                    lat: userLat,
                    lnt: userLng,
                    path: pathArray,
                }


                SetTravelMode(uid, pathRef);
                pathRef.set(uid);
                console.log("path updated");

                if (pathArray.length > 0) {

                    var polyline = new google.maps.Polyline({
                        path: path,
                        polylineOptions: {
                            strokeColor: '#000000',
                            strokeOpacity: 0.8,
                            strokeWeight: 5
                        },
                        map: map
                    });

                    directionsRenderer.setMap(null);
                    markers.forEach(marker => marker.setMap(null));
                    markers = [];
                    map.panTo(userLocation);

                    PathintervalId = setInterval(function () {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var updatedLat = position.coords.latitude + (Math.random() * 0.001 - 0.0005);
                            var updatedLng = position.coords.longitude + (Math.random() * 0.001 - 0.0005);
                            var updatedUserLocation = new google.maps.LatLng(updatedLat, updatedLng);
                            map.panTo(updatedUserLocation);

                            var updatedRequest = {
                                origin: updatedUserLocation,
                                destination: destination,
                                travelMode: google.maps.TravelMode.DRIVING
                            };

                            directionsService.route(updatedRequest, function (updatedResponse, updatedStatus) {
                                if (updatedStatus == google.maps.DirectionsStatus.OK) {
                                    var updatedPath = google.maps.geometry.encoding.decodePath(updatedResponse.routes[0].overview_polyline);

                                    var updatedPathArray = [];
                                    for (var i = 0; i < updatedPath.length; i++) {
                                        updatedPathArray.push([updatedPath[i].lat(), updatedPath[i].lng()]);
                                    }

                                    uid = {
                                        name: UserName,
                                        lat: updatedLat,
                                        lnt: updatedLng,
                                        path: updatedPathArray,
                                    }

                                    polyline.setPath(updatedPath);
                                    pathRef.update(uid);
                                    console.log("Updated Path");
                                } else {
                                    console.log('Directions request failed due to ' + updatedStatus);
                                }
                            });
                        });

                        CheckReq();

                    }, 5000);

                }
            } else {
                console.log('Directions request failed due to ' + status);
            }
        });
    }, function (error) {
        console.log(error);
    });
}

function CheckReq() {
    if (firebase.database().ref('ridersAvailable/' + UserId + "/userReq")) {
        var userReqRef = firebase.database().ref('ridersAvailable/' + UserId + "/userReq");
        userReqRef.on("child_added", function (snapshot) {

            var requestData = snapshot.val();

            var userId = snapshot.key;
            // var pickupLocation = requestData.pickupLocation;
            // var destination = requestData.destination;

            addUserRequest(userId);

            setTimeout(function () {
                snapshot.ref.remove();
            }, 15000);
        });
    }
}

function addUserRequest(userId) {
    console.log(userId);
}

window.onload = function () {
    getCurrentLocation();
};

