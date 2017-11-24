#!/usr/bin/env node
const config = require('./config.js');
const Nuxeo = require('nuxeo');
const nuxeo = new Nuxeo({
    baseURL: config.baseURL,
    auth: {
        method: 'basic',
        username: 'Administrator',
        password: 'Administrator'
    }
});
var contractToDelete = '/default-domain/workspaces/North America/Caterer/2015 Annual Conference';
nuxeo.repository()
    .delete(contractToDelete)
    .then(function(res) {
        console.log('Contract has been deleted permanently. Bye bye contract!')
            // res.status === 204
    })
    .catch(function(error) {
        console.log('Apologies, an error occurred while deleting the contract.');
        console.log(error);
    });