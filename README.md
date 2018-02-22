# Cordova-Maps-App
| Requirement                                                                                                                                                                                                                    | Phase | Points               | Status     |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|----------------------|------------|
| A geolocation service where from one may get the latitude and longitude if certain address is given as parameter by user.                                                                                                      | 1     | 5                    | Complete   |
| Based on the parameters given in a map displayed on a marker, is placed on the location of the address or Latitude / longitude location user specified.                                                                        | 1     | 5                    | Complete   |
| Based on the location information from The GPS sensor is a mobile device with the Latitude and longitude information displayed on the location of the mobile device.                                                           | 1     | 5                    | Complete   |
| Based on the location of the GPS sensor is a mobile device and a map is displayed marker, is placed on the location of the mobile device.                                                                                      | 1     | 5                    | Complete   |
| There is functionality for the user to be able to get the distance between two markers on the map.                                                                                                                             | 2     | 10                   | Complete   |
| There is functionality for the user to be able to get directions and distance between two markers on the map how to navigate from point A to point B (ie navigation instructions).                                             | 3     | 10                   | Complete |
| There is functionality for the user to be able to put some basic information into a database based on the location he or she has specified earlier. This information may be for example "a hole on the road at this location". | 4     | 10 This is a Grade 5 | Incomplete |
| There is a functionality for user to be abto images to database based on the address or Latitude / longitude location he or she has specified.                                                                                 | 5     | 10                   | Complete |
| The users can get the information what other users have put on the database and see the information users have put in to the database as markers on the map.                                                                   | 6     | 20                   | Complete |

**Total Points: 20 (Small Exercise) + 40 (Above)**

This is a Cordova Mobile Application that implements a number of requirements that are specified in the README.

- You can add your address to the top search bar and it will find that location on the map and put a marker there. It will also put the longitude and latitude of the address too.

- You can pick a marker on the map by selecting where you want it. A marker will be put there. Then by clicking "Get Distance Between Points" will calculate the distance between the points and put a line on the map beween those two points.

- To delete a marker click it and then click the info window and it will dissapear.

- To get directions you must use the same idea as above, select two points and lick "Get Directions Between Points" and it will display the directions between those points below the buttons if they can be found.

- You can get the devices GPS location which will zoom the camera to that marker and then display the longitude and latitude for that position. This can then be used to get directions to or the distance between it and another point.

- The database is also implemented. The database is a basic SQL database that is hosted on my own domain and is edited using PHPMyAdmin. There is two PHP scripts found in the "database" folder in the project folder. These are used to get all the co-ordinates for the maps markers and also for adding a new marker to the database.

- When the user opens the app, the markers from the database are placed on the map. These markers can be added to by the user. Every user that has the app will see the markers that other users have added on the database.

- The user can add a new marker which will be added to the database by click and holding the map at a particular location. The user is then prompted to enter a description of the marker. This is then saved to the database.