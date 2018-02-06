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