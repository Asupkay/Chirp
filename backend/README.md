# Backend for Chirp
This backend is written in Node.js and consists of different realtime functionality in order to project sentiment data to users. 

## Files
* **app.js** - Main file that starts up the express server. It also handles the initial connection to the socket
* **database.js** - Handles all interaction with firebase from getting sentiment to writing language data
* **streams.js** - Starts up the streams and handles all projections that need to be done because of those streams
* **routes** - Sets up routes for the server
