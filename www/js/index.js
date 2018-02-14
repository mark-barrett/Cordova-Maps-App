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

        var div = document.getElementById("map_canvas1");

        map = plugin.google.maps.Map.getMap(div);

        map.addEventListener(plugin.google.maps.event.MAP_READY, function onMapInit(map) {
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