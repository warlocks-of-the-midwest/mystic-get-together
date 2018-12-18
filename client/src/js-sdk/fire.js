import firebase from 'firebase'
import 'firebase/firestore'
var config = {
    apiKey: "AIzaSyD-ZDutz248kz-PYKtJ7oEGQe6wNWVm6qU",
    authDomain: "mystic-get-together.firebaseapp.com",
    databaseURL: "https://mystic-get-together.firebaseio.com",
    projectId: "mystic-get-together",
    storageBucket: "mystic-get-together.appspot.com",
    messagingSenderId: "847755874279"
};
var app = firebase.initializeApp(config);
var db = firebase.firestore(app);
db.settings({
    timestampsInSnapshots: true
});
export default db;
