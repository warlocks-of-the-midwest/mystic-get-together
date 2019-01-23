import firebase from 'firebase';
import 'firebase/firestore';
import config  from './config.json';

// DB Initialization
export const app = firebase.initializeApp(config);
const db = firebase.firestore(app);

db.settings({
    timestampsInSnapshots: true
});

export default db;