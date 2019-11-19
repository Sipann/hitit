const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');

var serviceAccount = require('./env/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hitit-3753e.firebaseio.com"
});

const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs.js');
const resolvers = require('./resolvers.js');

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: "/", cors: true });

exports.graphql = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
