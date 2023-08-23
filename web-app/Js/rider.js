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

function SaveUserData(Data) {
    var jsonData = JSON.stringify(Data.val());
    localStorage.setItem("UserData", jsonData);
}

function getUserDataAsObject() {
    var UserData = localStorage.getItem("UserData");
    return JSON.parse(UserData);
}

firebase.database().ref('riders/' + UserId).once("value", snap => {
    console.log(snap.val().full_name + "(found)");

    localStorage.setItem("UserName", snap.val().full_name);
    GetUserData(snap);
    SaveUserData(snap);
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

    var caricon = {
        path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
        scale: 0.5,
        fillColor: "rgba(255, 255, 0, 0.931)",
        fillOpacity: 1,
        strokeWeight: 1,
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
                icon: caricon,
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
var UserRequests = [];
var RequestListCount = 0;

var bid = generateBid();

function calculateRoute() {

    const pickup = document.getElementById('SearchStart').value;
    const dropoff = document.getElementById('SearchEnd').value;

    const directionsService = new google.maps.DirectionsService();

    if (!directionsRenderer) {
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
        path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
        scale: 0.5,
        fillColor: "rgba(255, 255, 0, 0.931)",
        fillOpacity: 1,
        strokeWeight: 1,
        anchor: new google.maps.Point(0, 0),
        rotation: 60
    }


    directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {

            directionsRenderer.setDirections(result);

            const pickupMarker = new google.maps.Marker({
                position: result.routes[0].legs[0].start_location,
                map: map,
                icon: pickicon,
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


var LastPosition = null;

function getCurrentLocation() {
    if (navigator.geolocation) {

        console.log("Called get location");
        navigator.geolocation.getCurrentPosition(function (position) {
            const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            const geocoder = new google.maps.Geocoder();

            geocoder.geocode({ location: latLng }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    const streetNumber = results[0].address_components.find(component => component.types.includes("street_number"));
                    const currentLocationSpan = document.getElementById("Current-Locaton");
                    currentLocationSpan.innerHTML = streetNumber ? streetNumber.short_name : results[0].address_components[0].short_name;

                    if (UserLocationMarker) {
                        UserLocationMarker.setMap(null);
                    }
                    markers.forEach(marker => marker.setMap(null));
                    markers = [];

                    var customMarker = {
                        path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
                        scale: 0.5,
                        fillColor: "rgba(255, 255, 0, 0.931)",
                        fillOpacity: 1,
                        strokeWeight: 1,
                        anchor: new google.maps.Point(0, 0),
                        rotation: 0
                    }

                    UserLocationMarker = new google.maps.Marker({
                        position: latLng,
                        map: map,
                        icon: customMarker

                    });

                    markers.push(UserLocationMarker);

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
var currentlocInterval = setInterval(getCurrentLocation, 20000);



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
    var RequestSection = document.getElementById("UserRequest-Show-Container");
    var RequestList = document.getElementById("UserRequestList");
    TravelBox.style.display = "flex";
    RequestSection.style.display = "flex";
    Controll.style.display = "none";
    firebase.database().ref('riders/' + UserId).update({ availability: true });


    var Cancel_Btn = document.getElementById("CancelTravelBut");

    Cancel_Btn.onclick = function () {
        initMap();
        firebase.database().ref('riders/' + UserId).update({ availability: false });
        clearTimeout(confirmPath);
        clearInterval(PathintervalId);
        clearInterval(RequestBarInterval);
        path.remove();
        TravelBox.style.display = "none";
        RequestSection.style.display = "none";
        RequestList.innerHTML = "";
        UserRequests.forEach(li => listItem = null);
        UserRequests = [];
        Controll.style.display = "flex";
        RideStartEndToggle();
        calculateRoute();
        currentlocInterval = setInterval(getCurrentLocation, 20000);
    };

}

function SetDurationDistance(Data) {
    var origin = new google.maps.LatLng(Data.lat, Data.lnt);
    var destination = Data.Destination;

    console.log(origin + " " + destination);

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING
        },
        function (response, status) {
            if (status === google.maps.DistanceMatrixStatus.OK) {
                var distance = response.rows[0].elements[0].distance.text;
                var duration = response.rows[0].elements[0].duration.text;

                var distanceSpan = document.getElementById("DropOff");
                distanceSpan.innerHTML = distance;

                var durationSpan = document.getElementById("Travel-Time");
                durationSpan.innerHTML = duration;
            } else {
                console.log('Error: ' + status);
            }
        }
    );
}

function confirmPath() {

    var previousPosition = null;
    var Data = getUserDataAsObject();

    // firebase.database().ref('riders/' + UserId).once("value", snap => {
    //     Data = snap.val();
    // })

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

        markers.forEach(marker => marker.setMap(null));
        markers = [];

        var customMarker = {
            path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805",
            scale: 0.5,
            fillColor: "rgba(255, 255, 0, 0.931)",
            fillOpacity: 1,
            strokeWeight: 1,
            anchor: new google.maps.Point(0, 0)
        };

        var mark1 = new google.maps.Marker({
            position: userLocation,
            map: map,
            icon: customMarker,
            optimized: false
        });
        markers.push(mark1); //Remember


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
                    name: Data.full_name,
                    lat: userLat,
                    lnt: userLng,
                    Destination: destination,
                    path: pathArray,
                    Crest: Data.Crest,
                }

                RiderOwnRideData = {
                    name: Data.full_name,
                    lat: userLat,
                    lnt: userLng,
                    Destination: destination,
                    Crest: Data.Crest,
                }


                // Generate the bid only once
                bid = generateBid();

                var jsonData = JSON.stringify(RiderOwnRideData);
                localStorage.setItem("RiderOwnRideData", jsonData);


                SetTravelMode(uid, pathRef);
                pathRef.set(uid);
                console.log("path updated");

                // Setting it first
                SetDurationDistance(uid);

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

                    clearInterval(currentlocInterval);
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


                            var currentHeading = 0;
                            if (previousPosition) {
                                markers.forEach(marker => marker.setMap(null));
                                markers = []; //Remember

                                currentHeading = google.maps.geometry.spherical.computeHeading(previousPosition, updatedUserLocation);

                                mark1 = new google.maps.Marker({
                                    position: updatedUserLocation,
                                    map: map,
                                    icon: customMarker,
                                    optimized: false,
                                });
                            }
                            mark1.setIcon({
                                ...customMarker,
                                rotation: currentHeading
                            });

                            markers.push(mark1); //Remember

                            directionsService.route(updatedRequest, function (updatedResponse, updatedStatus) {
                                if (updatedStatus == google.maps.DirectionsStatus.OK) {
                                    var updatedPath = google.maps.geometry.encoding.decodePath(updatedResponse.routes[0].overview_polyline);

                                    var updatedPathArray = [];
                                    for (var i = 0; i < updatedPath.length; i++) {
                                        updatedPathArray.push([updatedPath[i].lat(), updatedPath[i].lng()]);
                                    }

                                    uid = {
                                        lat: updatedLat,
                                        lnt: updatedLng,
                                        Destination: destination,
                                        path: updatedPathArray,
                                    }

                                    polyline.setPath(updatedPath);
                                    pathRef.update(uid);

                                    // Setting it to interval
                                    SetDurationDistance(uid);

                                    console.log("Updated Path");
                                } else {
                                    console.log('Directions request failed due to ' + updatedStatus);
                                }
                            });

                            previousPosition = updatedUserLocation;

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

            if (!UserRequests[userId] && !snapshot.val().accepted) {
                addUserRequest(userId, snapshot);
            }

        });
    }
}

const RequestBarInterval = [];


function addUserRequest(userId, Data) {
    console.log("Added user To list" + userId);
    updateUserList(userId, Data);
}

// Function to generate bid

function generateBid() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let bid = '';
    const length = 10;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        bid += characters.charAt(randomIndex);
    }
    return bid;
}


function extractSmallerLocation(address) {
    var addressComponents = address.split(", ");

    var smallerLocation = "";
    if (addressComponents.length > 0) {
        smallerLocation = addressComponents[0];
    }

    return smallerLocation;
}


function updateUserList(userId, Data) {
    var UserRequestList = document.getElementById("UserRequestList");
    var listItem = document.createElement("li");
    var listData = document.createElement("div");
    var listDataleft = document.createElement("div");
    var listDataright = document.createElement("div");
    var listButtons = document.createElement("div");
    var Name = document.createElement("span");
    var Location = document.createElement("span");
    var Rating = document.createElement("span");
    var Price = document.createElement("span");
    var DropOff = document.createElement("span");
    var Distance = document.createElement("span");
    var progressBar = document.createElement("div");
    progressBar.classList.add("status-bar");
    console.log(Data.val().id);

    Pick = extractSmallerLocation(Data.val().pickup);
    Drop = extractSmallerLocation(Data.val().dropoff);

    // Adding Progress Bar to Component
    listItem.classList.add("UserRequest-list-component");
    listItem.appendChild(progressBar);

    // Adding Name to ListDataright
    Name.innerHTML = Data.val().name;
    Location.innerHTML = Pick;
    Rating.innerHTML = Data.val().Crest.rating.rating_value + " (" + Data.val().Crest.Rides.num_of_rides + ")";
    DropOff.innerHTML = Drop;
    Distance.innerHTML = `${Data.val().distance} (${Data.val().duration})`;
    Price.innerHTML = "Rs. " + Data.val().fare;

    // Append LisL Data right and Left
    listDataleft.appendChild(Name);
    listDataleft.appendChild(Distance);
    listDataleft.appendChild(Rating);
    listDataright.appendChild(Price);
    listDataright.appendChild(Location);
    listDataright.appendChild(DropOff);

    // Add to list Data 
    listData.appendChild(listDataleft);
    listData.appendChild(listDataright);

    // Adding Class List to data and its componets
    listDataleft.classList.add("UserRequest-list-Data-right");
    listDataright.classList.add("UserRequest-list-Data-left");
    listData.classList.add("UserRequest-list-Data");
    Name.classList.add("listDataRight-Bigfont");
    Price.classList.add("listDataRight-Bigfont");
    Location.classList.add("listDataRight-smallfont");
    Rating.classList.add("listDataRight-smallfont");
    DropOff.classList.add("listDataRight-smallfont");
    Distance.classList.add("listDataRight-smallfont");

    // Adding List Data To list component
    listItem.appendChild(listData);

    var Acceptbutton = document.createElement("button");
    var Declinebutton = document.createElement("button");
    Acceptbutton.innerText = "Accept";
    Declinebutton.innerText = "Decline";
    Acceptbutton.classList.add("requestButton");
    Declinebutton.classList.add("CancelRequestButton");

    Acceptbutton.onclick = function () {
        AcceptRequest(userId, Data);
    };

    Declinebutton.onclick = function () {
        DeclineRequest(Data);
    };


    // Adding RequstButtons to listButton
    listButtons.appendChild(Acceptbutton);
    listButtons.appendChild(Declinebutton);
    listButtons.classList.add("UserRequest-list-Buttons");

    // Adding Buttons to list component
    listItem.appendChild(listButtons);

    UserRequests[userId] = listItem;

    UserRequestList.appendChild(listItem); // Adding Component to Ul

    UpdateRequestCount(); //For List Count

    var progressBarWidth = 100;
    RequestBarInterval[Data.val().id] = setInterval(function () {
        progressBar.style.width = progressBarWidth + "%";
        progressBarWidth -= 1;

        if (progressBarWidth < 0) {
            clearInterval(RequestBarInterval[Data.val().id]);
            console.log("Removed Due to interval");
            if (Data.ref) {
                Data.ref.remove();
                UpdateRequestCount();
            }
            if (UserRequests[userId]) {
                UserRequests[userId].remove();
                UserRequests[userId] = null;
                UpdateRequestCount();
            }
        }
    }, 300);
}

// Function to accept request and update rider's path
function AcceptRequest(ReqId, Data) {
    var UserData = Data.val();
    var userId = localStorage.getItem("UserId");
    const riderBidRef = firebase.database().ref('riders/' + userId + '/rides');
    const availableRides = firebase.database().ref('ridersAvailable/' + userId);
    const requestedUserRequest = firebase.database().ref('ridersAvailable/' + userId + "/userReq/" + Data.val().id);
    const RidesRef = firebase.database().ref('Rides/');

    firebase.database().ref('users/' + Data.val().id).child('availability').once('value')
        .then(function (snapshot) {
            // Checking if user is available at the time of acceptance on two sides (it's a bool)
            if (snapshot.val()) {

                // removing request interval for this user
                clearInterval(RequestBarInterval[Data.val().id]);

                if (Data.ref) {
                    UpdateRequestCount();
                }

                if (UserRequests[Data.val().id]) {
                    UserRequests[Data.val().id].remove();
                    UserRequests[Data.val().id] = null;

                    UpdateRequestCount();
                }

                console.log("Request Accepted!!");

                // Check if the bid already exists in the rider's rides node as true
                riderBidRef.child(bid).once('value')
                    .then(function (bidSnapshot) {
                        // setting accepted status to true in users request
                        requestedUserRequest.child("accepted").set({
                            bid: bid,
                        });
                        if (bidSnapshot.exists() && bidSnapshot.val() === true) {
                            // If bid exists, only update the bookings with the new ReqID and UserData
                            RidesRef.child("Active/" + bid + "/Bookings/" + ReqId).set(UserData)
                                .then(function () {
                                    // sending path updates
                                    updateCheckPoints(bid);
                                    console.log("Updated bookings in Rides active node");
                                })
                                .catch(function (error) {
                                    console.log("Error updating bookings in Rides active node: " + error);
                                });
                        } else {
                            // If bid does not exist, set the bid node in the rider's rides with the boolean value true
                            riderBidRef.child(bid).set(true)
                                .then(function () {
                                    console.log("bid set to true in rider's rides: " + bid);

                                    var RiderData = localStorage.getItem("RiderOwnRideData");
                                    var riderData = JSON.parse(RiderData);

                                    RidesRef.child("Active/" + bid).set({
                                        Rider: {
                                            RiderId: userId,
                                            riderData: riderData
                                        },
                                        Bookings: {
                                            [ReqId]: UserData
                                        },
                                        Passengers: {

                                        }
                                    })
                                        .then(function () {
                                            // sending path updates
                                            updateCheckPoints(bid);
                                            console.log("added bid to Rides active node");
                                        })
                                        .catch(function (error) {
                                            console.log("Error updating bid in Rides active node: " + error);
                                        });
                                })
                                .catch(function (error) {
                                    console.log("Error setting bid to true in rider's rides: " + error);
                                });
                        }
                    })
                    .catch(function (error) {
                        console.log("Error checking if bid exists in rider's rides: " + error);
                    });

            } else {
                console.log("User Not Available");
            }
        })
        .catch(function (error) {
            console.log("Error checking user availability: " + error);
        });
}

// function to update path of current user
function updateCheckPoints(bid) {
    // initialize new map
    // initMap();
    // remove previous update interval
    clearTimeout(confirmPath);
    clearInterval(PathintervalId);

}

// function to collect priority check points
function collectPriorityPoints(){

}

// function to make collect sorted points
function collectSortedPoints(){

}

// function to continously update path and destination on map and db
function updatePath(){

}

// Function to convert place name string to LatLng object
function convertPlaceNameToLatLng(placeName) {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: placeName }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                resolve(results[0].geometry.location);
            } else {
                reject(new Error(`Geocode failed for place: ${placeName}`));
            }
        });
    });
}


