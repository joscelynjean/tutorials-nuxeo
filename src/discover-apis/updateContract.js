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
// Further calls will return all schemas when fetching a document
// Note that it can easily be overridden on a per call basis if needed
nuxeo.schemas('*');
var contractToFetch = '/default-domain/workspaces/North America/awesome-tech/skynet-ai-maintenance';
// We're updating a complex and multi-valued property here
// Multi-valued properties are expressed as arrays, complex properties as objects
// So we're creating an object array here
var propertiesToUpdate = {
    'bccontract:customClauses': [{
        'label': 'Automatic Subscription Renewal',
        'content': 'In case the user has not cancelled its subscription one month before the contract\'s expiration date, the contract will automatically be renewed for one more year.'
    }, {
        'label': 'Payment Conditions',
        'content': 'When an automatic subscription renewal is triggered, the user will need to pay the annual amount due. This amount will not be refunded if the contract is stopped before its new expiration date.'
    }]
};
// And now we launch the actual update
nuxeo.repository()
    .fetch(contractToFetch)
    .then(function(contract) {
        contract.set(propertiesToUpdate);
        return contract.save();
    })
    .then(function(contract) {
        console.log('Contract has been updated. Custom clauses are now as follows:');
        console.log(contract.properties['bccontract:customClauses']);
    })
    .catch(function(error) {
        console.log('Apologies, an error occurred while updating the contract.');
        console.log(error);
    });