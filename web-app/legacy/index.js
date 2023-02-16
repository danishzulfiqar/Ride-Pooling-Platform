function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 33.6844, lng: 73.0479 }
    });
    directionsDisplay.setMap(map);

    //  For Changes text and submition
    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
        // calculateDistance();
    };

    document.getElementById('submit').addEventListener('click', onChangeHandler);
    // For Changes 


}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: document.getElementById('from').value,
        destination: document.getElementById('to').value,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}


// function calculateDistance() {
//     var origin = document.getElementById('from').value;
//     var destination = document.getElementById('to');
//     var service = new google.maps.DistanceMatrixService();
//     service.getDistanceMatrix(
//         {
//             origins: [origin],
//             destinations: [destination],
//             travelMode: google.maps.TravelMode.DRIVING,
//             unitSystem: google.maps.UnitSystem.IMPERIAL, // miles and feet.
//             avoidHighways: false,
//             avoidTolls: false
//         }, callback);
// }

// function callback(response, status) {
//     if (status != google.maps.DistanceMatrixStatus.OK) {
//         $('#result').html(err);
//     } else {
//         var origin = response.originAddresses[0];
//         var destination = response.destinationAddresses[0];
//         if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
//            console.log("Error");
//         } else {
//             var distance = response.rows[0].elements[0].distance.text;
//             console.log(response.rows[0].elements[0].distance);
//             var distance_in_kilo = distance.value / 1000; 
//             $('#outputNum').text(distance_in_kilo.toFixed(2));
//         }
//     }
// }