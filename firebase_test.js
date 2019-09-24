  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyA8kVIp6oE9m-I-FsoZBZbrOwA62QrlRko",
    authDomain: "party-finder-7a403.firebaseapp.com",
    databaseURL: "https://party-finder-7a403.firebaseio.com",
    projectId: 'party-finder-7a403',
    storageBucket: "party-finder-7a403.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();
