/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var map;

var distanceBetweenArray = [];

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // Binding an Event Listener to the address form submission
        document.getElementById('searchAddress').addEventListener('click', searchAddress, false);

        // Binding an Event Listener to get the devices GPS location
        document.getElementById('getGPSLocation').addEventListener('click', getGPSLocation, false);

        // Binding an Event Listener to caluclate the distance between the two points in the distance between array
        document.getElementById('getDistance').addEventListener('click', getDistance, false);

        // Binding an Event for getting directions between two points
        document.getElementById('getDirections').addEventListener('click', getDirections, false);

        var div = document.getElementById("map_canvas1");

        map = plugin.google.maps.Map.getMap(div);

        map.addEventListener(plugin.google.maps.event.MAP_READY, function onMapInit(map) {

            // Event listener for touching the map to add markers for distance between
            map.addEventListener(plugin.google.maps.event.MAP_CLICK, function mapClicked(latLng) {
                
                var markersIndex = 0;

                // Add a marker to the screen at that location
                map.addMarker({
                    position: latLng,
                    title: 'Marker Location:',
                    snippet: "Lat:"+latLng.lat+" Long:"+latLng.lng,
                    animation: plugin.google.maps.Animation.DROP
                }, function(marker) {
                    // Open the info window
                    marker.showInfoWindow();

                    // We want to do stuff if the marker is clicked. If it is clicked then we add it's location
                    // to the global distance array. If there are no elements add it. If there is one element add it.
                    // If there are two elements clear it and add it to the first.
                    if(distanceBetweenArray.length == 2 || distanceBetweenArray.length == 0) {
                        distanceBetweenArray = [latLng];
                        // Stores the markers index in the distance between array to remove later
                        markersIndex = 0;
                    } else if(distanceBetweenArray.length == 1) {
                        distanceBetweenArray.push(latLng);
                        // Stores the markers index in the distance between array to remove later
                        markersIndex = 1;
                    }

                    // If the marker's info window is closed then it gets removed.
                    marker.on(plugin.google.maps.event.INFO_CLICK, function(){

                        // Remove an entry like that from the distance between array so
                        // another marker can takes its place.

                        // Remove the co-ordinates from that array.
                        distanceBetweenArray.splice(markersIndex, 1);

                        // Remove the marker
                        marker.remove();
                    });
                });
            });

            // This is long clicking to add personal markers with messages.
            map.addEventListener(plugin.google.maps.event.MAP_LONG_CLICK, function mapClicked(latLng) {

                // Prompt the user to enter something about this location for the marker.
                var locationDescription = prompt("Please enter information about this location.", "");
                // Check to make sure they entered something.
                if (locationDescription != null || locationDescription != "") {
                    map.addMarker({
                    position: latLng,
                    title: 'Your Location:',
                    snippet: locationDescription,
                    animation: plugin.google.maps.Animation.DROP
                }, function(marker) {
                    // Open the info window
                    marker.showInfoWindow();

                    // If the marker's info window is closed then it gets removed.
                    marker.on(plugin.google.maps.event.INFO_CLICK, function(){
                        // Remove the marker
                        marker.remove();
                    });
                });
                }
            });
        });

        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

