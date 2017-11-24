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
var contractToFetch = '/default-domain/workspaces/North America/awesome-tech/skynet-ai-maintenance';
nuxeo.repository()
    .fetch(contractToFetch)
    .then(function(contract) {
        return contract.followTransition('undelete');
    })
    .then(function(contract) {
        console.log('Contract state has been changed. Contract is now as follows:');
        console.log(contract);
    })
    .catch(function(error) {
        console.log('Apologies, an error occurred while changing the contract state.');
        console.log(error);
    });