function DeclineRequest(Data) {

    clearInterval(RequestBarInterval[Data.val().id]);

    if (Data.ref) {
        Data.ref.remove();

        UpdateRequestCount();
    }

    if (UserRequests[Data.val().id]) {
        UserRequests[Data.val().id].remove();
        UserRequests[Data.val().id] = null;

        UpdateRequestCount();
    }

}


function ToggleRequestList() {
    var list = document.getElementById("RequestListForToggle");
    var Arrow = document.getElementById("DownArrow");

    console.log("Called It");

    if (list.style.display === "block") {
        list.style.display = "none"

        Arrow.classList.remove("over");
        Arrow.style.transition = "all 150ms ease"

        console.log("Second");
    }

    else {
        list.style.display = "block"

        Arrow.classList.add("over");

        console.log("First");
    }
}

function UpdateRequestCount() {
    var list = document.getElementById("UserRequestList");
    var request = document.getElementById("NumberOfRequests")
    var numberOfItems = list.childElementCount;

    request.innerHTML = numberOfItems;

    if (RequestListCount < numberOfItems) {
        console.log("PlayMusic");
        var audio = new Audio('../Assets/Phone Notification Sounds.mp3');

        audio.play();
    }

    RequestListCount = numberOfItems;

}

window.onload = function () {
    getCurrentLocation();
};