// Function for searching for address
function searchAddress(event) {
    // Get the value in the submitted form field (the entered address)
    // Replace spaces with pluses (what Google wants)
    var address = document.getElementById('address').value.split(' ').join('+');

    // Make a request to the Google Geocode API
    var response = JSON.parse(Http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyCVYauFMf2WENMc2WRYxRpco4luGzmfmII'));

    // Parse the data for the longitude and latitude
    var longitude = response.results[0].geometry.location.lng;
    var latitude = response.results[0].geometry.location.lat

    // Now display it on the app screen.
    var lat_long_div = document.getElementById('lat_long_div');
    lat_long_div.innerHTML = '<div class="card"><div class="card-body">'+
    '<strong>Longitude:</strong> '+longitude+'<br/>'+
    '<strong>Latitude:</strong> '+latitude+
    '</div></div>'

    var responseShortAddress = response.results[0].address_components[0].short_name;

    map.addMarker({
        'position': {"lat": latitude, "lng": longitude},
        'title': [responseShortAddress].join("\n"),
        'snippet': "Lat:"+latitude+" Long:"+latitude
    }, function(marker) {
        marker.showInfoWindow();

        var LOCATION = {"lat": latitude, "lng": longitude};

        map.moveCamera({
          'target': LOCATION,
          'tilt': 0,
          'zoom': 18,
          'bearing': 140
        }, function() {
          console.log("Camera position changed.");
        });
    });
}

// Function for getting the device's GPS location
function getGPSLocation(event) {
    map.clear();
    map.getMyLocation(function onSuccess(location) {
        map.addMarker({
            'position': {"lat": location.latLng.lat, "lng": location.latLng.lng},
            'title': 'Your Device GPS Location',
            'snippet': "Lat:"+location.latLng.lat+" Long:"+location.latLng.lng
        }, function(marker) {
            marker.showInfoWindow();

            var LOCATION = {"lat": location.latLng.lat, "lng": location.latLng.lng};

            map.moveCamera({
              'target': LOCATION,
              'tilt': 0,
              'zoom': 18,
              'bearing': 140
            }, function() {
              console.log("Camera position changed.");
        });
    });
    }, function onError() {
        alert('Cannot get devices location.');
    });
}

// Function for getting the distance between two markers
function getDistance(event) {
    // First check that there are two entries in the distance between array.
    // If not, tell the user to enter them.
    if(distanceBetweenArray.length != 2) {
        alert('You must have 2 markers on the map.');
    } else {
        // Let's calculate the distance.
        var distance = plugin.google.maps.geometry.spherical.computeDistanceBetween(distanceBetweenArray[0], distanceBetweenArray[1])

        var distance_div = document.getElementById('distance_div');
        distance_div.innerHTML = '<div class="card"><div class="card-body">'+
        'Distance: '+distance+' meters'+
        '</div></div>'

        map.addPolyline({
            'points': distanceBetweenArray,
            'color': '#1EB4FA',
            'width': 10,
            'geodesic': true
        })
    }
}

// Function for getting directions between two markers.
function getDirections(event) {
    // First check that there are two entries in the distance between array.
    // If not, tell the user to enter them.
    if(distanceBetweenArray.length != 2) {
        alert('You must have 2 markers on the map.');
    } else {
        // Now lets get the contents of both:
        var origin = distanceBetweenArray[0].lat+","+distanceBetweenArray[0].lng;
        var destination = distanceBetweenArray[1].lat+","+distanceBetweenArray[1].lng;

        // Now let us make a request to the Google Maps Directions API.
        var response = JSON.parse(Http.get('https://maps.googleapis.com/maps/api/directions/json?origin='+origin+'&destination='+destination+'&key=AIzaSyCVYauFMf2WENMc2WRYxRpco4luGzmfmII'));
        
        // Now that we have a response we have to make sense of it.
        var distance = response.routes[0].legs[0].distance.text;
        var duration = response.routes[0].legs[0].duration.text;
        var end_address = response.routes[0].legs[0].end_address;
        var end_location = response.routes[0].legs[0].end_location;
        var start_address = response.routes[0].legs[0].start_address;
        var start_location = response.routes[0].legs[0].start_location;

        var directions_div = document.getElementById('directions_div');

        directions_div.innerHTML = ' ';

        // Now loop through the steps and get the directions
        for(var i=0; i<response.routes[0].legs[0].steps.length; i++) {
            directions_div.innerHTML += '<div class="card"><div class="card-body">'+
            response.routes[0].legs[0].steps[i].html_instructions+' for '+response.routes[0].legs[0].steps[i].distance.text+
            '<br/>Duration: '+response.routes[0].legs[0].steps[i].duration.text+' By: '+response.routes[0].legs[0].steps[i].travel_mode+
            '</div></div><br/>'
        }
    }
}

// HTTP Client functions for contacting the API
class Http {
    static get(url) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false); // false for synchronous request
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }
}

app.initialize();