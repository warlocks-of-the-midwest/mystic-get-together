import * as _ from "lodash";
import db from "./firestore";
import data from "./db.json";

const LOGGING_TOGGLE = true;

function log(message) {
    if(LOGGING_TOGGLE) {
        console.log(message);
    }
}

export function traverseCollections(path, collectionObject) {
    let collections = _.toPairs(collectionObject);
    for (var collection of collections) {
        let collectionName = collection[0];
        let documents = _.toPairs(collection[1]);

        log('Traversing Collection -- ' + path + '/' + collectionName);

        for (var document of documents) {
            let documentPath = path + '/' + collectionName + '/' + document[0];

            traverseDocument(documentPath, document[1]);
        }
    }
}

function traverseDocument(path, documentObject) {
    let subcollections = {};
    let attributes = {};

    // Sort into Attributes and Subcollection 
    let document = _.toPairs(documentObject);
    for(var attribute of document) {
        let attributeName = attribute[0];
        let attributeValue = attribute[1];
        
        let isSubCollection = attributeName[0] >= 'A' && attributeName[0] <= 'Z';

        if(isSubCollection) {
            subcollections = _.merge({}, subcollections, _.fromPairs([[attributeName, attributeValue]]));
        } else {
            attributes = _.merge({}, attributes, _.fromPairs([[attributeName, attributeValue]]));
        }
    }

    // Create Document w/ Attributes
    createDocument(path, attributes);

    // Create Subcollections in Document
    for(var subCollection of  _.toPairs(subcollections)) {
        traverseCollections(path, _.fromPairs([subCollection]));
    }
}

function createDocument(path, body) {
    log('Creating Document     -- ' + path + '\n' + JSON.stringify(body, null, '  ') + '\n');
    db.doc(path).set(body);
}

function createSubCollection(path, subcollections) {
    for(var subCollection of  _.toPairs(subcollections)) {
        traverseCollections(path, subCollection);
    }
}

traverseCollections('',data);

console.log("DONE");