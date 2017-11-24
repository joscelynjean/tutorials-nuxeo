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
nuxeo.repository()
    // These headers allow us to retrieve the associated contract owner in the same call
    .header('depth', 'max')
    .header('fetch.document', 'properties')
    // We'll also retrieve the document hierarchy
    .enricher('document', 'breadcrumb')
    .fetch('/default-domain/workspaces/North America/awesome-tech/skynet-ai-maintenance')
    .then(contract => {
        console.log('Contract has been retrieved:');
        console.log(contract);
        console.log(`\nAnd here is the document's hierarchy to build a breadcrumb navigation:`);
        console.log(contract.contextParameters.breadcrumb);
    })
    .catch(error => {
        console.log(error);
    });