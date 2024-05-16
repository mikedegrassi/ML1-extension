const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyCHmsvE2a8BENAMBoxTGX6uOOQKylzPKUo",
    authDomain: "medialab-npo-stories.firebaseapp.com",
    projectId: "medialab-npo-stories",
    storageBucket: "medialab-npo-stories.appspot.com",
    messagingSenderId: "532938405144",
    appId: "1:532938405144:web:76e03b031db9f575371a6d",
    measurementId: "G-1EXG1VZBG8"
};

const app = firebase.initializeApp(firebaseConfig);

// Verkrijg een instantie van Firestore
const db = app.firestore();

module.exports = { db };
