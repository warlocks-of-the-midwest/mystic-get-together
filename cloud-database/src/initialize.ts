import * as _ from "lodash";
import db from "./firestore";
import data from "./db.json"; // Initialization Data

const LOGGING_TOGGLE = true;

// visit data object and create firestore documents
visitCollections('',data);
console.log("DONE");

export function visitCollections(path, collectionObject) {
    for (var collection of _.toPairs(collectionObject)) {
        let collectionName = collection[0];
        let documents = _.toPairs(collection[1]);

        log('Visiting Collection -- ' + path + '/' + collectionName);

        // visit documents within collection
        for (var document of documents) {
            let documentPath = path + '/' + collectionName + '/' + document[0];

            visitDocument(documentPath, document[1]);
        }
    }
}

function visitDocument(path, documentObject) {
    let subcollections = {};
    let attributes = {};

    // Sort Document into Attributes and Subcollections
    let document = _.toPairs(documentObject);
    for(var attribute of document) {
        // Subcollection names start with a capital letter
        let attributeName = attribute[0];
        let isSubCollection = attributeName[0] >= 'A' && attributeName[0] <= 'Z';

        if(isSubCollection) {
            subcollections = _.merge({}, subcollections, _.fromPairs([attribute]));
        } else {
            attributes = _.merge({}, attributes, _.fromPairs([attribute]));
        }
    }

    // Create Document w/ Attributes
    createDocument(path, attributes);

    // Create Subcollections within Document
    visitCollections(path, subcollections);
}

function createDocument(path, body) {
    log('Creating Document     -- ' + path + '\n' + JSON.stringify(body, null, '  ') + '\n');
    db.doc(path).set(body);
}

function log(message) {
    if(LOGGING_TOGGLE) {
        console.log(message);
    }
}